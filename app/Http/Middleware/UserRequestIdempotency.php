<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;

class UserRequestIdempotency
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        $key = 'idempotency:' . md5(
            $user->id .
            $request->path() .
            json_encode($request->all())
        );

        info($key);

        if (Cache::has($key)) {
             return sendResponse(null, 405, "QR code expired");
        }

        Cache::put($key, true, now()->addMinutes(5));

        return $next($request);
    }
}
