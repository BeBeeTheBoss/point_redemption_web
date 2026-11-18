<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class UserRequestIdempotency
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $fingerprint = hash('sha256', json_encode([
            'timestamp' => trim((string) $request->input('timeStamp')),
            'idcard' => trim((string) $request->input('idcard')),
            'promotion_code' => trim((string) $request->input('promotion_code')),
            'qty' => (int) $request->input('qty'),
        ], JSON_UNESCAPED_SLASHES));

        $request->attributes->set('idempotency_key', $fingerprint);

        $responseKey = "redemption:idempotency:response:{$fingerprint}";
        $lock = Cache::lock("redemption:idempotency:lock:{$fingerprint}", 120);

        if ($cachedResponse = Cache::get($responseKey)) {
            return response($cachedResponse, 200, ['Content-Type' => 'application/json']);
        }

        if (! $lock->get()) {
            return sendResponse(null, 409, 'This redemption is already being processed. Please check the redemption history.');
        }

        try {
            if ($cachedResponse = Cache::get($responseKey)) {
                return response($cachedResponse, 200, ['Content-Type' => 'application/json']);
            }

            $response = $next($request);
            $payload = json_decode($response->getContent(), true);

            if (($payload['status'] ?? null) === 200) {
                Cache::put($responseKey, $response->getContent(), now()->addMinutes(10));
            }

            return $response;
        } finally {
            $lock->release();
        }
    }
}
