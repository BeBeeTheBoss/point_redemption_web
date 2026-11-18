<?php

namespace Tests\Feature;

use App\Http\Middleware\UserRequestIdempotency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class UserRequestIdempotencyTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_same_redemption_from_different_users_is_processed_once(): void
    {
        $calls = 0;
        $payload = $this->redemptionPayload();
        $middleware = app(UserRequestIdempotency::class);

        $firstResponse = $middleware->handle(
            $this->request($payload, 1),
            function (Request $request) use (&$calls) {
                $calls++;
                $this->assertMatchesRegularExpression(
                    '/^[a-f0-9]{64}$/',
                    $request->attributes->get('idempotency_key')
                );

                return response()->json([
                    'data' => null,
                    'status' => 200,
                    'message' => 'Points redeemed successfully',
                ]);
            }
        );

        $secondResponse = $middleware->handle(
            $this->request($payload, 2),
            function () use (&$calls) {
                $calls++;

                return response()->json(['status' => 500]);
            }
        );

        $this->assertSame(1, $calls);
        $this->assertSame($firstResponse->getContent(), $secondResponse->getContent());
    }

    public function test_failed_redemption_can_be_retried(): void
    {
        $calls = 0;
        $middleware = app(UserRequestIdempotency::class);
        $request = fn () => $this->request($this->redemptionPayload(), 1);

        $middleware->handle($request(), function () use (&$calls) {
            $calls++;

            return response()->json(['status' => 400, 'message' => 'Temporary failure']);
        });

        $response = $middleware->handle($request(), function () use (&$calls) {
            $calls++;

            return response()->json(['status' => 200, 'message' => 'Points redeemed successfully']);
        });

        $this->assertSame(2, $calls);
        $this->assertSame(200, $response->getData(true)['status']);
    }

    public function test_changing_client_points_does_not_change_the_redemption_identity(): void
    {
        $calls = 0;
        $middleware = app(UserRequestIdempotency::class);
        $firstPayload = $this->redemptionPayload();
        $secondPayload = [...$firstPayload, 'points' => 999999];

        $middleware->handle($this->request($firstPayload, 1), function () use (&$calls) {
            $calls++;

            return response()->json(['status' => 200]);
        });

        $middleware->handle($this->request($secondPayload, 2), function () use (&$calls) {
            $calls++;

            return response()->json(['status' => 500]);
        });

        $this->assertSame(1, $calls);
    }

    private function redemptionPayload(): array
    {
        return [
            'timeStamp' => '1794897000000',
            'idcard' => 'member-123',
            'promotion_code' => 'PROMO-001',
            'qty' => 2,
            'points' => 200,
        ];
    }

    private function request(array $payload, int $userId): Request
    {
        $request = Request::create('/api/redeem-points', 'POST', $payload);
        $request->setUserResolver(fn () => (object) ['id' => $userId]);

        return $request;
    }
}
