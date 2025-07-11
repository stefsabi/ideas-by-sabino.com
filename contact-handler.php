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

// Create HTML email content with your brand design
$emailContent = createHtmlEmail($name, $email, $company, $projectLabel, $message, $ip, $data);

// Email headers for HTML
$headers = [
    'From: ideas by sabino <noreply@ideas-by-sabino.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
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
    $confirmationContent = createConfirmationEmail($name, $email, $company, $projectLabel, $message);

    $confirmationHeaders = [
        'From: ideas by sabino <info@ideas-by-sabino.com>',
        'Reply-To: info@ideas-by-sabino.com',
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
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

// Function to create beautiful HTML email for you
function createHtmlEmail($name, $email, $company, $projectLabel, $message, $ip, $data) {
    $timeStamp = date('d.m.Y H:i:s');
    $formTime = isset($data['form_start_time']) ? (time() - intval($data['form_start_time'])) . ' Sekunden' : 'Nicht verfügbar';
    $interactions = isset($data['interaction_count']) ? $data['interaction_count'] : 'Nicht verfügbar';
    
    return "
    <!DOCTYPE html>
    <html lang='de'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Neue Kontaktanfrage - ideas by sabino</title>
        <style>
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #212529; 
                margin: 0; 
                padding: 20px; 
                background-color: #f8f9fa; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 4px 20px rgba(0, 62, 31, 0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #003e1f 0%, #399b4a 100%); 
                color: white; 
                padding: 30px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: 600; 
            }
            .header p { 
                margin: 10px 0 0 0; 
                opacity: 0.9; 
                font-size: 16px; 
            }
            .content { 
                padding: 30px; 
            }
            .section { 
                margin-bottom: 30px; 
                padding: 20px; 
                background: #f8f9fa; 
                border-radius: 8px; 
                border-left: 4px solid #9cce39; 
            }
            .section h2 { 
                color: #003e1f; 
                margin: 0 0 15px 0; 
                font-size: 18px; 
                font-weight: 600; 
            }
            .info-grid { 
                display: grid; 
                grid-template-columns: 120px 1fr; 
                gap: 10px; 
                margin-bottom: 15px; 
            }
            .info-label { 
                font-weight: 600; 
                color: #399b4a; 
            }
            .info-value { 
                color: #495057; 
            }
            .message-box { 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                border: 1px solid #dee2e6; 
                font-style: italic; 
                color: #495057; 
                line-height: 1.6; 
            }
            .footer { 
                background: #003e1f; 
                color: white; 
                padding: 20px 30px; 
                text-align: center; 
                font-size: 14px; 
            }
            .footer a { 
                color: #9cce39; 
                text-decoration: none; 
            }
            .tech-details { 
                font-size: 12px; 
                color: #6c757d; 
                background: #f1f3f4; 
                padding: 15px; 
                border-radius: 6px; 
                margin-top: 20px; 
            }
            .priority-badge { 
                display: inline-block; 
                background: #9cce39; 
                color: #003e1f; 
                padding: 4px 12px; 
                border-radius: 20px; 
                font-size: 12px; 
                font-weight: 600; 
                text-transform: uppercase; 
                letter-spacing: 0.5px; 
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🎯 Neue Kontaktanfrage</h1>
                <p>ideas by sabino - Your Business Coach</p>
                <div class='priority-badge'>Neue Anfrage</div>
            </div>
            
            <div class='content'>
                <div class='section'>
                    <h2>👤 Kontaktdaten</h2>
                    <div class='info-grid'>
                        <span class='info-label'>Name:</span>
                        <span class='info-value'><strong>{$name}</strong></span>
                        
                        <span class='info-label'>E-Mail:</span>
                        <span class='info-value'><a href='mailto:{$email}' style='color: #399b4a;'>{$email}</a></span>
                        
                        <span class='info-label'>Unternehmen:</span>
                        <span class='info-value'>{$company}</span>
                        
                        <span class='info-label'>Projektart:</span>
                        <span class='info-value'><strong>{$projectLabel}</strong></span>
                        
                        <span class='info-label'>Zeitstempel:</span>
                        <span class='info-value'>{$timeStamp}</span>
                    </div>
                </div>
                
                <div class='section'>
                    <h2>💬 Nachricht</h2>
                    <div class='message-box'>
                        " . nl2br(htmlspecialchars($message)) . "
                    </div>
                </div>
                
                <div class='tech-details'>
                    <strong>🔒 Sicherheits-Check:</strong> ✅ Alle Anti-Bot-Prüfungen bestanden<br>
                    <strong>⏱️ Formular-Zeit:</strong> {$formTime}<br>
                    <strong>🖱️ Interaktionen:</strong> {$interactions}<br>
                    <strong>🌐 IP-Adresse:</strong> {$ip}<br>
                    <strong>📱 User-Agent:</strong> " . htmlspecialchars($_SERVER['HTTP_USER_AGENT']) . "
                </div>
            </div>
            
            <div class='footer'>
                <p><strong>ideas by sabino</strong> - Your Business Coach</p>
                <p>Dättwilerstrasse 11, CH-5405 Baden-Dättwil AG</p>
                <p>📧 <a href='mailto:info@ideas-by-sabino.com'>info@ideas-by-sabino.com</a> | 📞 +41 79 460 23 23</p>
                <p style='margin-top: 15px; opacity: 0.8; font-size: 12px;'>
                    Diese E-Mail wurde automatisch über das Kontaktformular auf 
                    <a href='https://ideas-by-sabino.com'>ideas-by-sabino.com</a> gesendet.
                </p>
            </div>
        </div>
    </body>
    </html>";
}

// Function to create beautiful confirmation email for customer
function createConfirmationEmail($name, $email, $company, $projectLabel, $message) {
    return "
    <!DOCTYPE html>
    <html lang='de'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Bestätigung Ihrer Kontaktanfrage - ideas by sabino</title>
        <style>
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #212529; 
                margin: 0; 
                padding: 20px; 
                background-color: #f8f9fa; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 4px 20px rgba(0, 62, 31, 0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #399b4a 0%, #9cce39 100%); 
                color: white; 
                padding: 30px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: 600; 
            }
            .header p { 
                margin: 10px 0 0 0; 
                opacity: 0.9; 
                font-size: 16px; 
            }
            .content { 
                padding: 30px; 
            }
            .section { 
                margin-bottom: 25px; 
                padding: 20px; 
                background: #f8f9fa; 
                border-radius: 8px; 
                border-left: 4px solid #399b4a; 
            }
            .section h2 { 
                color: #003e1f; 
                margin: 0 0 15px 0; 
                font-size: 18px; 
                font-weight: 600; 
            }
            .info-grid { 
                display: grid; 
                grid-template-columns: 120px 1fr; 
                gap: 10px; 
                margin-bottom: 15px; 
            }
            .info-label { 
                font-weight: 600; 
                color: #399b4a; 
            }
            .info-value { 
                color: #495057; 
            }
            .message-preview { 
                background: white; 
                padding: 15px; 
                border-radius: 6px; 
                border: 1px solid #dee2e6; 
                font-style: italic; 
                color: #495057; 
                max-height: 100px; 
                overflow: hidden; 
            }
            .next-steps { 
                background: linear-gradient(135deg, rgba(57, 155, 74, 0.1) 0%, rgba(156, 206, 57, 0.1) 100%); 
                padding: 20px; 
                border-radius: 8px; 
                border: 1px solid rgba(57, 155, 74, 0.2); 
            }
            .next-steps ul { 
                margin: 10px 0; 
                padding-left: 20px; 
            }
            .next-steps li { 
                margin-bottom: 8px; 
                color: #495057; 
            }
            .footer { 
                background: #003e1f; 
                color: white; 
                padding: 20px 30px; 
                text-align: center; 
                font-size: 14px; 
            }
            .footer a { 
                color: #9cce39; 
                text-decoration: none; 
            }
            .success-badge { 
                display: inline-block; 
                background: #9cce39; 
                color: #003e1f; 
                padding: 4px 12px; 
                border-radius: 20px; 
                font-size: 12px; 
                font-weight: 600; 
                text-transform: uppercase; 
                letter-spacing: 0.5px; 
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>✅ Nachricht erhalten!</h1>
                <p>Vielen Dank für Ihre Kontaktanfrage</p>
                <div class='success-badge'>Bestätigung</div>
            </div>
            
            <div class='content'>
                <p style='font-size: 16px; color: #495057; margin-bottom: 25px;'>
                    Liebe/r <strong>{$name}</strong>,<br><br>
                    vielen Dank für Ihre Kontaktanfrage über unsere Website! 
                    Wir haben Ihre Nachricht erhalten und werden uns innerhalb von <strong>24 Stunden</strong> bei Ihnen melden.
                </p>
                
                <div class='section'>
                    <h2>📋 Ihre Anfrage im Überblick</h2>
                    <div class='info-grid'>
                        <span class='info-label'>Name:</span>
                        <span class='info-value'>{$name}</span>
                        
                        <span class='info-label'>E-Mail:</span>
                        <span class='info-value'>{$email}</span>
                        
                        <span class='info-label'>Unternehmen:</span>
                        <span class='info-value'>{$company}</span>
                        
                        <span class='info-label'>Projektart:</span>
                        <span class='info-value'>{$projectLabel}</span>
                    </div>
                    
                    <div style='margin-top: 15px;'>
                        <strong style='color: #399b4a;'>Ihre Nachricht:</strong>
                        <div class='message-preview'>
                            " . nl2br(htmlspecialchars(substr($message, 0, 200))) . (strlen($message) > 200 ? '...' : '') . "
                        </div>
                    </div>
                </div>
                
                <div class='next-steps'>
                    <h2 style='color: #003e1f; margin: 0 0 15px 0; font-size: 18px;'>🚀 Wie geht es weiter?</h2>
                    <ul>
                        <li>📧 Ihre Nachricht wurde erfolgreich übermittelt</li>
                        <li>⏰ Wir melden uns <strong>innerhalb von 24 Stunden</strong> bei Ihnen</li>
                        <li>📞 Bei dringenden Anfragen: <strong>+41 79 460 23 23</strong></li>
                        <li>💼 Wir besprechen Ihr Projekt und erstellen ein individuelles Angebot</li>
                    </ul>
                </div>
                
                <p style='margin-top: 25px; color: #6c757d; font-size: 14px;'>
                    <strong>Hinweis:</strong> Falls Sie keine Antwort von uns erhalten, 
                    prüfen Sie bitte auch Ihren Spam-Ordner oder kontaktieren Sie uns direkt.
                </p>
            </div>
            
            <div class='footer'>
                <p><strong>ideas by sabino</strong> - Your Business Coach</p>
                <p>Dättwilerstrasse 11, CH-5405 Baden-Dättwil AG, Schweiz</p>
                <p>📧 <a href='mailto:info@ideas-by-sabino.com'>info@ideas-by-sabino.com</a> | 📞 +41 79 460 23 23</p>
                <p>🌐 <a href='https://ideas-by-sabino.com'>www.ideas-by-sabino.com</a></p>
                
                <div style='margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);'>
                    <p style='margin: 0; opacity: 0.8; font-size: 12px;'>
                        Diese Bestätigung wurde automatisch generiert. 
                        Bitte antworten Sie nicht auf diese E-Mail.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>";
}
?>