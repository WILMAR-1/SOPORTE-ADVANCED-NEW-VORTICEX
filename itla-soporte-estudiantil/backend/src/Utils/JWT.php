<?php
namespace src\Utils;

class JWT {
    private static function b64urlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function b64urlDecode(string $data): string {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/')) ?: '';
    }

    public static function encode(array $payload, string $secret): string {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256'], JSON_UNESCAPED_SLASHES);

        $base64UrlHeader  = self::b64urlEncode($header);
        $base64UrlPayload = self::b64urlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::b64urlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function decode(string $jwt, string $secret): ?array {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) return null;

        [$h, $p, $s] = $parts;

        $headerJson  = self::b64urlDecode($h);
        $payloadJson = self::b64urlDecode($p);

        if ($headerJson === '' || $payloadJson === '') return null;

        $signature = hash_hmac('sha256', $h . "." . $p, $secret, true);
        $expected  = self::b64urlEncode($signature);

        if (!hash_equals($expected, $s)) return null;

        $payload = json_decode($payloadJson, true);
        if (!is_array($payload)) return null;

        // Opcional: validar exp/nbf si existen
        $now = time();
        if (isset($payload['nbf']) && is_numeric($payload['nbf']) && $now < (int)$payload['nbf']) return null;
        if (isset($payload['exp']) && is_numeric($payload['exp']) && $now >= (int)$payload['exp']) return null;

        return $payload;
    }
}
