<?php
namespace src\Controllers;

class AIController {
    public function analyze(): void {
        header('Content-Type: application/json; charset=utf-8');

        try {
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            $text = trim($data['text'] ?? '');

            if ($text === '') {
                http_response_code(400);
                echo json_encode(['message' => 'El campo "text" es requerido']);
                return;
            }

            $geminiKey = $_ENV['GEMINI_API_KEY'] ?? null;
            if (!$geminiKey) {
                http_response_code(500);
                echo json_encode(['message' => 'Falta GEMINI_API_KEY en el backend']);
                return;
            }

            $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='
                . urlencode($geminiKey);

            $payload = [
                'contents' => [[
                    'parts' => [[
                        'text' => "Analiza este ticket y devuelve prioridad (Alta/Media/Baja) y un resumen breve:\n\n" . $text
                    ]]
                ]]
            ];

            $ch = curl_init($endpoint);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlErr  = curl_error($ch);
            curl_close($ch);

            if ($response === false) {
                http_response_code(502);
                echo json_encode(['message' => 'Error conectando a Gemini', 'error' => $curlErr]);
                return;
            }

            $json = json_decode($response, true);
            $outputText = $json['candidates'][0]['content']['parts'][0]['text'] ?? '';

            $priority =
                (preg_match('/alta/i', $outputText) ? 'Alta' :
                (preg_match('/baja/i', $outputText) ? 'Baja' : 'Media'));

            http_response_code(($httpCode >= 200 && $httpCode < 300) ? 200 : $httpCode);
            echo json_encode(['summary' => $outputText, 'priority' => $priority]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error interno en AIController', 'error' => $e->getMessage()]);
        }
    }

    public function smartResponse(): void {
        header('Content-Type: application/json; charset=utf-8');

        try {
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            $text = trim($data['text'] ?? '');

            if ($text === '') {
                http_response_code(400);
                echo json_encode(['message' => 'El campo "text" es requerido']);
                return;
            }

            $geminiKey = $_ENV['GEMINI_API_KEY'] ?? null;
            if (!$geminiKey) {
                // Si no hay API key, devolver respuesta genérica
                http_response_code(200);
                echo json_encode([
                    'text' => 'Tu solicitud ha sido recibida. Un técnico la revisará pronto y te contactará.',
                    'message' => 'Tu solicitud ha sido recibida. Un técnico la revisará pronto y te contactará.'
                ]);
                return;
            }

            $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='
                . urlencode($geminiKey);

            $payload = [
                'contents' => [[
                    'parts' => [[
                        'text' => "Genera una respuesta amigable y profesional para este ticket de soporte (máximo 50 palabras):\n\n" . $text
                    ]]
                ]]
            ];

            $ch = curl_init($endpoint);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlErr  = curl_error($ch);
            curl_close($ch);

            if ($response === false || $httpCode !== 200) {
                // Fallback si falla la API
                http_response_code(200);
                echo json_encode([
                    'text' => 'Tu solicitud ha sido recibida. Un técnico la revisará pronto y te contactará.',
                    'message' => 'Tu solicitud ha sido recibida. Un técnico la revisará pronto y te contactará.'
                ]);
                return;
            }

            $json = json_decode($response, true);
            $outputText = $json['candidates'][0]['content']['parts'][0]['text'] ?? 'Tu solicitud ha sido recibida. Un técnico la revisará pronto y te contactará.';

            http_response_code(200);
            echo json_encode([
                'text' => $outputText,
                'message' => $outputText
            ]);
        } catch (\Throwable $e) {
            // En caso de error, devolver respuesta genérica
            http_response_code(200);
            echo json_encode([
                'text' => 'Tu solicitud ha sido recibida. Un técnico la revisará pronto y te contactará.',
                'message' => 'Tu solicitud ha sido recibida. Un técnico la revisará pronto y te contactará.'
            ]);
        }
    }
}
