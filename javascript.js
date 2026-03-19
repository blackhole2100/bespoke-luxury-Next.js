/* ============================================================
   ROYAL FURNITURE — Enterprise JavaScript
   Features: Hero Slider, Cart Sidebar, Wishlist, Product Grid,
   Scroll Animations, Countdown, Filter Tabs, Counters, Toast,
   Dark Mode, Search, Review Carousel, Contact Form, Scroll Progress
   ============================================================ */

'use strict';

// ============================================================
// STATE
// ============================================================
let cart      = JSON.parse(localStorage.getItem('rf_cart'))     || [];
let wishlist  = JSON.parse(localStorage.getItem('rf_wishlist')) || [];
let totalPrice = parseFloat(localStorage.getItem('rf_total'))   || 0;

// ============================================================
// PRODUCTS DATA
// ============================================================
const PRODUCTS = [
    { id: 1,  name: 'Grey Fabric Sofa',              category: 'sofa',  price: 65000, originalPrice: null, image: 'images/p1.png',  description: 'Modern and cozy fabric sofa for stylish living rooms.', isNew: true,  badge: 'new'  },
    { id: 2,  name: 'Royal Blue Velvet Armchair',    category: 'chair', price: 42000, originalPrice: null, image: 'images/p2.png',  description: 'Luxurious velvet armchair that adds elegance to any space.', isNew: false, badge: null  },
    { id: 3,  name: 'Premium Brown Leather Loveseat',category: 'sofa',  price: 78000, originalPrice: null, image: 'images/p3.png',  description: 'Elegant leather loveseat for a classic, timeless touch.', isNew: false, badge: null  },
    { id: 4,  name: 'Gold Accent Lounge Chair',      category: 'chair', price: 50000, originalPrice: null, image: 'images/p4.png',  description: 'Stylish gold-accented chair for a luxurious interior.', isNew: true,  badge: 'new'  },
    { id: 5,  name: 'Silver Metallic Armchair',      category: 'chair', price: 48000, originalPrice: null, image: 'images/p5.png',  description: 'Modern sleek silver chair to elevate your decor.', isNew: false, badge: null  },
    { id: 6,  name: 'Luxury White Sectional Sofa',   category: 'sofa',  price: 95000, originalPrice: null, image: 'images/p6.png',  description: 'Spacious and elegant white sofa for ultimate comfort.', isNew: false, badge: null  },
    { id: 7,  name: 'Beautiful White Sofa with Pillow', category: 'sofa', price: 40000, originalPrice: 80000, image: 'images/p9.png', description: 'Elegant white sofa with soft pillows for extra relaxation.', isNew: false, badge: 'sale' },
    { id: 8,  name: 'Special Wooden Shoe Case',      category: 'other', price: 15000, originalPrice: 30000, image: 'images/p10.png', description: 'Stylish wooden shoe rack to keep footwear organized.', isNew: false, badge: 'sale' },
    { id: 9,  name: 'Circular Wooden Chair with Pillow', category: 'chair', price: 22500, originalPrice: 45000, image: 'images/p11.png', description: 'Unique circular wooden chair with a comfortable pillow.', isNew: false, badge: 'sale' },
    { id: 10, name: 'Contemporary Yellow Accent Chair', category: 'chair', price: 41000, originalPrice: null, image: 'images/p8.png', description: 'Bright modern yellow chair for a pop of colour.', isNew: true, badge: 'new' },
    { id: 11, name: 'Plush Purple Lounge Chair',     category: 'chair', price: 19000, originalPrice: 38000, image: 'images/p7.png',  description: 'Elegant stylish purple lounge chair, perfect for relaxation.', isNew: false, badge: 'sale' },
];

const RATING_MAP = { 1: '★★★★★', 2: '★★★★★', 3: '★★★★½', 4: '★★★★★', 5: '★★★★½', 6: '★★★★★', 7: '★★★★★', 8: '★★★★½', 9: '★★★★★', 10: '★★★★★', 11: '★★★★½' };
const RATING_COUNT = { 1: 128, 2: 94, 3: 73, 4: 112, 5: 87, 6: 201, 7: 155, 8: 62, 9: 89, 10: 103, 11: 76 };

