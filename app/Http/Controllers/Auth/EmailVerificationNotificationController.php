<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Contracts\EmailVerificationNotificationSentResponse;
use Laravel\Fortify\Http\Responses\RedirectAsIntended;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class EmailVerificationNotificationController extends Controller
{
    public function store(Request $request): mixed
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $request->wantsJson()
                ? new JsonResponse('', 204)
                : app(RedirectAsIntended::class, ['name' => 'email-verification']);
        }

        try {
            $request->user()->sendEmailVerificationNotification();
        } catch (TransportExceptionInterface $exception) {
            Log::warning('Email verification notification failed to send.', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return back()->with('status', 'verification-link-failed');
        }

        return app(EmailVerificationNotificationSentResponse::class);
    }
}
