// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Contact form script starting...');
    
    // Spam protection variables - initialize at top level
    let formStartTime = 0;
    let interactionCount = 0;
    let mouseMovements = 0;
    
    console.log('Contact form script loaded');
    const contactForm = document.getElementById('contactForm');
    console.log('📋 Contact form element found:', !!contactForm);
    
    if (contactForm) {
        console.log('✅ Contact form found, adding event listener');
        contactForm.addEventListener('submit', function(e) {
            console.log('📤 Form submitted!');
            e.preventDefault();
            
            console.log('🛡️ Starting spam protection check...');
            // Anti-bot protection checks
            if (!passesSpamProtection()) {
                console.log('❌ Spam protection failed');
                showMessage('Spam-Schutz aktiviert. Bitte versuchen Sie es erneut.', 'error');
                return;
            }
            console.log('✅ Spam protection passed');
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            console.log('📝 Form data collected:', data);
            
            // Basic validation
            if (!data.name || !data.email || !data.message) {
                console.log('❌ Validation failed: missing required fields');
                showMessage('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                console.log('❌ Email validation failed');
                showMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }
            console.log('✅ All validations passed, submitting form');
            
            // Submit form directly
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            console.log('🔄 Changing button state...');
            submitButton.textContent = 'Wird gesendet...';
            submitButton.disabled = true;
            
            // Submit to form handler service
            console.log('📧 Starting email submission...');
            submitContactForm(data, submitButton, originalText);
        });
        
        // Initialize spam protection
        console.log('🛡️ Initializing spam protection');
        initSpamProtection(contactForm);
    } else {
        console.error('❌ Contact form not found!');
    }
    
    async function submitContactForm(data, submitButton, originalText) {
        console.log('📧 Submitting form with data:', data);
        try {
            // Try multiple email services for reliability
            console.log('📮 Attempting email submission...');
            
            let response;
            let success = false;
            
            // Try Formspree first
            try {
                console.log('📮 Trying Formspree...');
                response = await fetch('https://formspree.io/f/xpznqjqw', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        company: data.company || 'Nicht angegeben',
                        project: data.project || 'Nicht angegeben',
                        message: data.message,
                        _subject: `Neue Kontaktanfrage von ${data.name} - ideas by sabino`,
                        _replyto: data.email
                    })
                });
                
                console.log('📬 Formspree response status:', response.status);
                
                if (response.ok) {
                    success = true;
                    console.log('✅ Formspree successful!');
                }
            } catch (formspreeError) {
                console.log('❌ Formspree failed:', formspreeError.message);
            }
            
            // Try EmailJS as fallback
            if (!success) {
                try {
                    console.log('📮 Trying EmailJS fallback...');
                    response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            service_id: 'service_ideas_sabino',
                            template_id: 'template_contact',
                            user_id: 'user_ideas_sabino',
                            template_params: {
                                from_name: data.name,
                                from_email: data.email,
                                company: data.company || 'Nicht angegeben',
                                project: data.project || 'Nicht angegeben',
                                message: data.message,
                                to_email: 'info@ideas-by-sabino.com'
                            }
                        })
                    });
                    
                    console.log('📬 EmailJS response status:', response.status);
                    
                    if (response.ok || response.status === 200) {
                        success = true;
                        console.log('✅ EmailJS successful!');
                    }
                } catch (emailjsError) {
                    console.log('❌ EmailJS failed:', emailjsError.message);
                }
            }
            
            // Try Web3Forms as final fallback
            if (!success) {
                try {
                    console.log('📮 Trying Web3Forms fallback...');
                    const formData = new FormData();
                    formData.append('access_key', 'YOUR_WEB3FORMS_KEY');
                    formData.append('name', data.name);
                    formData.append('email', data.email);
                    formData.append('company', data.company || 'Nicht angegeben');
                    formData.append('project', data.project || 'Nicht angegeben');
                    formData.append('message', data.message);
                    formData.append('subject', `Neue Kontaktanfrage von ${data.name} - ideas by sabino`);
                    
                    response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    });
                    
                    console.log('📬 Web3Forms response status:', response.status);
                    
                    if (response.ok) {
                        success = true;
                        console.log('✅ Web3Forms successful!');
                    }
                } catch (web3Error) {
                    console.log('❌ Web3Forms failed:', web3Error.message);
                }
            }
            
            if (success) {
                console.log('✅ Email sent successfully via one of the services!');
                showSuccessConfirmation(data);
                
                // Reset form after successful submission
                contactForm.reset();
            } else {
                console.error('❌ All email services failed');
                throw new Error('Alle E-Mail-Services sind momentan nicht verfügbar');
            }
            
        } catch (error) {
            console.error('❌ Form submission error:', error);
            
            // Show user-friendly error message
            showMessage(
                'Fehler beim Versenden der E-Mail. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt unter info@ideas-by-sabino.com', 
                'error'
            );
        } finally {
            console.log('🔄 Resetting button state...');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    function showSuccessConfirmation(data) {
        // Hide the form
        contactForm.style.display = 'none';
        
        // Create success confirmation
        const confirmationHtml = `
            <div class="form-success-confirmation">
                <div class="success-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#399b4a"/>
                        <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                
                <h3>Nachricht erfolgreich versendet!</h3>
                
                <div class="confirmation-details">
                    <p class="confirmation-intro">
                        Vielen Dank für Ihre Kontaktaufnahme. Ihre Nachricht wurde erfolgreich an uns übermittelt.
                    </p>
                    
                    <div class="message-summary">
                        <h4>Zusammenfassung Ihrer Nachricht:</h4>
                        <div class="summary-grid">
                            <div class="summary-item">
                                <span class="summary-label">Name:</span>
                                <span class="summary-value">${data.name}</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">E-Mail:</span>
                                <span class="summary-value">${data.email}</span>
                            </div>
                            ${data.company ? `
                            <div class="summary-item">
                                <span class="summary-label">Unternehmen:</span>
                                <span class="summary-value">${data.company}</span>
                            </div>
                            ` : ''}
                            ${data.project ? `
                            <div class="summary-item">
                                <span class="summary-label">Projektart:</span>
                                <span class="summary-value">${getProjectLabel(data.project)}</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div class="message-preview">
                            <span class="summary-label">Ihre Nachricht:</span>
                            <div class="message-text">"${data.message.length > 150 ? data.message.substring(0, 150) + '...' : data.message}"</div>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h4>Wie geht es weiter?</h4>
                        <ul>
                            <li>📧 Ihre Nachricht wurde erfolgreich an <strong>info@ideas-by-sabino.com</strong> übermittelt</li>
                            <li>⏰ Wir melden uns innerhalb von <strong>24 Stunden</strong> bei Ihnen zurück</li>
                            <li>📞 Bei dringenden Anfragen erreichen Sie uns unter <strong>+41 79 460 23 23</strong></li>
                            <li>✅ Sie erhalten eine <strong>Kopie dieser Nachricht</strong> an Ihre E-Mail-Adresse</li>
                        </ul>
                    </div>
                    
                    <div class="confirmation-actions">
                        <button type="button" class="new-message-button" onclick="resetContactForm()">
                            Neue Nachricht senden
                        </button>
                        <a href="index.html" class="back-home-button">
                            Zurück zur Startseite
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Insert confirmation after form
        contactForm.insertAdjacentHTML('afterend', confirmationHtml);
        
        // Scroll to confirmation
        setTimeout(() => {
            document.querySelector('.form-success-confirmation').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    }
    
    function getProjectLabel(value) {
        const labels = {
            'ux': 'UX-Design',
            'branding': 'Branding',
            'webdesign': 'Webdesign',
            'strategy': 'Digitale Strategie',
            'other': 'Sonstiges'
        };
        return labels[value] || value;
    }
    
    // Global function to reset form
    window.resetContactForm = function() {
        // Remove confirmation
        const confirmation = document.querySelector('.form-success-confirmation');
        if (confirmation) {
            confirmation.remove();
        }
        
        // Show and reset form
        contactForm.style.display = 'flex';
        contactForm.reset();
        
        // Scroll back to form
        contactForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Reinitialize spam protection
        initSpamProtection(contactForm);
    };
    
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
    
    function initSpamProtection(form) {
        console.log('🛡️ Spam protection initialized');
        formStartTime = Date.now();
        interactionCount = 0;
        mouseMovements = 0;
        
        // Track user interactions
        const formInputs = form.querySelectorAll('input, textarea, select');
        console.log('📝 Found form inputs:', formInputs.length);
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                interactionCount++;
                console.log('👆 Interaction count:', interactionCount);
            });
            input.addEventListener('input', () => {
                interactionCount++;
                console.log('⌨️ Interaction count:', interactionCount);
            });
        });
        
        // Track mouse movements (human behavior)
        form.addEventListener('mousemove', () => {
            mouseMovements++;
            if (mouseMovements % 5 === 0) {
                console.log('🖱️ Mouse movements:', mouseMovements);
            }
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
        console.log('🛡️ Checking spam protection...');
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        const timeTaken = Date.now() - formStartTime;
        console.log('📊 Form stats:', {
            timeTaken: timeTaken + 'ms',
            interactionCount,
            mouseMovements,
            honeypot: data.website
        });
        
        // 1. Honeypot check - if filled, it's a bot
        if (data.website && data.website.trim() !== '') {
            console.log('🚫 Spam detected: Honeypot field filled');
            return false;
        }
        
        // 2. Time-based check - too fast submission indicates bot (very relaxed)
        if (timeTaken < 1000) { // Less than 1 second
            console.log('🚫 Spam detected: Form submitted too quickly');
            return false;
        }
        
        // 3. Interaction check - bots don't interact naturally (very relaxed)
        if (interactionCount < 1) { // At least one interaction
            console.log('🚫 Spam detected: Insufficient user interaction');
            return false;
        }
        
        // 4. Mouse movement check - bots often don't move mouse (disabled for now)
        // if (mouseMovements < 1) {
        //     console.log('🚫 Spam detected: No mouse movement detected');
        //     return false;
        // }
        
        // 5. Content validation - check for spam patterns
        const message = data.message.toLowerCase();
        const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money', 'earn money fast'];
        const hasSpamContent = spamKeywords.some(keyword => message.includes(keyword));
        
        if (hasSpamContent) {
            console.log('🚫 Spam detected: Spam keywords found');
            return false;
        }
        
        // 6. Length validation - too short or too long messages
        if (data.message.length < 5 || data.message.length > 5000) {
            console.log('🚫 Spam detected: Message length suspicious');
            return false;
        }
        
        // 7. Email validation - advanced pattern check
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(data.email)) {
            console.log('🚫 Spam detected: Invalid email format');
            return false;
        }
        
        // 8. Name validation - check for suspicious patterns
        // Relaxed name validation - allow more characters
        if (data.name.length < 2 || data.name.length > 100) {
            console.log('🚫 Spam detected: Name too short or too long');
            return false;
        }
        
        console.log('✅ All spam protection checks passed!');
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