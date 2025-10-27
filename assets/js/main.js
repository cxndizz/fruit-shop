/* 
* FreshFruit Shop - Main JavaScript
* ฟังก์ชั่นการทำงานหลักของเว็บไซต์ร้านผลไม้
*/

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.mobile-menu-btn')) {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Add close button to mobile menu
    if (navMenu) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', function() {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
        navMenu.prepend(closeBtn);
    }
    
    // ===== Product Categories Filter =====
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productItems = document.querySelectorAll('.product-card');
    
    if (categoryButtons.length && productItems.length) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                // Filter products
                productItems.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = 'block';
                    } else {
                        if (item.classList.contains(filter)) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // ===== Product Quantity Controls =====
    const quantityBtns = document.querySelectorAll('.quantity button');
    
    if (quantityBtns.length) {
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const currentValue = parseInt(input.value);
                
                if (this.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                } else if (this.classList.contains('plus')) {
                    input.value = currentValue + 1;
                }
            });
        });
    }
    
    // ===== Product Gallery =====
    const productThumbs = document.querySelectorAll('.product-thumb');
    const mainProductImg = document.querySelector('.product-main-img img');
    
    if (productThumbs.length && mainProductImg) {
        productThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Remove active class from all thumbnails
                productThumbs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image
                const imgSrc = this.querySelector('img').getAttribute('src');
                mainProductImg.setAttribute('src', imgSrc);
            });
        });
    }
    
    // ===== Product Tabs =====
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length && tabContents.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // ===== FAQ Accordion =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    }
    
    // ===== Floating Contact Button =====
    const floatingBtn = document.querySelector('.float-btn');
    
    if (floatingBtn) {
        floatingBtn.addEventListener('click', function() {
            const contactSection = document.getElementById('contact-section');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop,
                    behavior: 'smooth'
                });
            } else {
                // If not on contact page, redirect to contact page
                window.location.href = '/contact.html';
            }
        });
    }
    
    // ===== Sticky Header =====
    const header = document.querySelector('.site-header');
    let scrollPosition = window.scrollY;
    
    if (header) {
        window.addEventListener('scroll', function() {
            scrollPosition = window.scrollY;
            
            if (scrollPosition > 100) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }
    
    // ===== Active Navigation Link =====
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (navLinks.length) {
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Check if current page matches link or if it's a sub-page
            if (currentPage === linkPath || 
                (linkPath !== '/' && linkPath !== '/index.html' && currentPage.includes(linkPath))) {
                link.classList.add('active');
            }
        });
    }
    
    // ===== Smooth Scroll for Anchor Links =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    if (anchorLinks.length) {
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ===== Lazy Loading Images =====
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }
    
    // ===== Initialize Animation on Scroll =====
    const animatedElements = document.querySelectorAll('.animate');
    
    if (animatedElements.length) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
    
    // ===== Add to Cart Functionality =====
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    if (addToCartButtons.length) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productId = this.getAttribute('data-product-id');
                const productName = this.getAttribute('data-product-name');
                const productPrice = this.getAttribute('data-product-price');
                const productImg = this.getAttribute('data-product-img');
                const quantity = this.closest('.product-add-to-cart')?.querySelector('.quantity input')?.value || 1;
                
                // Show success message (in real site, this would add to cart)
                showNotification(`เพิ่ม ${productName} จำนวน ${quantity} ชิ้นลงตะกร้าแล้ว`, 'success');
                
                // Here you would normally send data to backend or store in localStorage
                // For this demo, we'll just log it
                console.log('Added to cart:', {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImg,
                    quantity: quantity
                });
            });
        });
    }
    
    // ===== Contact Form Handling =====
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send form data to backend
            // For this demo, we'll just show a success message
            showNotification('ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด', 'success');
            
            // Reset form
            this.reset();
        });
    }
    
    // ===== Notification Function =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${message}</div>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Remove from DOM after animation
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            
            // Remove from DOM after animation
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
    }

    // ===== Share Product/Blog Functions =====
    const shareLinks = document.querySelectorAll('.share-link');
    
    if (shareLinks.length) {
        shareLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const platform = this.getAttribute('data-platform');
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                let shareUrl = '';
                
                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'line':
                        shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${title}&body=${url}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }

    // ===== Load JSON Data (Products, Testimonials) =====
    function loadJSONData(url, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => callback(data))
            .catch(error => console.error('Error loading JSON data:', error));
    }
    
    // Load products if on relevant page
    const productsContainer = document.querySelector('.products-grid');
    if (productsContainer) {
        loadJSONData('/data/products.json', function(products) {
            renderProducts(products, productsContainer);
        });
    }
    
    // Load testimonials if on relevant page
    const testimonialsContainer = document.querySelector('.testimonial-slider');
    if (testimonialsContainer) {
        loadJSONData('/data/testimonials.json', function(testimonials) {
            renderTestimonials(testimonials, testimonialsContainer);
        });
    }
    
    // Render products function
    function renderProducts(products, container) {
        if (!products || !products.length) return;
        
        let html = '';
        
        products.forEach(product => {
            html += `
                <div class="product-card ${product.category}">
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">
                            <a href="${product.url}">${product.name}</a>
                        </h3>
                        <div class="product-price">฿${product.price.toLocaleString()}</div>
                        <div class="product-meta">
                            <div class="product-rating">
                                <i class="fas fa-star"></i> ${product.rating}
                            </div>
                            <a href="${product.url}" class="btn btn-sm btn-primary">รายละเอียด</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // Render testimonials function
    function renderTestimonials(testimonials, container) {
        if (!testimonials || !testimonials.length) return;
        
        let html = '';
        
        testimonials.forEach(testimonial => {
            html += `
                <div class="testimonial-item">
                    <div class="testimonial-content">
                        <p>${testimonial.content}</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-img">
                            <img src="${testimonial.image}" alt="${testimonial.name}">
                        </div>
                        <div class="author-info">
                            <h4 class="author-name">${testimonial.name}</h4>
                            <div class="author-title">${testimonial.title}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Initialize testimonial slider
        if (typeof Swiper !== 'undefined') {
            new Swiper('.testimonial-slider', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            });
        }
    }
});