// ============================================================
// UTILITIES
// ============================================================
function formatINR(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function saveCart() {
    localStorage.setItem('rf_cart', JSON.stringify(cart));
    localStorage.setItem('rf_total', totalPrice);
}

function saveWishlist() {
    localStorage.setItem('rf_wishlist', JSON.stringify(wishlist));
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
let toastTimer;
function showToast(message, isError = false) {
    const toast = document.getElementById('rf-toast');
    if (!toast) return;

    const icon = toast.querySelector('.toast-icon');
    document.getElementById('toast-message').textContent = message;

    toast.classList.remove('error');
    if (isError) {
        toast.classList.add('error');
        if (icon) { icon.classList.remove('bx-check-circle'); icon.classList.add('bx-error-circle'); }
    } else {
        if (icon) { icon.classList.remove('bx-error-circle'); icon.classList.add('bx-check-circle'); }
    }

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
function initScrollProgress() {
    const bar = document.getElementById('scroll-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (window.scrollY / docH * 100) + '%';
    }, { passive: true });
}

// ============================================================
// DARK MODE
// ============================================================
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const saved  = localStorage.getItem('rf_theme') || 'light';
    applyTheme(saved);

    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next    = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('rf_theme', next);
        });
    }
}
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
    }
}

// ============================================================
// HEADER SCROLL BEHAVIOUR (hide announcement on scroll)
// ============================================================
function initHeader() {
    const header = document.getElementById('site-header');
    const annoBar = document.getElementById('announcement-bar');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            header.classList.add('scrolled');
            if (annoBar) annoBar.style.display = 'none';
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });
}

// ============================================================
// MOBILE NAVIGATION
// ============================================================
function initMobileNav() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav    = document.getElementById('header-nav');
    if (!toggle || !nav) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const openNav  = () => { nav.classList.add('mobile-open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeNav = () => { nav.classList.remove('mobile-open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };

    toggle.addEventListener('click', () => nav.classList.contains('mobile-open') ? closeNav() : openNav());
    overlay.addEventListener('click', closeNav);

    // Close on nav link click
    nav.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeNav));
}

// ============================================================
// SEARCH
// ============================================================
function initSearch() {
    const toggle   = document.getElementById('search-toggle');
    const dropdown = document.getElementById('search-dropdown');
    const input    = document.getElementById('search-input');
    if (!toggle || !dropdown) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open') && input) input.focus();
    });
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== toggle) {
            dropdown.classList.remove('open');
        }
    });

    // Product page search
    const pageInput = document.getElementById('page-search-input');
    if (pageInput) {
        pageInput.addEventListener('input', () => filterProducts('search', pageInput.value));
    }
}

// ============================================================
// HERO SLIDER
// ============================================================
function initHeroSlider() {
    const slides     = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn    = document.getElementById('hero-prev');
    const nextBtn    = document.getElementById('hero-next');
    if (!slides.length) return;

    let current = 0;
    let autoplay;

    function goTo(index) {
        slides[current].classList.remove('active');
        indicators[current]?.classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        indicators[current]?.classList.add('active');
    }

    function startAutoplay() {
        autoplay = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAutoplay() { clearInterval(autoplay); }

    prevBtn?.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
    nextBtn?.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });
    indicators.forEach(ind => {
        ind.addEventListener('click', () => { stopAutoplay(); goTo(+ind.dataset.index); startAutoplay(); });
    });

    startAutoplay();
}

// ============================================================
// CART SIDEBAR
// ============================================================
function openCart() {
    document.getElementById('cart-sidebar')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCart();
}
function closeCart() {
    document.getElementById('cart-sidebar')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
}

