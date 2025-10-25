// Product data structure
const productData = {
    1: {
        id: 1,
        name: "Nritya Lavender printed 2 Piece Linen Shimmer Kurta with Dupatta",
        price: 1999,
        originalPrice: 2999,
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop",
        badge: "New",
        description: "Experience elegance with this beautifully crafted Lavender printed Linen Shimmer Kurta set. Made from premium quality linen fabric with subtle shimmer, this 2-piece set includes a kurta and dupatta. The intricate print work and comfortable fit make it perfect for festive occasions and celebrations.",
        category: "Kurta Set"
    },
    2: {
        id: 2,
        name: "Bloomveil Half-White printed 2 Piece Linen Blend Kurta with Dupatta",
        price: 2299,
        originalPrice: 3299,
        image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&h=1000&fit=crop",
        badge: "New",
        description: "Discover sophistication with this Half-White printed Linen Blend Kurta set. The delicate prints and premium linen blend fabric create a perfect balance of style and comfort. This 2-piece ensemble is ideal for both casual outings and special occasions.",
        category: "Kurta Set"
    },
    3: {
        id: 3,
        name: "Tanira Brown printed 2 Piece Khata Silk Kurta with Dupatta",
        price: 2499,
        originalPrice: 3499,
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop",
        badge: "New",
        description: "Embrace traditional elegance with this Brown printed Khata Silk Kurta set. Crafted from luxurious Khata silk with intricate prints, this 2-piece set exudes grace and sophistication. Perfect for weddings, festivals, and special celebrations.",
        category: "Kurta Set"
    },
    4: {
        id: 4,
        name: "Mistyrose Pink printed 2 Piece Muslin Shimmer Butti Kurta with Dupatta",
        price: 2199,
        originalPrice: 3199,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop",
        badge: "New",
        description: "Step into elegance with this Mistyrose Pink Muslin Shimmer Butti Kurta set. The soft muslin fabric with shimmer butti work creates a stunning visual appeal. This comfortable yet stylish 2-piece set is perfect for any festive occasion.",
        category: "Kurta Set"
    }
};

// Get product ID from URL parameters
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

// Load product details
function loadProductDetails() {
    const productId = getProductIdFromURL();
    const product = productData[productId];

    if (!product) {
        console.error('Product not found');
        return;
    }

    // Update page title
    document.title = `${product.name} - Fashionista`;

    // Update breadcrumb
    document.getElementById('breadcrumb-product').textContent = product.name;

    // Update main image
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.image;
    mainImage.alt = product.name;

    // Update thumbnails (using same image for demo, you can add more images)
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.src = product.image;
    });

    // Update badge
    const badge = document.getElementById('product-badge');
    if (product.badge) {
        badge.textContent = product.badge;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }

    // Update product info
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = `Rs. ${product.price.toLocaleString()}`;
    document.getElementById('product-description').textContent = product.description;

    // Update original price if available
    const originalPriceElement = document.querySelector('.original-price');
    if (product.originalPrice) {
        originalPriceElement.textContent = `Rs. ${product.originalPrice.toLocaleString()}`;
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        document.querySelector('.discount').textContent = `${discount}% OFF`;
    }
}

// Cart helper functions
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('fashionista_cart') || '[]');
    
    const existingItem = cart.find(item => 
        item.id === product.id && item.size === product.size
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('fashionista_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('fashionista_cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElements = document.querySelectorAll('#nav-cart-count, .cart-count');
    countElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'block' : 'none';
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
    updateCartCount();

    // Thumbnail click handler
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            mainImage.src = this.src;
        });
    });

    // Size selector
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Wishlist button
    const wishlistBtn = document.querySelector('.btn-wishlist');
    wishlistBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            showNotification('Added to wishlist!');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            showNotification('Removed from wishlist');
        }
    });

    // Add to cart button
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        const selectedSize = document.querySelector('.size-btn.active').textContent;
        const productId = getProductIdFromURL();
        const product = productData[productId];
        
        if (product) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: selectedSize
            });
            showNotification(`Added to cart! Size: ${selectedSize}`);
            updateCartCount();
        }
    });

    // Buy now button
    const buyNowBtn = document.querySelector('.btn-buy-now');
    buyNowBtn.addEventListener('click', function() {
        const selectedSize = document.querySelector('.size-btn.active').textContent;
        const productId = getProductIdFromURL();
        const product = productData[productId];
        
        if (product) {
            // Clear cart and add only this item
            localStorage.removeItem('fashionista_cart');
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: selectedSize
            });
            // Redirect to checkout
            window.location.href = 'checkout.html';
        }
    });

    // Related products click handler
    const relatedProducts = document.querySelectorAll('.related-products .product-card');
    relatedProducts.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            window.location.href = `product-detail.html?id=${productId}`;
        });
    });

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // WhatsApp button
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://wa.me/1234567890', '_blank');
        });
    }
});

// Show notification function
function showNotification(message) {
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
