<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Middleware\EnsureAdmin;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $users = User::query()
            ->withCount(['listings', 'soldListings', 'purchases', 'sales', 'verificationRequests'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('store_name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return inertia('admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function edit(User $user)
    {
        $user->load('latestVerificationRequest')
            ->loadCount(['listings', 'soldListings', 'purchases', 'sales', 'verificationRequests']);

        return inertia('admin/users/edit', [
            'account' => $user->append(['average_rating', 'ratings_count']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email_verified' => ['nullable', 'boolean'],
            'is_verified' => ['nullable', 'boolean'],
            'is_guest' => ['nullable', 'boolean'],
            'store_name' => ['nullable', 'string', 'max:255'],
            'store_description' => ['nullable', 'string', 'max:2000'],
            'postal_code' => ['nullable', 'string', 'max:32'],
            'prefecture' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address_line1' => ['nullable', 'string', 'max:255'],
            'address_line2' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:32'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other', 'unspecified'])],
            'avatar_source' => ['nullable', Rule::in(['uploaded', 'mascot', 'generated', 'google'])],
            'avatar_style' => ['nullable', 'string', 'max:255'],
            'avatar_seed' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->user()->is($user) && ! EnsureAdmin::isAdminEmail($validated['email'])) {
            return back()->withErrors([
                'email' => 'Your account must keep an admin email address.',
            ]);
        }

        $emailVerified = (bool) ($validated['email_verified'] ?? false);
        $marketplaceVerified = (bool) ($validated['is_verified'] ?? false);

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'email_verified_at' => $emailVerified ? ($user->email_verified_at ?? now()) : null,
            'is_verified' => $marketplaceVerified,
            'verified_at' => $marketplaceVerified ? ($user->verified_at ?? now()) : null,
            'is_guest' => (bool) ($validated['is_guest'] ?? false),
            'store_name' => $validated['store_name'] ?? null,
            'store_description' => $validated['store_description'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'prefecture' => $validated['prefecture'] ?? null,
            'city' => $validated['city'] ?? null,
            'address_line1' => $validated['address_line1'] ?? null,
            'address_line2' => $validated['address_line2'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'avatar_source' => $validated['avatar_source'] ?? 'generated',
            'avatar_style' => $validated['avatar_style'] ?? 'initials',
            'avatar_seed' => $validated['avatar_seed'] ?? null,
        ]);

        $user->save();

        return redirect()
            ->route('admin.users.edit', $user)
            ->with('success', 'User account updated.');
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->is($user)) {
            return back()->withErrors([
                'delete' => 'You cannot delete your own admin account.',
            ]);
        }

        try {
            $user->delete();
        } catch (QueryException) {
            return back()->withErrors([
                'delete' => 'This account has related transaction records and cannot be deleted safely.',
            ]);
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User account deleted.');
    }
}
