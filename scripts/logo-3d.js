// 3D Logo Animation Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const logo3d = document.querySelector('.logo-3d');
    
    if (logo3d) {
        // Add floating animation
        let floatDirection = 1;
        let floatPosition = 0;
        
        function floatAnimation() {
            floatPosition += floatDirection * 0.5;
            
            if (floatPosition > 3) {
                floatDirection = -1;
            } else if (floatPosition < -3) {
                floatDirection = 1;
            }
            
            logo3d.style.transform = `translateY(${floatPosition}px)`;
            requestAnimationFrame(floatAnimation);
        }
        
        // Start floating animation
        floatAnimation();
        
        // Enhanced mouse interaction
        logo3d.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / rect.width * 20;
            const deltaY = (e.clientY - centerY) / rect.height * 20;
            
            const logoImg = this.querySelector('.logo-img');
            const logoShadow = this.querySelector('.logo-shadow');
            
            if (logoImg) {
                logoImg.style.transform = `
                    rotateY(${deltaX}deg) 
                    rotateX(${-deltaY}deg) 
                    translateZ(15px)
                `;
            }
            
            if (logoShadow) {
                logoShadow.style.transform = `
                    translateZ(-15px) 
                    translateX(${8 + deltaX * 0.5}px) 
                    translateY(${8 + deltaY * 0.5}px)
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
        
        // Click animation
        logo3d.addEventListener('click', function() {
            const logoImg = this.querySelector('.logo-img');
            
            if (logoImg) {
                logoImg.style.transform = 'scale(0.95) rotateY(360deg)';
                
                setTimeout(() => {
                    logoImg.style.transform = 'scale(1) rotateY(0deg)';
                }, 600);
            }
        });
    }
});

// Add CSS for enhanced animations
const style = document.createElement('style');
style.textContent = `
    .logo-3d {
        cursor: pointer;
        transition: transform 0.1s ease-out;
    }
    
    .logo-img {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform-origin: center center;
    }
    
    .logo-shadow {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    @keyframes logoGlow {
        0%, 100% {
            filter: drop-shadow(0 4px 8px rgba(0, 62, 31, 0.2));
        }
        50% {
            filter: drop-shadow(0 6px 12px rgba(57, 155, 74, 0.4));
        }
    }
    
    .logo-3d:hover .logo-img {
        animation: logoGlow 2s ease-in-out infinite;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .logo-3d:hover .logo-img {
            transform: scale(1.05);
            animation: none;
        }
        
        .logo-shadow {
            display: none;
        }
    }
`;
document.head.appendChild(style);