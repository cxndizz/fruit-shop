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
        this.options = {
            autoplay: options.autoplay || false,
            autoplaySpeed: options.autoplaySpeed || 5000,
            infinite: options.infinite !== undefined ? options.infinite : true,
            slideToShow: options.slideToShow || 1,
            slideToScroll: options.slideToScroll || 1,
            arrows: options.arrows !== undefined ? options.arrows : true,
            dots: options.dots !== undefined ? options.dots : true,
            responsive: options.responsive || null
        };
        
        this.slideCount = this.slides.length;
        this.currentSlide = 0;
        this.autoplayTimer = null;
        
        this.init();
    }
    
    init() {
        if (this.slideCount <= 0) return;
        
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
            this.slider.addEventListener('mouseenter', this.stopAutoplay.bind(this));
            this.slider.addEventListener('mouseleave', this.startAutoplay.bind(this));
        }
        
        // Responsive handling
        if (this.options.responsive) {
            window.addEventListener('resize', this.handleResize.bind(this));
            this.handleResize();
        }
        
        // Initial update
        this.updateSlider();
    }
    
    setSlideWidth() {
        const sliderWidth = this.slider.offsetWidth;
        const slideWidth = sliderWidth / this.options.slideToShow;
        
        this.slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });
        
        this.sliderTrack.style.width = `${slideWidth * this.slideCount}px`;
    }
    
    updateSlider() {
        // Update slide position
        const slideWidth = this.slider.offsetWidth / this.options.slideToShow;
        const offset = -this.currentSlide * slideWidth * this.options.slideToScroll;
        this.sliderTrack.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        if (this.options.dots && this.dots.length) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        }
        
        // Update arrows for non-infinite sliders
        if (!this.options.infinite && this.options.arrows) {
            this.prevBtn.classList.toggle('disabled', this.currentSlide === 0);
            this.nextBtn.classList.toggle('disabled', this.currentSlide >= this.slideCount - this.options.slideToShow);
        }
    }
    
    nextSlide() {
        if (!this.options.infinite && this.currentSlide >= this.slideCount - this.options.slideToShow) {
            return;
        }
        
        this.currentSlide = (this.currentSlide + this.options.slideToScroll) % this.slideCount;
        this.updateSlider();
    }
    
    prevSlide() {
        if (!this.options.infinite && this.currentSlide === 0) {
            return;
        }
        
        this.currentSlide = (this.currentSlide - this.options.slideToScroll + this.slideCount) % this.slideCount;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    startAutoplay() {
        if (this.options.autoplay) {
            this.stopAutoplay();
            this.autoplayTimer = setInterval(() => {
                this.nextSlide();
            }, this.options.autoplaySpeed);
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
        
        if (this.options.responsive) {
            // Sort breakpoints descending
            const breakpoints = this.options.responsive.map(item => item.breakpoint);
            breakpoints.sort((a, b) => b - a);
            
            // Find matching breakpoint
            for (let i = 0; i < breakpoints.length; i++) {
                const breakpoint = breakpoints[i];
                const setting = this.options.responsive.find(item => item.breakpoint === breakpoint);
                
                if (windowWidth <= breakpoint) {
                    // Apply breakpoint settings
                    if (setting.settings.slideToShow) {
                        this.options.slideToShow = setting.settings.slideToShow;
                    }
                    
                    if (setting.settings.slideToScroll) {
                        this.options.slideToScroll = setting.settings.slideToScroll;
                    }
                    
                    this.setSlideWidth();
                    this.updateSlider();
                    return;
                }
            }
            
            // Reset to default if no breakpoints match
            this.options.slideToShow = this.options.slideToShow;
            this.options.slideToScroll = this.options.slideToScroll;
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