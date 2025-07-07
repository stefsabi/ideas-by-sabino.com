// Hero Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevButton = document.querySelector('.slider-arrow--prev');
    const nextButton = document.querySelector('.slider-arrow--next');
    
    let currentSlide = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    
    // Initialize slider
    function initSlider() {
        showSlide(0);
        startAutoPlay();
        
        // Add event listeners
        prevButton.addEventListener('click', () => {
            stopAutoPlay();
            previousSlide();
            startAutoPlay();
        });
        
        nextButton.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                goToSlide(index);
                startAutoPlay();
            });
        });
        
        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoPlay();
        });
        
        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
            startAutoPlay();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                stopAutoPlay();
                previousSlide();
                startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            }
        });
    }
    
    function showSlide(index) {
        // Remove active classes
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Add active classes
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Add prev class to previous slide for animation
        const prevIndex = currentSlide;
        if (prevIndex !== index) {
            slides[prevIndex].classList.add('prev');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    function previousSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }
    
    function goToSlide(index) {
        if (index !== currentSlide) {
            showSlide(index);
        }
    }
    
    function startAutoPlay() {
        if (isAutoPlaying) {
            autoPlayInterval = setInterval(() => {
                nextSlide();
            }, 5000); // Change slide every 5 seconds
        }
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Initialize the slider
    if (slider) {
        initSlider();
    }
    
    // Pause autoplay when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
});

// Add CSS for smooth animations
var sliderStyle = document.createElement('style');
sliderStyle.textContent = `
    /* Enhanced slider animations */
    .hero-slide {
        will-change: transform, opacity;
    }
    
    .hero-slide.active {
        animation: slideInFromRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    
    .hero-slide.prev {
        animation: slideOutToLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutToLeft {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .slider-arrow {
            width: 50px;
            height: 50px;
            position: absolute;
        }
        
        .slider-arrow--prev {
            left: -25px;
        }
        
        .slider-arrow--next {
            right: -25px;
        }
        
        .slider-dots {
            bottom: 20px;
        }
        
        .client-name {
            font-size: 2rem;
        }
        
        .client-description {
            font-size: 1.125rem;
        }
        
        .logo-placeholder {
            width: 60px;
            height: 60px;
            font-size: 1.25rem;
        }
    }
    
    @media (max-width: 480px) {
        .slider-arrow {
            width: 45px;
            height: 45px;
        }
        
        .slider-arrow--prev {
            left: -22px;
        }
        
        .slider-arrow--next {
            right: -22px;
        }
        
        .slider-dot {
            width: 10px;
            height: 10px;
        }
        
        .client-name {
            font-size: 1.75rem;
        }
        
        .client-description {
            font-size: 1rem;
        }
        
        .logo-placeholder {
            width: 50px;
            height: 50px;
            font-size: 1rem;
        }
    }
    
    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        .hero-slide,
        .slider-arrow,
        .slider-dot {
            transition: none;
        }
        
        .hero-slide.active,
        .hero-slide.prev {
            animation: none;
        }
    }
    
    /* Focus styles for accessibility */
    .slider-arrow:focus,
    .slider-dot:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
    }
`;
document.head.appendChild(sliderStyle);