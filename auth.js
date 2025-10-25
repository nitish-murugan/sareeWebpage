// Authentication utility functions
function isUserLoggedIn() {
    return localStorage.getItem('fashionista_user') !== null;
}

function getCurrentUser() {
    const userData = localStorage.getItem('fashionista_user');
    return userData ? JSON.parse(userData) : null;
}

function logout() {
    localStorage.removeItem('fashionista_user');
    window.location.href = 'index.html';
}

function updateAuthButton() {
    const accountIcon = document.querySelector('.nav-icons a[href="login.html"]');
    if (!accountIcon) return;

    if (isUserLoggedIn()) {
        const user = getCurrentUser();
        
        // Create dropdown for logged-in user
        const accountWrapper = document.createElement('div');
        accountWrapper.className = 'account-wrapper';
        accountWrapper.innerHTML = `
            <a href="#" class="account-link">
                <i class="fas fa-user"></i>
                <span class="user-name">${user.name || 'Account'}</span>
            </a>
            <div class="account-dropdown">
                <div class="dropdown-header">
                    <i class="fas fa-user-circle"></i>
                    <div>
                        <strong>${user.name || 'User'}</strong>
                        <small>${user.email}</small>
                    </div>
                </div>
                <a href="track-order.html" class="dropdown-item">
                    <i class="fas fa-box"></i> My Orders
                </a>
                <a href="#" class="dropdown-item" onclick="event.preventDefault(); logout();">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        `;
        
        accountIcon.parentNode.replaceChild(accountWrapper, accountIcon);
        
        // Add click event to toggle dropdown
        const accountLink = accountWrapper.querySelector('.account-link');
        const dropdown = accountWrapper.querySelector('.account-dropdown');
        
        accountLink.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!accountWrapper.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthButton();
});
