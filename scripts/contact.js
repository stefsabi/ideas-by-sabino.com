// Contact form functionality with enhanced anti-bot protection
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Contact form script starting...');
    
    // Anti-bot tracking variables
    let formStartTime = Math.floor(Date.now() / 1000);
    let interactionCount = 0;
    let mouseMovements = 0;
    let keystrokes = 0;
    let focusEvents = 0;
    
    const contactForm = document.getElementById('contactForm');
    console.log('📋 Contact form element found:', !!contactForm);
    
    if (contactForm) {
        console.log('✅ Contact form found, initializing anti-bot protection');
        initAntiBot();
        
        contactForm.addEventListener('submit', async function(e) {
            console.log('📤 Form submitted!');
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            try {
                // Show loading state
                submitButton.textContent = 'Wird gesendet...';
                submitButton.disabled = true;
                
                // Get form data
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Add anti-bot data
                data.form_start_time = formStartTime;
                data.interaction_count = interactionCount;
                data.mouse_movements = mouseMovements;
                data.keystrokes = keystrokes;
                data.focus_events = focusEvents;
                
                console.log('📝 Form data with anti-bot metrics:', {
                    name: data.name,
                    email: data.email,
                    company: data.company,
                    project: data.project,
                    message: data.message.substring(0, 50) + '...',
                    form_time: (Math.floor(Date.now() / 1000) - formStartTime) + 's',
                    interactions: interactionCount,
                    mouse_movements: mouseMovements,
                    keystrokes: keystrokes,
                    focus_events: focusEvents
                });
                
                // Basic validation
                if (!data.name || !data.email || !data.message) {
                    throw new Error('Bitte füllen Sie alle Pflichtfelder aus.');
                }
                
                if (data.message.length < 10) {
                    throw new Error('Die Nachricht muss mindestens 10 Zeichen lang sein.');
                }
                
                console.log('📮 Sending to PHP handler...');
                
                const response = await fetch('contact-handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📬 PHP handler response status:', response.status);
                
                const result = await response.json();
                console.log('📋 PHP handler response:', result);
                
                if (response.ok && result.success) {
                    console.log('✅ Email sent successfully!');
                    showSuccessConfirmation(result.data);
                    contactForm.reset();
                    resetAntiBot();
                } else {
                    console.error('❌ PHP handler failed:', result.message);
                    throw new Error(result.message || 'Fehler beim Versenden der E-Mail');
                }
                
            } catch (error) {
                console.error('❌ Form submission error:', error);
                showMessage(error.message, 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    function initAntiBot() {
        console.log('🛡️ Initializing anti-bot protection...');
        
        // Track all form interactions
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            // Track focus events
            input.addEventListener('focus', () => {
                focusEvents++;
                interactionCount++;
                console.log('👆 Focus event - Total interactions:', interactionCount);
            });
            
            // Track input events
            input.addEventListener('input', () => {
                interactionCount++;
                console.log('⌨️ Input event - Total interactions:', interactionCount);
            });
            
            // Track keystrokes in text fields
            if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
                input.addEventListener('keydown', () => {
                    keystrokes++;
                    if (keystrokes % 10 === 0) {
                        console.log('⌨️ Keystrokes:', keystrokes);
                    }
                });
            }
        });
        
        // Track mouse movements (human behavior indicator)
        contactForm.addEventListener('mousemove', () => {
            mouseMovements++;
            if (mouseMovements % 20 === 0) {
                console.log('🖱️ Mouse movements:', mouseMovements);
            }
        });
        
        // Track form visibility (tab switching detection)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                interactionCount++;
                console.log('👁️ Tab focus - Total interactions:', interactionCount);
            }
        });
        
        console.log('🛡️ Anti-bot protection initialized at timestamp:', formStartTime);
    }
    
    function resetAntiBot() {
        formStartTime = Math.floor(Date.now() / 1000);
        interactionCount = 0;
        mouseMovements = 0;
        keystrokes = 0;
        focusEvents = 0;
        console.log('🔄 Anti-bot metrics reset');
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
                            ${data.company && data.company !== 'Nicht angegeben' ? `
                            <div class="summary-item">
                                <span class="summary-label">Unternehmen:</span>
                                <span class="summary-value">${data.company}</span>
                            </div>
                            ` : ''}
                            ${data.project && data.project !== 'Nicht angegeben' ? `
                            <div class="summary-item">
                                <span class="summary-label">Projektart:</span>
                                <span class="summary-value">${data.project}</span>
                            </div>
                            ` : ''}
                            <div class="summary-item">
                                <span class="summary-label">Gesendet am:</span>
                                <span class="summary-value">${data.timestamp}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h4>Wie geht es weiter?</h4>
                        <ul>
                            <li>📧 Ihre Nachricht wurde erfolgreich an <strong>info@ideas-by-sabino.com</strong> übermittelt</li>
                            <li>⏰ Wir melden uns innerhalb von <strong>24 Stunden</strong> bei Ihnen zurück</li>
                            <li>📞 Bei dringenden Anfragen erreichen Sie uns unter <strong>+41 79 460 23 23</strong></li>
                            <li>✅ Sie erhalten eine <strong>Bestätigungs-E-Mail</strong> an Ihre E-Mail-Adresse</li>
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
        resetAntiBot();
        
        // Scroll back to form
        contactForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
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
        
        // Scroll to message
        messageEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
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
        animation: slideInDown 0.3s ease-out;
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
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(contactStyle);