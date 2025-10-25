// Checkout functionality
class Checkout {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    loadCart() {
        const cart = localStorage.getItem('fashionista_cart');
        return cart ? JSON.parse(cart) : [];
    }

    init() {
        // Redirect if cart is empty
        if (this.cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        this.renderOrderSummary();
        this.updateCartCount();
        this.attachEventListeners();
    }

    getSubtotal() {
        return this.cart.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
    }

    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= 800 ? 0 : 50;
    }

    getDiscount() {
        // Get discount from localStorage if promo was applied
        const savedDiscount = localStorage.getItem('fashionista_discount');
        return savedDiscount ? parseInt(savedDiscount) : 0;
    }

    getTotal() {
        return this.getSubtotal() + this.getShipping() - this.getDiscount();
    }

    renderOrderSummary() {
        const orderItems = document.getElementById('order-items');
        
        orderItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <div class="order-item-title">${item.name}</div>
                    <div class="order-item-meta">Size: ${item.size} | Qty: ${item.quantity}</div>
                    <div class="order-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
                </div>
            </div>
        `).join('');

        // Update summary
        document.getElementById('checkout-subtotal').textContent = `Rs. ${this.getSubtotal().toLocaleString()}`;
        document.getElementById('checkout-shipping').textContent = this.getShipping() === 0 ? 'FREE' : `Rs. ${this.getShipping()}`;
        document.getElementById('checkout-discount').textContent = `- Rs. ${this.getDiscount()}`;
        document.getElementById('checkout-total').textContent = `Rs. ${this.getTotal().toLocaleString()}`;
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const countElements = document.querySelectorAll('#nav-cart-count, .cart-count');
        countElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'block' : 'none';
        });
    }

    attachEventListeners() {
        const form = document.getElementById('checkout-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.placeOrder();
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
    }

    placeOrder() {
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            pincode: document.getElementById('pincode').value,
            country: document.getElementById('country').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            items: this.cart,
            subtotal: this.getSubtotal(),
            shipping: this.getShipping(),
            discount: this.getDiscount(),
            total: this.getTotal()
        };

        // Generate order ID
        const orderId = 'FS' + Date.now();

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('fashionista_orders') || '[]');
        orders.push({
            orderId: orderId,
            date: new Date().toISOString(),
            ...formData
        });
        localStorage.setItem('fashionista_orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('fashionista_cart');
        localStorage.removeItem('fashionista_discount');

        // Show success message
        showNotification(`Order placed successfully! Order ID: ${orderId}`);

        // Redirect to success page after 2 seconds
        setTimeout(() => {
            window.location.href = `order-success.html?orderId=${orderId}`;
        }, 2000);
    }
}

// Show notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
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

// Initialize checkout
document.addEventListener('DOMContentLoaded', () => {
    new Checkout();
});
