// Search functionality
const products = [
    {
        id: 1,
        name: "Nritya Lavender printed 2 Piece Linen Shimmer Kurta with Dupatta",
        price: 1999,
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=500&fit=crop",
        category: "kurta",
        badge: "New"
    },
    {
        id: 2,
        name: "Bloomveil Half-White printed 2 Piece Linen Blend Kurta with Dupatta",
        price: 2299,
        image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop",
        category: "kurta",
        badge: "New"
    },
    {
        id: 3,
        name: "Tanira Brown printed 2 Piece Khata Silk Kurta with Dupatta",
        price: 2499,
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=500&fit=crop",
        category: "kurta",
        badge: "New"
    },
    {
        id: 4,
        name: "Mistyrose Pink printed 2 Piece Muslin Shimmer Butti Kurta with Dupatta",
        price: 2199,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
        category: "kurta",
        badge: "New"
    },
    {
        id: 5,
        name: "Elegant Floral Print Summer Dress with Ruffles",
        price: 1799,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop",
        category: "dress",
        badge: "New"
    },
    {
        id: 6,
        name: "Chic Pastel Green Co-ord Set with Embroidery",
        price: 2599,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
        category: "co-ord",
        badge: "New"
    },
    {
        id: 7,
        name: "Beautiful Blue Printed Anarkali Suit Set",
        price: 2899,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
        category: "suit",
        badge: "New"
    },
    {
        id: 8,
        name: "Gorgeous Peach Georgette Palazzo Suit",
        price: 1899,
        image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop",
        category: "suit",
        badge: "New"
    },
    {
        id: 9,
        name: "Trendy Black Printed Jumpsuit with Belt",
        price: 2399,
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop",
        category: "dress",
        badge: "New"
    },
    {
        id: 10,
        name: "Stylish Maroon Velvet Party Dress",
        price: 3299,
        image: "https://images.unsplash.com/photo-1512310604669-443f26c35f52?w=400&h=500&fit=crop",
        category: "dress",
        badge: "New"
    },
    {
        id: 11,
        name: "Designer Teal Blue Kurti with Palazzo",
        price: 2199,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
        category: "kurta",
        badge: "New"
    },
    {
        id: 12,
        name: "Classic Cream Lace Evening Gown",
        price: 3799,
        image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&h=500&fit=crop",
        category: "dress",
        badge: "New"
    }
];

let currentResults = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const resultsContainer = document.getElementById('search-results-container');
    const noResults = document.getElementById('no-results');
    const searchLoading = document.getElementById('search-loading');
    const resultsCount = document.getElementById('results-count');
    const searchQuery = document.getElementById('search-query');
    const sortDropdown = document.getElementById('sort-dropdown');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');

    // Search form submit
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch(searchInput.value.trim());
    });

    // Suggestion tags click
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchTerm = tag.getAttribute('data-search');
            searchInput.value = searchTerm;
            performSearch(searchTerm);
        });
    });

    // Sort dropdown change
    sortDropdown.addEventListener('change', () => {
        sortResults(sortDropdown.value);
        renderResults();
    });

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderResults();
        });
    });

    // Perform search
    function performSearch(query) {
        if (!query) {
            return;
        }

        // Show loading
        searchLoading.classList.add('active');
        resultsContainer.style.display = 'none';
        noResults.style.display = 'none';

        // Simulate search delay
        setTimeout(() => {
            const results = searchProducts(query);
            currentResults = results;
            searchQuery.textContent = query;

            searchLoading.classList.remove('active');

            if (results.length > 0) {
                resultsContainer.style.display = 'block';
                renderResults();
            } else {
                noResults.style.display = 'block';
            }
        }, 500);
    }

    // Search products
    function searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery)
        );
    }

    // Render results
    function renderResults() {
        let filteredResults = currentResults;

        // Apply category filter
        if (currentFilter !== 'all') {
            filteredResults = currentResults.filter(product => 
                product.category === currentFilter
            );
        }

        resultsCount.textContent = filteredResults.length;

        if (filteredResults.length === 0) {
            searchResults.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No products match your filters</p>';
            return;
        }

        searchResults.innerHTML = filteredResults.map(product => `
            <div class="product-card" data-product-id="${product.id}" onclick="goToProduct(${product.id})">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="price">Rs. ${product.price.toLocaleString()}</p>
                </div>
            </div>
        `).join('');
    }

    // Sort results
    function sortResults(sortBy) {
        switch(sortBy) {
            case 'price-low':
                currentResults.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                currentResults.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                currentResults.reverse();
                break;
            default:
                // relevance - keep original order
                break;
        }
    }

    // Check URL parameters for search query
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    if (urlQuery) {
        searchInput.value = urlQuery;
        performSearch(urlQuery);
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

    // Update cart count
    updateCartCount();
});

// Navigate to product
function goToProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
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
