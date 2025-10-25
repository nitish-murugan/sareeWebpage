// Cart Management System
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.promoCode = null;
        this.discount = 0;
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartCount();
        this.attachEventListeners();
    }

    loadCart() {
        const cart = localStorage.getItem('fashionista_cart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('fashionista_cart', JSON.stringify(this.items));
    }

    addItem(product) {
        const existingItem = this.items.find(item => 
            item.id === product.id && item.size === product.size
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
    }

    removeItem(productId, size) {
        this.items = this.items.filter(item => 
            !(item.id === productId && item.size === size)
        );
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
    }

    updateQuantity(productId, size, change) {
        const item = this.items.find(i => 
            i.id === productId && i.size === size
        );

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId, size);
            } else {
                this.saveCart();
                this.renderCart();
            }
        }
    }

    getCartCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getSubtotal() {
        return this.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
    }

    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= 800 ? 0 : 50;
    }

    getTotal() {
        return this.getSubtotal() + this.getShipping() - this.discount;
    }

    applyPromoCode(code) {
        const promoCodes = {
            'SAVE10': 10,
            'SAVE20': 20,
            'FIRST50': 50,
            'WELCOME100': 100
        };

        if (promoCodes[code.toUpperCase()]) {
            this.discount = promoCodes[code.toUpperCase()];
            this.promoCode = code.toUpperCase();
            showNotification(`Promo code ${code} applied! You saved Rs. ${this.discount}`);
            this.renderCart();
        } else {
            showNotification('Invalid promo code', 'error');
        }
    }

    updateCartCount() {
        const countElements = document.querySelectorAll('#nav-cart-count, .cart-count');
        const count = this.getCartCount();
        countElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'block' : 'none';
        });
    }

    renderCart() {
        const emptyCart = document.getElementById('empty-cart');
        const cartItems = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');

        if (this.items.length === 0) {
            emptyCart.style.display = 'block';
            cartItems.classList.remove('active');
            cartSummary.classList.add('hidden');
            return;
        }

        emptyCart.style.display = 'none';
        cartItems.classList.add('active');
        cartSummary.classList.remove('hidden');

        // Render cart items
        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-size">Size: ${item.size}</div>
                    <div class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" onclick="cart.removeItem(${item.id}, '${item.size}')">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, '${item.size}', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, '${item.size}', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Update summary
        document.getElementById('summary-items-count').textContent = this.getCartCount();
        document.getElementById('summary-subtotal').textContent = `Rs. ${this.getSubtotal().toLocaleString()}`;
        document.getElementById('summary-shipping').textContent = this.getShipping() === 0 ? 'FREE' : `Rs. ${this.getShipping()}`;
        document.getElementById('summary-discount').textContent = `- Rs. ${this.discount}`;
        document.getElementById('summary-total').textContent = `Rs. ${this.getTotal().toLocaleString()}`;
    }

    attachEventListeners() {
        // Promo code
        const promoBtn = document.getElementById('apply-promo-btn');
        const promoInput = document.getElementById('promo-input');

        if (promoBtn) {
            promoBtn.addEventListener('click', () => {
                const code = promoInput.value.trim();
                if (code) {
                    this.applyPromoCode(code);
                }
            });

            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const code = promoInput.value.trim();
                    if (code) {
                        this.applyPromoCode(code);
                    }
                }
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length > 0) {
                    window.location.href = 'checkout.html';
                }
            });
        }

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

// Initialize cart
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});
