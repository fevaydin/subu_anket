document.addEventListener('DOMContentLoaded', () => {
    // Slider functionality
    let currentSlide = 0;
    const totalSlides = 5;
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.slider-dot');

    function updateSlider() {
        if (!sliderTrack) return; // Eleman bulunamazsa hatayı önle
        const translateX = -currentSlide * 20;
        sliderTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Event listeners
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    // Auto-play slider
    let autoSlideInterval = setInterval(nextSlide, 15000);

    // Pause auto-play on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        sliderContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 15000);
        });
    }
});
