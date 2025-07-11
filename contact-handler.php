<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Rate limiting - max 5 requests per IP per hour
$ip = $_SERVER['REMOTE_ADDR'];
$rate_limit_file = 'rate_limit_' . md5($ip) . '.txt';
$current_time = time();
$rate_limit = 5; // Max requests per hour
$time_window = 3600; // 1 hour

if (file_exists($rate_limit_file)) {
    $requests = json_decode(file_get_contents($rate_limit_file), true);
    $requests = array_filter($requests, function($timestamp) use ($current_time, $time_window) {
        return ($current_time - $timestamp) < $time_window;
    });
    
    if (count($requests) >= $rate_limit) {
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.']);
        exit();
    }
    
    $requests[] = $current_time;
} else {
    $requests = [$current_time];
}

file_put_contents($rate_limit_file, json_encode($requests));

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Advanced Anti-Bot Protection
function isBot($data) {
    // 1. Honeypot check - if filled, it's a bot
    if (isset($data['website']) && !empty(trim($data['website']))) {
        return 'Honeypot field filled';
    }
    
    // 2. Time-based check
    if (isset($data['form_start_time'])) {
        $time_taken = time() - intval($data['form_start_time']);
        if ($time_taken < 3) { // Less than 3 seconds
            return 'Form submitted too quickly';
        }
        if ($time_taken > 3600) { // More than 1 hour
            return 'Form session expired';
        }
    }
    
    // 3. Interaction count check
    if (isset($data['interaction_count'])) {
        $interactions = intval($data['interaction_count']);
        if ($interactions < 3) { // Less than 3 interactions
            return 'Insufficient user interaction';
        }
    }
    
    // 4. Content validation - check for spam patterns
    $message = strtolower($data['message']);
    $spam_keywords = [
        'viagra', 'casino', 'lottery', 'winner', 'congratulations', 
        'click here', 'free money', 'earn money fast', 'make money online',
        'bitcoin', 'cryptocurrency', 'investment opportunity', 'guaranteed profit',
        'weight loss', 'diet pills', 'lose weight fast', 'miracle cure',
        'seo services', 'increase traffic', 'buy followers', 'social media boost'
    ];
    
    foreach ($spam_keywords as $keyword) {
        if (strpos($message, $keyword) !== false) {
            return 'Spam content detected: ' . $keyword;
        }
    }
    
    // 5. Length validation
    if (strlen($data['message']) < 10 || strlen($data['message']) > 5000) {
        return 'Message length suspicious';
    }
    
    // 6. Email validation - advanced pattern check
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        return 'Invalid email format';
    }
    
    // 7. Name validation
    if (strlen($data['name']) < 2 || strlen($data['name']) > 100) {
        return 'Name length suspicious';
    }
    
    // 8. Check for repeated characters (bot behavior)
    if (preg_match('/(.)\1{10,}/', $data['message'])) {
        return 'Repeated characters detected';
    }
    
    // 9. Check for excessive links
    if (preg_match_all('/https?:\/\//', $data['message']) > 2) {
        return 'Too many links in message';
    }
    
    // 10. Check for common bot patterns
    $bot_patterns = [
        '/\b(click|visit|check)\s+(here|this|link|website)\b/i',
        '/\b(amazing|incredible|unbelievable)\s+(offer|deal|opportunity)\b/i',
        '/\b(limited\s+time|act\s+now|hurry\s+up)\b/i'
    ];
    
    foreach ($bot_patterns as $pattern) {
        if (preg_match($pattern, $data['message'])) {
            return 'Bot pattern detected';
        }
    }
    
    return false; // Not a bot
}

// Check for bot behavior
$bot_check = isBot($data);
if ($bot_check) {
    // Log bot attempt
    $bot_log = date('Y-m-d H:i:s') . " - Bot detected from IP {$ip}: {$bot_check} - Data: " . json_encode($data) . "\n";
    file_put_contents('bot-attempts.log', $bot_log, FILE_APPEND | LOCK_EX);
    
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam-Schutz aktiviert. Bitte versuchen Sie es erneut.']);
    exit();
}

