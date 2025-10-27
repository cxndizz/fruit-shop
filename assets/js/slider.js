/* 
* FreshFruit Shop - Slider JavaScript
* ฟังก์ชั่นสำหรับสไลด์เดอร์ในเว็บไซต์
*/

class FruitSlider {
    constructor(element, options = {}) {
        this.slider = document.querySelector(element);
        if (!this.slider) return;

        this.sliderTrack = this.slider.querySelector('.slider-track');
        this.slides = this.slider.querySelectorAll('.slide');
        this.nextBtn = this.slider.querySelector('.slider-next');
        this.prevBtn = this.slider.querySelector('.slider-prev');
        this.dots = this.slider.querySelectorAll('.slider-dot');

        // Options with defaults
        const slideToShow = options.slideToShow || 1;
        const slideToScroll = options.slideToScroll || 1;

        this.options = {
            autoplay: options.autoplay || false,
            autoplaySpeed: options.autoplaySpeed || 5000,
            infinite: options.infinite !== undefined ? options.infinite : true,
            slideToShow,
            slideToScroll,
            arrows: options.arrows !== undefined ? options.arrows : true,
            dots: options.dots !== undefined ? options.dots : true,
            responsive: options.responsive || null
        };

        this.defaultSettings = {
            slideToShow,
            slideToScroll
        };

        this.responsiveSettings = Array.isArray(this.options.responsive)
            ? [...this.options.responsive].sort((a, b) => b.breakpoint - a.breakpoint)
            : [];

        this.slideCount = this.slides.length;
        this.currentSlide = 0;
        this.autoplayTimer = null;
        this.userInteracting = false;

        this.init();
    }
    
