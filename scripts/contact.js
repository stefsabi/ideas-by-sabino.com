// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Anti-bot protection checks
            if (!passesSpamProtection()) {
                showMessage('Spam-Schutz aktiviert. Bitte versuchen Sie es erneut.', 'error');
                return;
            }
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showMessage('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }
            
            // Submit form directly
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Wird gesendet...';
            submitButton.disabled = true;
            
            // Submit to form handler service
            submitContactForm(data, submitButton, originalText);
        });
        
        // Initialize spam protection
        initSpamProtection();
    }
    
    async function submitContactForm(data, submitButton, originalText) {
        try {
            // Using Formspree as form handler (free service)
            const response = await fetch('https://formspree.io/f/xdkogkpw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    company: data.company || 'Nicht angegeben',
                    project: data.project || 'Nicht angegeben',
                    message: data.message,
                    _gotcha: data.website, // Honeypot field
                    _subject: `Kontaktanfrage von ${data.name}`,
                    _replyto: data.email,
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent.substring(0, 100) // Limited for privacy
                })
            });
            
            if (response.ok) {
                showMessage('Vielen Dank! Ihre Nachricht wurde erfolgreich versendet. Wir melden uns bald bei Ihnen.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Fehler beim Versenden');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Fallback to mailto if service fails
            const subject = encodeURIComponent(`Kontaktanfrage von ${data.name}`);
            const body = encodeURIComponent(`
Name: ${data.name}
E-Mail: ${data.email}
Unternehmen: ${data.company || 'Nicht angegeben'}
Projektart: ${data.project || 'Nicht angegeben'}

Nachricht:
${data.message}
            `);
            
            const mailtoLink = `mailto:info@ideas-by-sabino.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            showMessage('Direkter Versand nicht möglich. Ihr E-Mail-Programm wird geöffnet.', 'warning');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        
        // Insert message
        contactForm.insertBefore(messageEl, contactForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
    
    // Spam protection system
    let formStartTime = 0;
    let interactionCount = 0;
    let mouseMovements = 0;
    
    function initSpamProtection() {
        formStartTime = Date.now();
        
        // Track user interactions
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => interactionCount++);
            input.addEventListener('input', () => interactionCount++);
        });
        
        // Track mouse movements (human behavior)
        contactForm.addEventListener('mousemove', () => {
            mouseMovements++;
        });
        
        // Track typing patterns
        const messageField = document.getElementById('message');
        if (messageField) {
            let typingPattern = [];
            messageField.addEventListener('keydown', (e) => {
                typingPattern.push(Date.now());
                // Keep only last 10 keystrokes
                if (typingPattern.length > 10) {
                    typingPattern.shift();
                }
            });
        }
    }
    
    function passesSpamProtection() {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // 1. Honeypot check - if filled, it's a bot
        if (data.website && data.website.trim() !== '') {
            console.log('Spam detected: Honeypot field filled');
            return false;
        }
        
        // 2. Time-based check - too fast submission indicates bot
        const timeTaken = Date.now() - formStartTime;
        if (timeTaken < 3000) { // Less than 3 seconds
            console.log('Spam detected: Form submitted too quickly');
            return false;
        }
        
        // 3. Interaction check - bots don't interact naturally
        if (interactionCount < 3) {
            console.log('Spam detected: Insufficient user interaction');
            return false;
        }
        
        // 4. Mouse movement check - bots often don't move mouse
        if (mouseMovements < 5) {
            console.log('Spam detected: No mouse movement detected');
            return false;
        }
        
        // 5. Content validation - check for spam patterns
        const message = data.message.toLowerCase();
        const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money', 'earn money fast'];
        const hasSpamContent = spamKeywords.some(keyword => message.includes(keyword));
        
        if (hasSpamContent) {
            console.log('Spam detected: Spam keywords found');
            return false;
        }
        
        // 6. Length validation - too short or too long messages
        if (data.message.length < 10 || data.message.length > 2000) {
            console.log('Spam detected: Message length suspicious');
            return false;
        }
        
        // 7. Email validation - advanced pattern check
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(data.email)) {
            console.log('Spam detected: Invalid email format');
            return false;
        }
        
        // 8. Name validation - check for suspicious patterns
        const namePattern = /^[a-zA-ZäöüÄÖÜß\s\-'\.]{2,50}$/;
        if (!namePattern.test(data.name)) {
            console.log('Spam detected: Invalid name format');
            return false;
        }
        
        return true;
    }
});

// Add CSS for form messages
var contactStyle = document.createElement('style');
contactStyle.textContent = `
    .form-message {
        padding: var(--spacing-md);
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing-md);
        font-weight: 500;
    }
    
    .form-message--success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .form-message--error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .form-message--warning {
        background-color: #fff3cd;
        color: #856404;
        border: 1px solid #ffeaa7;
    }
    
    .submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(contactStyle);