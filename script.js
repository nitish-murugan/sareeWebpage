// Hero Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Carousel
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let autoPlayInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Auto play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    startAutoPlay();

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Here you can add filtering logic
            const filter = btn.getAttribute('data-filter');
            console.log('Filter selected:', filter);
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Product Cards Click Handler
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Get product ID from data attribute or use index + 1
            const productId = card.getAttribute('data-product-id') || (index + 1);
            // Navigate to product detail page
            window.location.href = `product-detail.html?id=${productId}`;
        });
    });

    // Category Cards Click Handler
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h3').textContent;
            console.log('Category clicked:', category);
            // Scroll to products section with filter
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
            // You can add category filtering logic here
        });
    });

    // Search Icon Click
    const searchIcon = document.querySelector('.nav-icons a[href="#search"]');
    if (searchIcon) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            // Add search functionality here
            alert('Search functionality would open here');
        });
    }

    // Cart Icon Click
    const cartIcon = document.querySelector('.nav-icons a[href="#cart"]');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            // Add cart functionality here
            alert('Shopping cart would open here');
        });
    }

    // Account Icon Click
    const accountIcon = document.querySelector('.nav-icons a[href="#account"]');
    if (accountIcon) {
        accountIcon.addEventListener('click', (e) => {
            e.preventDefault();
            // Add account functionality here
            alert('Account page would open here');
        });
    }

    // WhatsApp Float Button
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Replace with your WhatsApp number
            window.open('https://wa.me/1234567890', '_blank');
        });
    }

    // Scroll Animation for Elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards for scroll animation
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(card);
    });

    // Observe category cards for scroll animation
    categoryCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(card);
    });
});

// Add to Cart Functionality (Example)
function addToCart(productId) {
    console.log('Adding product to cart:', productId);
    // Implement cart logic here
    showNotification('Product added to cart!');
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);
