// 3D Logo Animation Enhancement - Calmed Version
document.addEventListener('DOMContentLoaded', function() {
    const logo3d = document.querySelector('.logo-3d');
    
    if (logo3d) {
        // Reduced floating animation
        let floatDirection = 1;
        let floatPosition = 0;
        
        function floatAnimation() {
            floatPosition += floatDirection * 0.2; // Reduced from 0.5 to 0.2
            
            if (floatPosition > 1.5) { // Reduced from 3 to 1.5
                floatDirection = -1;
            } else if (floatPosition < -1.5) { // Reduced from -3 to -1.5
                floatDirection = 1;
            }
            
            logo3d.style.transform = `translateY(${floatPosition}px)`;
            requestAnimationFrame(floatAnimation);
        }
        
        // Start floating animation
        floatAnimation();
        
        // Gentler mouse interaction
        logo3d.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / rect.width * 8; // Reduced from 20 to 8
            const deltaY = (e.clientY - centerY) / rect.height * 8; // Reduced from 20 to 8
            
            const logoImg = this.querySelector('.logo-img');
            const logoShadow = this.querySelector('.logo-shadow');
            
            if (logoImg) {
                logoImg.style.transform = `
                    rotateY(${deltaX}deg) 
                    rotateX(${-deltaY}deg) 
                    translateZ(8px)
                `;
            }
            
            if (logoShadow) {
                logoShadow.style.transform = `
                    translateZ(-8px) 
                    translateX(${5 + deltaX * 0.3}px) 
                    translateY(${5 + deltaY * 0.3}px)
                `;
            }
        });
        
        logo3d.addEventListener('mouseleave', function() {
            const logoImg = this.querySelector('.logo-img');
            const logoShadow = this.querySelector('.logo-shadow');
            
            if (logoImg) {
                logoImg.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
            }
            
            if (logoShadow) {
                logoShadow.style.transform = 'translateZ(-5px) translateX(3px) translateY(3px)';
            }
        });
        
        // Gentler click animation
        logo3d.addEventListener('click', function() {
            const logoImg = this.querySelector('.logo-img');
            
            if (logoImg) {
                logoImg.style.transform = 'scale(0.98) rotateY(180deg)'; // Reduced rotation
                
                setTimeout(() => {
                    logoImg.style.transform = 'scale(1) rotateY(0deg)';
                }, 800); // Longer duration for smoother effect
            }
        });
    }
});

// Add CSS for calmer animations
var logoStyle = document.createElement('style');
logoStyle.textContent = `
    .logo-3d {
        cursor: pointer;
        transition: transform 0.2s ease-out; /* Slower transition */
    }
    
    .logo-img {
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smoother easing */
        transform-origin: center center;
    }
    
    .logo-shadow {
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smoother easing */
    }
    
    @keyframes logoGlow {
        0%, 100% {
            filter: drop-shadow(0 4px 8px rgba(0, 62, 31, 0.2));
        }
        50% {
            filter: drop-shadow(0 6px 12px rgba(57, 155, 74, 0.3)); /* Reduced glow intensity */
        }
    }
    
    .logo-3d:hover .logo-img {
        animation: logoGlow 4s ease-in-out infinite; /* Slower glow animation */
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .logo-3d:hover .logo-img {
            transform: scale(1.02); /* Reduced scale */
            animation: none;
        }
        
        .logo-shadow {
            display: none;
        }
        
        /* Disable floating on mobile */
        .logo-3d {
            transform: none !important;
        }
    }
`;
document.head.appendChild(logoStyle);