function initCart() {
    document.getElementById('cart-icon')?.addEventListener('click', openCart);
    document.getElementById('cart-close')?.addEventListener('click', closeCart);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
    document.getElementById('checkout-btn')?.addEventListener('click', checkout);
    updateCartBadge();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const totalEl = document.getElementById('total-price');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-empty"><i class='bx bx-shopping-bag'></i><p>Your cart is empty</p><a href="product.html" class="btn-primary-solid" style="margin-top:1rem;" onclick="closeCart()">Browse Collection</a></div>`;
        if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
        container.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <img class="cart-item-img" src="${item.image || 'images/p1.png'}" alt="${item.name}" onerror="this.src='images/p1.png'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatINR(item.price)}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${idx})"><i class='bx bx-trash'></i></button>
            </div>
        `).join('');
        if (checkoutBtn) checkoutBtn.style.display = 'block';
    }

    if (totalEl) totalEl.textContent = totalPrice.toLocaleString('en-IN');
}

function addToCart(name, price, image) {
    // Support both old-style calls (name, price) and new (from product data)
    cart.push({ name, price: Number(price), image: image || '' });
    totalPrice += Number(price);
    saveCart();
    updateCartBadge();
    showToast(`${name} added to your cart.`);
    // Pulse cart icon
    const cartIcon = document.getElementById('cart-icon');
    cartIcon?.classList.add('pulse');
    setTimeout(() => cartIcon?.classList.remove('pulse'), 400);
}

window.removeFromCart = function(index) {
    if (cart[index]) {
        totalPrice -= cart[index].price;
        totalPrice = Math.max(0, totalPrice);
        cart.splice(index, 1);
        saveCart();
        renderCart();
        updateCartBadge();
    }
};

function updateCartBadge() {
    const badges = document.querySelectorAll('#cart-count');
    badges.forEach(b => b.textContent = cart.length);
}

// Keep old global references for product.html compatibility
window.addToCart = addToCart;

// ============================================================
// WISHLIST
// ============================================================
function initWishlist() {
    document.getElementById('wishlist-icon')?.addEventListener('click', openWishlistModal);
    updateWishlistBadge();
}

function toggleWishlist(productId, name, price, image) {
    const idx = wishlist.findIndex(w => w.id === productId);
    if (idx > -1) {
        wishlist.splice(idx, 1);
        saveWishlist();
        updateWishlistBadge();
        showToast(`${name} removed from wishlist.`);
        return false;
    } else {
        wishlist.push({ id: productId, name, price, image });
        saveWishlist();
        updateWishlistBadge();
        showToast(`${name} added to your wishlist. ♥`);
        return true;
    }
}

function updateWishlistBadge() {
    const badges = document.querySelectorAll('#wishlist-count');
    badges.forEach(b => b.textContent = wishlist.length);
}

function openWishlistModal() {
    const container = document.getElementById('wishlist-items');
    const badge = document.getElementById('wishlist-badge');
    if (!container) return;

    if (badge) badge.textContent = wishlist.length ? `(${wishlist.length})` : '';

    if (wishlist.length === 0) {
        container.innerHTML = `<div class="cart-empty"><i class='bx bx-heart'></i><p>Your wishlist is empty</p></div>`;
    } else {
        container.innerHTML = wishlist.map((item, idx) => `
            <div class="cart-item">
                <img class="cart-item-img" src="${item.image || ''}" alt="${item.name}" onerror="this.src='images/p1.png'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatINR(item.price)}</div>
                </div>
                <button class="btn-primary-solid" style="padding:8px 14px; font-size:0.72rem; white-space:nowrap;" onclick="moveWishlistToCart(${idx})">Add to Cart</button>
            </div>
        `).join('');
    }

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('wishlistModal'));
    modal.show();
}

window.moveWishlistToCart = function(idx) {
    const item = wishlist[idx];
    if (item) {
        addToCart(item.name, item.price, item.image);
        wishlist.splice(idx, 1);
        saveWishlist();
        updateWishlistBadge();
        openWishlistModal();
    }
};

// ============================================================
// CHECKOUT
// ============================================================
function checkout() {
    if (!cart.length) { showToast('Your cart is empty!', true); return; }

    closeCart();
    setTimeout(() => {
        showToast('🎉 Order placed successfully! Thank you.');
        cart = [];
        totalPrice = 0;
        saveCart();
        updateCartBadge();
        renderCart();
    }, 500);
}

// ============================================================
// PRODUCT GRID (index.html)
// ============================================================
let currentFilter = 'all';

function initProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    renderProductGrid(PRODUCTS.slice(0, 6));

    // Filter Tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            const filtered = currentFilter === 'all'
                ? PRODUCTS.slice(0, 8)
                : currentFilter === 'sale'
                    ? PRODUCTS.filter(p => p.badge === 'sale')
                    : PRODUCTS.filter(p => p.category === currentFilter);
            renderProductGrid(filtered);
        });
    });
}

function renderProductGrid(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    if (!products.length) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:3rem;">No products found.</p>';
        return;
    }

    grid.innerHTML = products.map(p => {
        const savings = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
        const inWishlist = wishlist.some(w => w.id === p.id);
        return `
        <article class="product-card reveal" data-id="${p.id}" data-category="${p.category}">
            <div class="product-card-media">
                <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='images/p1.png'">
                ${p.badge === 'sale' ? `<span class="product-badge badge-sale">−${savings}%</span>` : ''}
                ${p.badge === 'new'  ? `<span class="product-badge badge-new">New</span>` : ''}
                <div class="product-quick-actions">
                    <button class="quick-action-btn quick-add-cart" onclick="addToCart('${p.name}', ${p.price}, '${p.image}')">
                        <i class='bx bx-cart-add'></i> Add to Cart
                    </button>
                    <button class="quick-action-btn quick-wishlist ${inWishlist ? 'wishlisted' : ''}" 
                            id="wish-${p.id}"
                            onclick="handleWishlistClick(${p.id}, '${p.name}', ${p.price}, '${p.image}', this)">
                        <i class='bx ${inWishlist ? "bxs-heart" : "bx-heart"}'></i>
                    </button>
                </div>
            </div>
            <div class="product-card-body">
                <div class="product-card-category">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</div>
                <div class="product-rating">
                    <span class="stars">${RATING_MAP[p.id] || '★★★★★'}</span>
                    <span class="rating-count">(${RATING_COUNT[p.id] || 80})</span>
                </div>
                <h3 class="product-card-name">${p.name}</h3>
                <p class="product-card-desc">${p.description}</p>
                <div class="product-card-pricing">
                    <span class="price-current">${formatINR(p.price)}</span>
                    ${p.originalPrice ? `<span class="price-original">${formatINR(p.originalPrice)}</span><span class="price-savings">${savings}% off</span>` : ''}
                </div>
            </div>
        </article>`;
    }).join('');

    // Trigger reveal for new cards
    setTimeout(observeReveal, 50);
}

window.handleWishlistClick = function(id, name, price, image, btn) {
    const added = toggleWishlist(id, name, price, image);
    const icon = btn.querySelector('i');
    if (added) {
        btn.classList.add('wishlisted');
        if (icon) { icon.classList.remove('bx-heart'); icon.classList.add('bxs-heart'); }
    } else {
        btn.classList.remove('wishlisted');
        if (icon) { icon.classList.remove('bxs-heart'); icon.classList.add('bx-heart'); }
    }
};

// ============================================================
// PRODUCT PAGE (product.html) — Full product grid
// ============================================================
function initProductPage() {
    const grid = document.getElementById('product-page-grid');
    if (!grid) return;

    renderProductPageGrid(PRODUCTS);

    // Filter tabs on product page
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const f = tab.dataset.filter;
            const filtered = f === 'all' ? PRODUCTS : f === 'sale' ? PRODUCTS.filter(p => p.badge === 'sale') : PRODUCTS.filter(p => p.category === f);
            renderProductPageGrid(filtered);
        });
    });
}

function renderProductPageGrid(products) {
    const grid = document.getElementById('product-page-grid');
    if (!grid) return;

    grid.className = 'product-grid';
    grid.innerHTML = products.map(p => {
        const savings = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
        const inWishlist = wishlist.some(w => w.id === p.id);
        return `
        <article class="product-card reveal">
            <div class="product-card-media">
                <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='images/p1.png'">
                ${p.badge === 'sale' ? `<span class="product-badge badge-sale">−${savings}%</span>` : ''}
                ${p.badge === 'new'  ? `<span class="product-badge badge-new">New</span>` : ''}
                <div class="product-quick-actions">
                    <button class="quick-action-btn quick-add-cart" onclick="addToCart('${p.name}', ${p.price}, '${p.image}')">
                        <i class='bx bx-cart-add'></i> Add to Cart
                    </button>
                    <button class="quick-action-btn quick-wishlist ${inWishlist ? 'wishlisted' : ''}"
                            onclick="handleWishlistClick(${p.id}, '${p.name}', ${p.price}, '${p.image}', this)">
                        <i class='bx ${inWishlist ? "bxs-heart" : "bx-heart"}'></i>
                    </button>
                </div>
            </div>
            <div class="product-card-body">
                <div class="product-card-category">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</div>
                <div class="product-rating">
                    <span class="stars">${RATING_MAP[p.id] || '★★★★★'}</span>
                    <span class="rating-count">(${RATING_COUNT[p.id] || 80})</span>
                </div>
                <h3 class="product-card-name">${p.name}</h3>
                <p class="product-card-desc">${p.description}</p>
                <div class="product-card-pricing">
                    <span class="price-current">${formatINR(p.price)}</span>
                    ${p.originalPrice ? `<span class="price-original">${formatINR(p.originalPrice)}</span><span class="price-savings">${savings}% off</span>` : ''}
                </div>
            </div>
        </article>`;
    }).join('');
    setTimeout(observeReveal, 50);
}

// Product page search filter
window.filterProducts = function(type, query) {
    const q = query.toLowerCase().trim();
    const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    renderProductPageGrid(filtered);
};

// ============================================================
// SCROLL REVEAL OBSERVER
// ============================================================
function observeReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function initCountdown() {
    const hoursEl = document.getElementById('cd-hours');
    const minsEl  = document.getElementById('cd-mins');
    const secsEl  = document.getElementById('cd-secs');
    if (!hoursEl) return;

    // Count down 24 hours from load
    let deadline = localStorage.getItem('rf_countdown_deadline');
    if (!deadline) {
        deadline = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('rf_countdown_deadline', deadline);
    }

    function tick() {
        const diff = Math.max(0, +deadline - Date.now());
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        hoursEl.textContent = String(h).padStart(2, '0');
        minsEl.textContent  = String(m).padStart(2, '0');
        secsEl.textContent  = String(s).padStart(2, '0');
        if (diff > 0) setTimeout(tick, 1000);
    }
    tick();
}

// ============================================================
// REVIEW CAROUSEL
// ============================================================
function initReviewCarousel() {
    const track = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('review-prev');
    const nextBtn = document.getElementById('review-next');
    if (!track) return;

    let current = 0;
    const cards = track.querySelectorAll('.review-card');
    const cardWidth = () => cards[0].offsetWidth + 24; // gap

    function goTo(index) {
        current = Math.max(0, Math.min(index, cards.length - 1));
        track.style.transform = `translateX(-${current * cardWidth()}px)`;
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    // Auto-scroll reviews
    setInterval(() => {
        if (current >= cards.length - 1) goTo(0);
        else goTo(current + 1);
    }, 6000);
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('c-name')?.value.trim();
        const email = document.getElementById('c-email')?.value.trim();
        const message = document.getElementById('c-message')?.value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in all required fields.', true);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', true);
            return;
        }

        // Simulate submission
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            form.reset();
            showToast(`Thank you, ${name}! We'll be in touch soon. 🎉`);
        }, 1500);
    });
}

// ============================================================
// BACK TO TOP
// ============================================================
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) btn.classList.add('visible');
        else btn.classList.remove('visible');
    }, { passive: true });

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// ACTIVE NAV LINK ON SCROLL
// ============================================================
function initActiveNav() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.header-nav .nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.header-nav a[href="#${entry.target.id}"]`);
                active?.classList.add('active');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => observer.observe(s));
}

// ============================================================
// LEGACY SUPPORT (old inline onclick calls from product.html)
// ============================================================
// window.addToCart is already set above

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initTheme();
    initHeader();
    initMobileNav();
    initSearch();
    initHeroSlider();
    initCart();
    initWishlist();
    initProductGrid();
    initProductPage();
    initCounters();
    initCountdown();
    initReviewCarousel();
    initContactForm();
    initBackToTop();
    initActiveNav();
    observeReveal();

    // Handle search-input visibility toggle (legacy)
    const legacySearch = document.getElementById('search-input');
    if (legacySearch && !document.getElementById('search-dropdown')) {
        legacySearch.addEventListener('input', function() {
            window.filterProducts && window.filterProducts('search', this.value);
        });
    }
});