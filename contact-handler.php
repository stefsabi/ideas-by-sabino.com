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

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Sanitize input data
$name = filter_var(trim($data['name']), FILTER_SANITIZE_STRING);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$company = isset($data['company']) ? filter_var(trim($data['company']), FILTER_SANITIZE_STRING) : 'Nicht angegeben';
$project = isset($data['project']) ? filter_var(trim($data['project']), FILTER_SANITIZE_STRING) : 'Nicht angegeben';
$message = filter_var(trim($data['message']), FILTER_SANITIZE_STRING);
$honeypot = isset($data['website']) ? trim($data['website']) : '';

// Basic validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit();
}

// Email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// Honeypot check (spam protection)
if (!empty($honeypot)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam detected']);
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
IP-Adresse: {$_SERVER['REMOTE_ADDR']}
User-Agent: {$_SERVER['HTTP_USER_AGENT']}
Zeitstempel: " . date('d.m.Y H:i:s') . "
Referrer: " . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'Direkt') . "

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
    // Log successful submission (optional)
    $logEntry = date('Y-m-d H:i:s') . " - Contact form submission from: {$name} ({$email})\n";
    file_put_contents('contact-log.txt', $logEntry, FILE_APPEND | LOCK_EX);
    
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
    $errorEntry = date('Y-m-d H:i:s') . " - ERROR: Failed to send email from: {$name} ({$email})\n";
    file_put_contents('contact-errors.txt', $errorEntry, FILE_APPEND | LOCK_EX);
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Fehler beim Versenden der E-Mail']);
}
?>