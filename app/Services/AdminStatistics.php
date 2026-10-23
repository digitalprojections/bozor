<?php

namespace App\Services;

use Carbon\CarbonImmutable;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class AdminStatistics
{
    public function build(int $days): array
    {
        $end = CarbonImmutable::now('UTC')->startOfDay()->addDay();
        $start = $end->subDays($days);
        $previousStart = $start->subDays($days);
        $listingStatuses = $this->listings()->selectRaw('status, COUNT(*) as total, COALESCE(SUM(views), 0) as views, SUM(CASE WHEN is_auction = ? THEN 1 ELSE 0 END) as auctions', [true])->groupBy('status')->get();
        $users = DB::table('users')->where('is_guest', false)->selectRaw('COUNT(*) as total, SUM(CASE WHEN email_verified_at IS NOT NULL THEN 1 ELSE 0 END) as verified, SUM(CASE WHEN disabled_at IS NOT NULL THEN 1 ELSE 0 END) as disabled')->first();

        $series = [
            'users' => DB::table('users')->where('is_guest', false),
            'listings' => $this->listings(),
            'transactions' => DB::table('transactions'),
            'bids' => $this->bids(),
        ];
        $daily = [];
        foreach ($series as $name => $query) {
            $daily[$name] = $this->window($query, $start, $end)->selectRaw('DATE(created_at) as day, COUNT(*) as total')->groupByRaw('DATE(created_at)')->pluck('total', 'day');
        }
        $trend = [];
        for ($date = $start; $date->lt($end); $date = $date->addDay()) {
            $row = ['date' => $date->toDateString()];
            foreach ($daily as $name => $values) {
                $row[$name] = (int) ($values[$row['date']] ?? 0);
            }
            $trend[] = $row;
        }

        // A category may include a listing through either the primary or pivot association.
        $categoryLinks = DB::table('category_listing')->select('category_id', 'listing_id')
            ->union(DB::table('listings')->select('category_id', 'id as listing_id'));
        $categories = DB::query()->fromSub($categoryLinks, 'links')
            ->join('listings', 'listings.id', '=', 'links.listing_id')
            ->join('categories', 'categories.id', '=', 'links.category_id')
            ->whereNull('listings.deleted_at')->where('listings.listing_type', 'item')
            ->where('listings.created_at', '>=', $start)->where('listings.created_at', '<', $end)
            ->selectRaw('categories.name as label, COUNT(DISTINCT listings.id) as count')
            ->groupBy('categories.id', 'categories.name')->orderByDesc('count')->orderBy('categories.name')->limit(8)->get()
            ->map(fn ($row) => ['label' => $row->label, 'count' => (int) $row->count])->all();
        $regions = $this->window($this->listings(), $start, $end)
            ->whereNotNull('public_prefecture')->where('public_prefecture', '<>', '')
            ->selectRaw('public_prefecture as label, COUNT(*) as count')->groupBy('public_prefecture')
            ->orderByDesc('count')->orderBy('public_prefecture')->limit(8)->get()
            ->map(fn ($row) => ['label' => $row->label, 'count' => (int) $row->count])->all();

        return [
            'generated_at' => CarbonImmutable::now('UTC')->toIso8601String(),
            'range' => ['days' => $days, 'start' => $start->toDateString(), 'end' => $end->subDay()->toDateString(), 'timezone' => 'UTC'],
            'period' => $this->period($start, $end, true),
            'previous' => $this->period($previousStart, $start, false),
            'snapshot' => [
                'users' => (int) $users->total,
                'verified_users' => (int) $users->verified,
                'disabled_users' => (int) $users->disabled,
                'listings' => (int) $listingStatuses->sum('total'),
                'auctions' => (int) $listingStatuses->sum('auctions'),
                'listing_views' => (int) $listingStatuses->sum('views'),
                'feature_requests' => DB::table('feature_requests')->count(),
            ],
            'visitors' => app(HumanVisitorCounter::class)->total(),
            'trend' => $trend,
            'listing_statuses' => $listingStatuses->map(fn ($row) => ['label' => $row->status, 'count' => (int) $row->total])->all(),
            'transaction_statuses' => $this->groups($this->window(DB::table('transactions'), $start, $end), 'status'),
            'report_statuses' => $this->groups(DB::table('listing_reports'), 'status'),
            'verification_statuses' => $this->groups(DB::table('verification_requests'), 'status'),
            'campaign_statuses' => $this->groups(DB::table('ad_campaigns')->whereNull('deleted_at'), 'status'),
            'request_languages' => $this->groups($this->window(DB::table('feature_requests'), $start, $end), 'locale'),
            'categories' => $categories,
            'regions' => $regions,
        ];
    }

    private function period(CarbonImmutable $start, CarbonImmutable $end, bool $details): array
    {
        $transactions = $this->window(DB::table('transactions'), $start, $end)
            ->selectRaw("COUNT(*) as total, SUM(CASE WHEN status IN ('received', 'completed') THEN 1 ELSE 0 END) as completed, COALESCE(SUM(CASE WHEN status IN ('received', 'completed') THEN amount ELSE 0 END), 0) as completed_value, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled, COUNT(DISTINCT buyer_id) as buyers, COUNT(DISTINCT seller_id) as sellers")->first();
        $bids = $this->window($this->bids(), $start, $end)->selectRaw('COUNT(*) as total, COUNT(DISTINCT user_id) as bidders')->first();
        $ads = $this->window(DB::table('ad_orders'), $start, $end)->where('status', 'paid')->sum('amount_jpy');
        $result = [
            'users' => $this->window(DB::table('users')->where('is_guest', false), $start, $end)->count(),
            'listings' => $this->window($this->listings(), $start, $end)->count(),
            'transactions' => (int) $transactions->total,
            'completed' => (int) $transactions->completed,
            'completed_value' => (int) $transactions->completed_value,
            'cancelled' => (int) $transactions->cancelled,
            'buyers' => (int) $transactions->buyers,
            'sellers' => (int) $transactions->sellers,
            'average_value' => $transactions->completed ? round($transactions->completed_value / $transactions->completed, 2) : 0.0,
            'bids' => (int) $bids->total,
            'bidders' => (int) $bids->bidders,
            'ad_paid_value' => (int) $ads,
        ];
        if ($details) {
            $messages = $this->window(DB::table('listing_messages'), $start, $end)->selectRaw('COUNT(*) as total, SUM(CASE WHEN answered_at IS NOT NULL THEN 1 ELSE 0 END) as answered')->first();
            $ratings = $this->window(DB::table('ratings'), $start, $end)->selectRaw('COUNT(*) as total, AVG(score) as average')->first();
            $result += [
                'messages' => (int) $messages->total,
                'answered' => (int) $messages->answered,
                'ratings' => (int) $ratings->total,
                'average_rating' => $ratings->average === null ? null : round((float) $ratings->average, 2),
            ];
        }

        return $result;
    }

    private function listings(): Builder
    {
        return DB::table('listings')->whereNull('deleted_at')->where('listing_type', 'item');
    }

    private function bids(): Builder
    {
        return DB::table('bids')->whereIn('listing_id', $this->listings()->select('id'));
    }

    private function window(Builder $query, CarbonImmutable $start, CarbonImmutable $end): Builder
    {
        return $query->where('created_at', '>=', $start)->where('created_at', '<', $end);
    }

    private function groups(Builder $query, string $column): array
    {
        return $query->select($column)->selectRaw('COUNT(*) as total')->groupBy($column)->orderBy($column)->get()
            ->map(fn ($row) => ['label' => (string) $row->$column, 'count' => (int) $row->total])->all();
    }
}
