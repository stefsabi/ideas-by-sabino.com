// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
                    _subject: `Kontaktanfrage von ${data.name}`,
                    _replyto: data.email
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