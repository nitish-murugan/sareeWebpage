// Track Order functionality
document.addEventListener('DOMContentLoaded', () => {
    const trackForm = document.getElementById('track-form');
    const orderIdInput = document.getElementById('order-id');
    const emailInput = document.getElementById('email');
    const trackingResult = document.getElementById('tracking-result');
    const errorMessage = document.getElementById('error-message');
    const recentOrdersContainer = document.getElementById('recent-orders');

    // Load recent orders on page load
    loadRecentOrders();

    // Track form submit
    trackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderId = orderIdInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        trackOrder(orderId, email);
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

    // Update cart count
    updateCartCount();
});

// Load recent orders from localStorage
function loadRecentOrders() {
    const recentOrdersContainer = document.getElementById('recent-orders');
    
    // Check if user is logged in
    const userData = localStorage.getItem('fashionista_user');
    if (!userData) {
        recentOrdersContainer.innerHTML = '<p class="no-recent-orders"><i class="fas fa-lock"></i><br>Please <a href="login.html" style="color: #d4a574; text-decoration: underline;">login</a> to view your recent orders</p>';
        return;
    }
    
    const user = JSON.parse(userData);
    const orders = JSON.parse(localStorage.getItem('fashionista_orders') || '[]');
    
    // Filter orders by logged-in user's email
    const userOrders = orders.filter(order => order.email.toLowerCase() === user.email.toLowerCase());

    if (userOrders.length === 0) {
        recentOrdersContainer.innerHTML = '<p class="no-recent-orders">No recent orders found</p>';
        return;
    }

    // Show last 3 orders
    const recentOrders = userOrders.slice(-3).reverse();
    recentOrdersContainer.innerHTML = recentOrders.map(order => `
        <div class="recent-order-item" onclick="quickTrackOrder('${order.orderId}', '${order.email}')">
            <strong>Order ${order.orderId}</strong>
            <span>${new Date(order.date).toLocaleDateString()} • ${order.items.length} items • Rs. ${order.total.toLocaleString()}</span>
        </div>
    `).join('');
}

// Quick track from recent orders
function quickTrackOrder(orderId, email) {
    document.getElementById('order-id').value = orderId;
    document.getElementById('email').value = email;
    trackOrder(orderId, email);
}

// Track order function
function trackOrder(orderId, email) {
    // Get all orders from localStorage
    const orders = JSON.parse(localStorage.getItem('fashionista_orders') || '[]');
    
    // Find the order
    const order = orders.find(o => o.orderId === orderId && o.email.toLowerCase() === email.toLowerCase());

    if (!order) {
        // Show error
        document.getElementById('tracking-result').style.display = 'none';
        document.getElementById('error-message').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Hide error and form, show result
    document.getElementById('error-message').style.display = 'none';
    document.querySelector('.track-form-container').style.display = 'none';
    document.getElementById('tracking-result').style.display = 'block';

    // Populate order details
    displayOrderDetails(order);

    // Scroll to result
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Display order details
function displayOrderDetails(order) {
    // Order header
    document.getElementById('result-order-id').textContent = order.orderId;
    document.getElementById('result-order-date').textContent = new Date(order.date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Determine order status (simulate tracking status)
    const orderDate = new Date(order.date);
    const now = new Date();
    const daysSinceOrder = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

    let status = 'placed';
    if (daysSinceOrder >= 7) status = 'delivered';
    else if (daysSinceOrder >= 4) status = 'shipped';
    else if (daysSinceOrder >= 2) status = 'processing';
    else if (daysSinceOrder >= 1) status = 'confirmed';

    // Status badge
    const statusBadge = document.getElementById('result-status-badge');
    statusBadge.className = `order-status-badge ${status}`;
    statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);

    // Update timeline
    updateTimeline(status, orderDate);

    // Order items
    displayOrderItems(order.items);

    // Shipping address
    displayShippingAddress(order);

    // Order summary
    displayOrderSummary(order);
}

// Update timeline
function updateTimeline(status, orderDate) {
    const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status);

    statuses.forEach((s, index) => {
        const item = document.querySelector(`.timeline-item[data-status="${s}"]`);
        if (index <= currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Set dates
    const placedDate = new Date(orderDate);
    document.getElementById('placed-date').textContent = formatDate(placedDate);

    if (currentIndex >= 1) {
        const confirmedDate = new Date(placedDate);
        confirmedDate.setHours(placedDate.getHours() + 2);
        document.getElementById('confirmed-date').textContent = formatDate(confirmedDate);
    }

    if (currentIndex >= 2) {
        const processingDate = new Date(placedDate);
        processingDate.setDate(placedDate.getDate() + 1);
        document.getElementById('processing-date').textContent = formatDate(processingDate);
    }

    if (currentIndex >= 3) {
        const shippedDate = new Date(placedDate);
        shippedDate.setDate(placedDate.getDate() + 3);
        document.getElementById('shipped-date').textContent = formatDate(shippedDate);
        
        // Add tracking number
        const trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        document.getElementById('tracking-number').textContent = `Tracking Number: ${trackingNumber}`;
    }

    if (currentIndex >= 4) {
        const deliveredDate = new Date(placedDate);
        deliveredDate.setDate(placedDate.getDate() + 7);
        document.getElementById('delivered-date').textContent = formatDate(deliveredDate);
    }
}

// Format date
function formatDate(date) {
    return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Display order items
function displayOrderItems(items) {
    const itemsContainer = document.getElementById('result-items');
    itemsContainer.innerHTML = items.map(item => `
        <div class="order-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Size: ${item.size || 'M'}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="item-price">
                Rs. ${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `).join('');
}

// Display shipping address
function displayShippingAddress(order) {
    const addressContainer = document.getElementById('result-address');
    addressContainer.innerHTML = `
        <strong>${order.shippingAddress.fullName}</strong><br>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
        Phone: ${order.shippingAddress.phone}<br>
        Email: ${order.email}
    `;
}

// Display order summary
function displayOrderSummary(order) {
    document.getElementById('result-subtotal').textContent = `Rs. ${order.subtotal.toLocaleString()}`;
    document.getElementById('result-shipping').textContent = order.shipping === 0 ? 'FREE' : `Rs. ${order.shipping.toLocaleString()}`;
    
    const discount = order.discount || 0;
    document.getElementById('result-discount').textContent = discount > 0 ? `-Rs. ${discount.toLocaleString()}` : 'Rs. 0';
    
    document.getElementById('result-total').textContent = `Rs. ${order.total.toLocaleString()}`;
}

// Track another order
function trackAnother() {
    document.querySelector('.track-form-container').style.display = 'block';
    document.getElementById('tracking-result').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('order-id').value = '';
    document.getElementById('email').value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('fashionista_cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElements = document.querySelectorAll('#nav-cart-count, .cart-count');
    countElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'block' : 'none';
    });
}