    init() {
        if (this.slideCount <= 0) return;

        this.slider.setAttribute('aria-live', this.options.autoplay ? 'polite' : 'off');
        if (this.sliderTrack) {
            this.sliderTrack.setAttribute('role', 'list');
        }

        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${index + 1} จาก ${this.slideCount}`);
            slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
            slide.tabIndex = index === 0 ? 0 : -1;
        });

        // Set initial slide width
        this.setSlideWidth();

        // Set up controls
        if (this.options.arrows && this.nextBtn && this.prevBtn) {
            this.nextBtn.addEventListener('click', this.nextSlide.bind(this));
            this.prevBtn.addEventListener('click', this.prevSlide.bind(this));
        }
        
        // Set up dots
        if (this.options.dots && this.dots.length) {
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
        }
        
        // Set up autoplay
        if (this.options.autoplay) {
            this.startAutoplay();

            // Pause autoplay on hover
            this.slider.addEventListener('mouseenter', () => {
                this.userInteracting = true;
                this.stopAutoplay();
            });

            this.slider.addEventListener('mouseleave', () => {
                this.userInteracting = false;
                this.startAutoplay();
            });

            this.slider.addEventListener('focusin', () => {
                this.userInteracting = true;
                this.stopAutoplay();
            });

            this.slider.addEventListener('focusout', event => {
                if (!event.relatedTarget || !this.slider.contains(event.relatedTarget)) {
                    this.userInteracting = false;
                    this.startAutoplay();
                }
            });
        }

        // Responsive handling
        if (this.responsiveSettings.length) {
            window.addEventListener('resize', this.handleResize.bind(this));
            this.handleResize();
        }

        // Initial update
        this.updateSlider();
    }

    setSlideWidth() {
        if (!this.sliderTrack) return;
        const sliderWidth = this.slider.offsetWidth;
        const slidesToShow = Math.max(1, Math.min(this.options.slideToShow, this.slideCount));
        const slideWidth = sliderWidth / slidesToShow;

        this.slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });

        this.sliderTrack.style.width = `${slideWidth * this.slideCount}px`;
    }

    updateSlider() {
        if (!this.sliderTrack) return;
        // Update slide position
        const slidesToShow = Math.max(1, Math.min(this.options.slideToShow, this.slideCount));
        const slideWidth = this.slider.offsetWidth / slidesToShow;
        const offset = -this.currentSlide * slideWidth * this.options.slideToScroll;
        this.sliderTrack.style.transform = `translateX(${offset}px)`;

        const visibleIndices = [];
        for (let i = 0; i < slidesToShow; i++) {
            visibleIndices.push((this.currentSlide + i) % this.slideCount);
        }

        this.slides.forEach((slide, index) => {
            const isVisible = visibleIndices.includes(index);
            slide.classList.toggle('active', isVisible);
            slide.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
            slide.tabIndex = isVisible ? 0 : -1;
        });

        // Update dots
        if (this.options.dots && this.dots.length) {
            this.dots.forEach((dot, index) => {
                const isActive = index === this.currentSlide;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        }

        // Update arrows for non-infinite sliders
        if (!this.options.infinite && this.options.arrows && this.prevBtn && this.nextBtn) {
            const atStart = this.currentSlide === 0;
            const atEnd = this.currentSlide >= this.slideCount - this.options.slideToShow;
            this.prevBtn.classList.toggle('disabled', atStart);
            this.nextBtn.classList.toggle('disabled', atEnd);
            this.prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
            this.nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
        }
    }

    nextSlide() {
        if (!this.options.infinite && this.currentSlide >= this.slideCount - this.options.slideToShow) {
            return;
        }

        this.currentSlide = (this.currentSlide + this.options.slideToScroll) % this.slideCount;
        this.updateSlider();
        this.restartAutoplay();
    }

    prevSlide() {
        if (!this.options.infinite && this.currentSlide === 0) {
            return;
        }

        this.currentSlide = (this.currentSlide - this.options.slideToScroll + this.slideCount) % this.slideCount;
        this.updateSlider();
        this.restartAutoplay();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
        this.restartAutoplay();
    }

    startAutoplay() {
        if (this.options.autoplay) {
            this.stopAutoplay();
            this.autoplayTimer = setInterval(() => {
                this.nextSlide();
            }, this.options.autoplaySpeed);
        }
    }

    restartAutoplay() {
        if (this.options.autoplay && !this.userInteracting) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    handleResize() {
        const windowWidth = window.innerWidth;

        if (this.responsiveSettings.length) {
            this.options.slideToShow = this.defaultSettings.slideToShow;
            this.options.slideToScroll = this.defaultSettings.slideToScroll;

            for (const setting of this.responsiveSettings) {
                if (windowWidth <= setting.breakpoint) {
                    if (setting.settings.slideToShow) {
                        this.options.slideToShow = setting.settings.slideToShow;
                    }

                    if (setting.settings.slideToScroll) {
                        this.options.slideToScroll = setting.settings.slideToScroll;
                    }

                    break;
                }
            }

            this.setSlideWidth();
            this.updateSlider();
        }
    }
}

// Hero Slider
document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider Initialization
    const heroSlider = new FruitSlider('.hero-slider', {
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: true,
        arrows: true,
        dots: true
    });
    
    // Product Slider Initialization
    const productSlider = new FruitSlider('.product-slider', {
        autoplay: false,
        slideToShow: 4,
        slideToScroll: 1,
        arrows: true,
        dots: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slideToShow: 3
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slideToShow: 2
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slideToShow: 1
                }
            }
        ]
    });
    
    // Testimonial Slider Initialization
    const testimonialSlider = new FruitSlider('.testimonial-slider', {
        autoplay: true,
        autoplaySpeed: 7000,
        infinite: true,
        arrows: true,
        dots: true
    });
    
    // Blog Slider Initialization
    const blogSlider = new FruitSlider('.blog-slider', {
        autoplay: false,
        slideToShow: 3,
        slideToScroll: 1,
        arrows: true,
        dots: false,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slideToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slideToShow: 1
                }
            }
        ]
    });
    
    // Check for other sliders that might be initialized dynamically
    const initDynamicSliders = () => {
        const dynamicSliders = document.querySelectorAll('.dynamic-slider:not(.initialized)');
        
        dynamicSliders.forEach(slider => {
            slider.classList.add('initialized');
            
            // Get slider options from data attributes
            const options = {
                autoplay: slider.dataset.autoplay === 'true',
                autoplaySpeed: parseInt(slider.dataset.autoplaySpeed) || 5000,
                slideToShow: parseInt(slider.dataset.slideToShow) || 1,
                arrows: slider.dataset.arrows !== 'false',
                dots: slider.dataset.dots === 'true'
            };
            
            // Initialize dynamic slider
            new FruitSlider(`.${slider.className.split(' ').join('.')}`, options);
        });
    };
    
    // Initialize any dynamic sliders
    initDynamicSliders();
    
    // Re-check for dynamic sliders when content changes
    // This would be used if sliders are added via AJAX
    document.addEventListener('contentUpdated', initDynamicSliders);
});