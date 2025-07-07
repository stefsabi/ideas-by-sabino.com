// 3D Logo Animation Enhancement - Static Version (No Wobble)
document.addEventListener('DOMContentLoaded', function() {
    const logo3d = document.querySelector('.logo-3d');
    
    if (logo3d) {
        // Gentle mouse interaction only
        logo3d.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / rect.width * 5; // Very subtle
            const deltaY = (e.clientY - centerY) / rect.height * 5; // Very subtle
            
            const logoImg = this.querySelector('.logo-img');
            const logoShadow = this.querySelector('.logo-shadow');
            
            if (logoImg) {
                logoImg.style.transform = `
                    rotateY(${deltaX}deg) 
                    rotateX(${-deltaY}deg) 
                    translateZ(4px)
                `;
            }
            
            if (logoShadow) {
                logoShadow.style.transform = `
                    translateZ(-5px) 
                    translateX(${3 + deltaX * 0.2}px) 
                    translateY(${3 + deltaY * 0.2}px)
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
        
        // Gentle click animation
        logo3d.addEventListener('click', function() {
            const logoImg = this.querySelector('.logo-img');
            
            if (logoImg) {
                logoImg.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    logoImg.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
});

// Add CSS for stable animations
var logoStyle = document.createElement('style');
logoStyle.textContent = `
    .logo-3d {
        cursor: pointer;
        /* No floating animation - completely static */
    }
    
    .logo-img {
        transition: all 0.4s ease;
        transform-origin: center center;
    }
    
    .logo-shadow {
        transition: all 0.4s ease;
    }
    
    /* Subtle glow on hover only */
    .logo-3d:hover .logo-img {
        filter: drop-shadow(0 6px 12px rgba(57, 155, 74, 0.25));
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .logo-3d:hover .logo-img {
            transform: scale(1.02);
        }
        
        .logo-shadow {
            display: none;
        }
    }
`;
document.head.appendChild(logoStyle);