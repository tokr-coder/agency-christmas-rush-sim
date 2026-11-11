<?php
/**
 * Top 10 board for The Q4 Rush.
 * Emails are written into storage/scores.jsonl and are never returned.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'GET') {
  respond(['ok' => true, 'top' => publicTop(rank(readRows(boardPath())))]);
}
if ($method !== 'POST') {
  fail(405, 'POST a score.');
}
if (!originAllowed()) {
  fail(403, 'That origin cannot write the board.');
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 2048) {
  fail(400, 'Send a short JSON score.');
}
$data = json_decode($raw, true);
if (!is_array($data)) {
  fail(400, 'Send JSON.');
}

$name = preg_replace('/\s+/', ' ', trim((string) ($data['name'] ?? '')));
$email = strtolower(trim((string) ($data['email'] ?? '')));
$score = $data['score'] ?? null;

if (!is_string($name) || !preg_match("/^[\\p{L}\\p{N}][\\p{L}\\p{N} .'\\-]{1,23}$/u", $name)) {
  fail(400, 'Name needs 2–24 letters.');
}
if (strlen($email) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  fail(400, 'Email looks wrong.');
}
if (!is_numeric($score)) {
  fail(400, 'Score looks wrong.');
}
$score = (float) $score;
if ($score < 0 || $score > 5000000 || floor($score) !== $score) {
  fail(400, 'Score looks wrong.');
}

$candidate = [
  'id' => bin2hex(random_bytes(8)),
  'name' => $name,
  'email' => $email,
  'score' => (int) $score,
  'at' => gmdate('Y-m-d\\TH:i:s\\Z'),
];

$file = boardPath();
$dir = dirname($file);
if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
  fail(500, "The board file isn't writable.");
}
$handle = fopen($file, 'c+');
if ($handle === false) {
  fail(500, "The board file isn't writable.");
}
if (!flock($handle, LOCK_EX)) {
  fclose($handle);
  fail(500, "The board file isn't writable.");
}

try {
  $rows = decode(stream_get_contents($handle) ?: '');
  $ranked = rank(array_merge($rows, [$candidate]));
  $placed = false;
  foreach (array_slice($ranked, 0, 10) as $row) {
    if (($row['id'] ?? '') === $candidate['id']) {
      $placed = true;
      break;
    }
  }
  if ($placed) {
    fseek($handle, 0, SEEK_END);
    fwrite($handle, json_encode($candidate, JSON_UNESCAPED_UNICODE) . "\n");
  }
  $top = publicTop($placed ? $ranked : rank($rows));
} finally {
  flock($handle, LOCK_UN);
  fclose($handle);
}

if (!$placed) {
  fail(403, 'Outside the top 10.', ['top' => $top]);
}
respond(['ok' => true, 'placed' => true, 'top' => $top]);

function boardPath(): string
{
  return __DIR__ . '/storage/scores.jsonl';
}

function originAllowed(): bool
{
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin === '') {
    return true;
  }
  $originHost = parse_url($origin, PHP_URL_HOST);
  $serverHost = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
  return is_string($originHost) && $originHost !== '' && strcasecmp($originHost, $serverHost) === 0;
}

function readRows(string $file): array
{
  if (!is_file($file)) {
    return [];
  }
  $handle = fopen($file, 'r');
  if ($handle === false) {
    return [];
  }
  flock($handle, LOCK_SH);
  $raw = stream_get_contents($handle) ?: '';
  flock($handle, LOCK_UN);
  fclose($handle);
  return decode($raw);
}

function decode(string $raw): array
{
  $rows = [];
  foreach (preg_split("/\r\n|\n|\r/", $raw) as $line) {
    if ($line === '') {
      continue;
    }
    $row = json_decode($line, true);
    if (!is_array($row) || !isset($row['name'], $row['email'], $row['score'])) {
      continue;
    }
    $rows[] = $row;
  }
  return $rows;
}

function rank(array $rows): array
{
  $best = [];
  foreach ($rows as $row) {
    $key = strtolower((string) $row['email']);
    if ($key === '') {
      continue;
    }
    if (!isset($best[$key]) || $row['score'] > $best[$key]['score']) {
      $best[$key] = $row;
      continue;
    }
    if ($row['score'] === $best[$key]['score'] && strcmp((string) $row['at'], (string) $best[$key]['at']) < 0) {
      $best[$key] = $row;
    }
  }
  $list = array_values($best);
  usort($list, function ($a, $b) {
    if ($a['score'] !== $b['score']) {
      return $b['score'] <=> $a['score'];
    }
    return strcmp((string) $a['at'], (string) $b['at']);
  });
  return $list;
}

function publicTop(array $ranked): array
{
  $out = [];
  foreach (array_slice($ranked, 0, 10) as $row) {
    $out[] = [
      'name' => (string) $row['name'],
      'score' => (int) $row['score'],
    ];
  }
  return $out;
}

function respond(array $payload, int $status = 200): void
{
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
  exit;
}

function fail(int $status, string $error, array $extra = []): void
{
  respond(array_merge(['ok' => false, 'error' => $error], $extra), $status);
}
