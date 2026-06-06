<?php

namespace App\Http\Responses;

use App\Support\SafeIntendedRedirect;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function __construct(private SafeIntendedRedirect $redirect)
    {
    }

    public function toResponse($request)
    {
        return $request->wantsJson()
            ? response()->noContent()
            : $this->redirect->to($request, config('fortify.home'));
    }
}
