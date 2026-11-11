<?php
/**
 * Router for the PHP built-in server.
 * php -S 127.0.0.1:8080 router.php
 * Blocks the score file, which Apache also blocks with storage/.htaccess.
 */
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if (preg_match('#^/storage(/|$)#', $path)) {
  http_response_code(403);
  header('Content-Type: text/plain; charset=utf-8');
  echo "Forbidden\n";
  return true;
}
return false;
