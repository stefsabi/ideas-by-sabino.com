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
            
            // Simulate form submission
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Wird gesendet...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showMessage('Vielen Dank für Ihre Nachricht! Ich melde mich bald bei Ihnen.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
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

// Initialize interactive map
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Create map placeholder content
    const mapContent = `
        <div class="map-placeholder">
            <h4>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                Unser Standort in Baden
            </h4>
            <p>
                Wir befinden uns im Herzen von Baden, Schweiz. 
                Nur wenige Minuten vom Bahnhof entfernt und gut mit 
                öffentlichen Verkehrsmitteln erreichbar.
            </p>
            <div class="map-coordinates">
                📍 47.4722°N, 8.3056°E
            </div>
            <p style="font-size: 0.875rem; color: var(--color-gray-500);">
                Klicken Sie auf "Route planen" oder "Karte öffnen" für detaillierte Wegbeschreibungen.
            </p>
        </div>
    `;
    
    mapElement.innerHTML = mapContent;
    
    // Add click interaction
    mapElement.addEventListener('click', function() {
        window.open('https://www.google.com/maps/dir//Dättwilerstrasse+11,+5405+Baden,+Schweiz', '_blank');
    });
    
    // Add hover effect
    mapElement.style.cursor = 'pointer';
    mapElement.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    mapElement.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initializeMap);

// Add CSS for form messages
var style = document.createElement('style');
style.textContent = `
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
    
    .submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);