// Sanitize input data
$name = filter_var(trim($data['name']), FILTER_SANITIZE_STRING);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$company = isset($data['company']) ? filter_var(trim($data['company']), FILTER_SANITIZE_STRING) : 'Nicht angegeben';
$project = isset($data['project']) ? filter_var(trim($data['project']), FILTER_SANITIZE_STRING) : 'Nicht angegeben';
$message = filter_var(trim($data['message']), FILTER_SANITIZE_STRING);

// Final validation after sanitization
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input data after sanitization']);
    exit();
}

// Project type mapping
$projectTypes = [
    'ux' => 'UX-Design',
    'branding' => 'Branding',
    'webdesign' => 'Webdesign',
    'strategy' => 'Digitale Strategie',
    'other' => 'Sonstiges'
];
$projectLabel = isset($projectTypes[$project]) ? $projectTypes[$project] : $project;

// Email configuration
$to = 'info@ideas-by-sabino.com';
$subject = 'Neue Kontaktanfrage von ' . $name . ' - ideas by sabino';

// Create email content
$emailContent = "
Neue Kontaktanfrage über die Website
=====================================

Kontaktdaten:
-------------
Name: {$name}
E-Mail: {$email}
Unternehmen: {$company}
Projektart: {$projectLabel}

Nachricht:
----------
{$message}

Technische Details:
------------------
IP-Adresse: {$ip}
User-Agent: {$_SERVER['HTTP_USER_AGENT']}
Zeitstempel: " . date('d.m.Y H:i:s') . "
Referrer: " . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'Direkt') . "

Anti-Bot-Checks:
---------------
Honeypot: " . (isset($data['website']) ? 'Leer (OK)' : 'Nicht gesetzt') . "
Formular-Zeit: " . (isset($data['form_start_time']) ? (time() - intval($data['form_start_time'])) . ' Sekunden' : 'Nicht verfügbar') . "
Interaktionen: " . (isset($data['interaction_count']) ? $data['interaction_count'] : 'Nicht verfügbar') . "

--
Diese E-Mail wurde automatisch über das Kontaktformular auf ideas-by-sabino.com gesendet.
";

// Email headers
$headers = [
    'From: noreply@ideas-by-sabino.com',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit'
];

// Send email
$mailSent = mail($to, $subject, $emailContent, implode("\r\n", $headers));

if ($mailSent) {
    // Log successful submission
    $logEntry = date('Y-m-d H:i:s') . " - SUCCESS: Contact form submission from: {$name} ({$email}) - IP: {$ip}\n";
    file_put_contents('contact-success.log', $logEntry, FILE_APPEND | LOCK_EX);
    
    // Send confirmation email to sender
    $confirmationSubject = 'Bestätigung Ihrer Kontaktanfrage - ideas by sabino';
    $confirmationContent = "
Liebe/r {$name},

vielen Dank für Ihre Kontaktanfrage über unsere Website!

Wir haben Ihre Nachricht erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.

Ihre Anfrage im Überblick:
--------------------------
Name: {$name}
E-Mail: {$email}
Unternehmen: {$company}
Projektart: {$projectLabel}

Ihre Nachricht:
{$message}

Bei dringenden Anfragen erreichen Sie uns auch telefonisch unter +41 79 460 23 23.

Mit freundlichen Grüßen
Ihr Team von ideas by sabino

--
ideas by sabino
Your Business Coach
Dättwilerstrasse 11
CH-5405 Baden-Dättwil AG
Schweiz

E-Mail: info@ideas-by-sabino.com
Telefon: +41 79 460 23 23
Website: www.ideas-by-sabino.com
";

    $confirmationHeaders = [
        'From: info@ideas-by-sabino.com',
        'Reply-To: info@ideas-by-sabino.com',
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit'
    ];
    
    mail($email, $confirmationSubject, $confirmationContent, implode("\r\n", $confirmationHeaders));
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'E-Mail erfolgreich versendet',
        'data' => [
            'name' => $name,
            'email' => $email,
            'company' => $company,
            'project' => $projectLabel,
            'timestamp' => date('d.m.Y H:i:s')
        ]
    ]);
} else {
    // Log error
    $errorEntry = date('Y-m-d H:i:s') . " - ERROR: Failed to send email from: {$name} ({$email}) - IP: {$ip}\n";
    file_put_contents('contact-errors.log', $errorEntry, FILE_APPEND | LOCK_EX);
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Fehler beim Versenden der E-Mail']);
}
?>