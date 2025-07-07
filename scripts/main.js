// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        if (navList) {
            const navLinks = navList.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    nav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                });
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .project-card, .contact-method');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Add CSS for animations
var style = document.createElement('style');
style.textContent = `
    .header.scrolled {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .service-card,
    .project-card,
    .contact-method {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .service-card.animate-in,
    .project-card.animate-in,
    .contact-method.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .nav {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--color-white);
            box-shadow: var(--shadow-md);
            padding: var(--spacing-md);
            transform: translateY(-10px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-list {
            flex-direction: column;
            gap: var(--spacing-md);
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);