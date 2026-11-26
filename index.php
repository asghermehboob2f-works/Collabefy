<?php
/**
 * Collabefy High-Performance Reverse Proxy for LiteSpeed / Apache / Shared Hosts
 * Forwards all incoming HTTP/HTTPS traffic to the Next.js production server on Port 3000.
 */

$backendHost = 'http://127.0.0.1:3000';
$requestUri  = $_SERVER['REQUEST_URI'] ?? '/';
$targetUrl   = $backendHost . $requestUri;
$method      = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// 1. Gather all incoming client headers
$forwardHeaders = [];
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $key => $val) {
        $lower = strtolower($key);
        // Skip hop-by-hop headers and let cURL handle them
        if (in_array($lower, ['content-length', 'connection', 'host'])) {
            continue;
        }
        $forwardHeaders[] = "$key: $val";
    }
}

// 2. Add proxy forwarding headers
$forwardHeaders[] = 'Host: ' . ($_SERVER['HTTP_HOST'] ?? 'collabefy.com');
$forwardHeaders[] = 'X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
$forwardHeaders[] = 'X-Forwarded-Proto: ' . ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http');
$forwardHeaders[] = 'X-Forwarded-Host: ' . ($_SERVER['HTTP_HOST'] ?? 'collabefy.com');

// 3. Forward request to Next.js via cURL
$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

// Forward request body for POST/PUT/PATCH/DELETE
if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    $body = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$rawResponse = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Collabefy is starting up. Please refresh in a few seconds... (Proxy Error: " . curl_error($ch) . ")";
    curl_close($ch);
    exit;
}

$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$httpCode   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$headerText = substr($rawResponse, 0, $headerSize);
$bodyText   = substr($rawResponse, $headerSize);

// 4. Return backend HTTP status code
http_response_code($httpCode);

// 5. Forward response headers to browser
$headers = explode("\r\n", $headerText);
foreach ($headers as $h) {
    if (empty($h)) continue;
    $lower = strtolower($h);
    if (strpos($lower, 'transfer-encoding:') === 0 || strpos($lower, 'connection:') === 0 || strpos($lower, 'http/') === 0) {
        continue;
    }
    header($h, false);
}

// 6. Return response body
echo $bodyText;
