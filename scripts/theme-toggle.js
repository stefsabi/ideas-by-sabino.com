// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme
    body.setAttribute('data-theme', savedTheme);
    
    // Update toggle button state
    updateToggleButton(savedTheme);
    
    // Add click event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Apply new theme
            body.setAttribute('data-theme', newTheme);
            
            // Save preference
            localStorage.setItem('theme', newTheme);
            
            // Update button state
            updateToggleButton(newTheme);
            
            // Add a subtle animation
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    function updateToggleButton(theme) {
        if (!themeToggle) return;
        
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            themeToggle.setAttribute('aria-label', 'Zu hellem Modus wechseln');
            themeToggle.title = 'Zu hellem Modus wechseln';
        } else {
            themeToggle.setAttribute('aria-label', 'Zu dunklem Modus wechseln');
            themeToggle.title = 'Zu dunklem Modus wechseln';
        }
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Only apply system preference if no saved preference exists
        if (!localStorage.getItem('theme')) {
            const systemTheme = mediaQuery.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', systemTheme);
            updateToggleButton(systemTheme);
        }
        
        // Listen for changes in system preference
        mediaQuery.addEventListener('change', function(e) {
            // Only apply if no manual preference is saved
            if (!localStorage.getItem('theme')) {
                const systemTheme = e.matches ? 'dark' : 'light';
                body.setAttribute('data-theme', systemTheme);
                updateToggleButton(systemTheme);
            }
        });
    }
});

// Add smooth transition when theme changes
const themeStyle = document.createElement('style');
themeStyle.textContent = `
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
    }
    
    /* Prevent transition on page load */
    .no-transition * {
        transition: none !important;
    }
`;
document.head.appendChild(themeStyle);

// Temporarily disable transitions on page load
document.body.classList.add('no-transition');
window.addEventListener('load', function() {
    setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 100);
});