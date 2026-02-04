// InmoDescribe - Auth System
const AUTH_KEY = 'InmoDescribe_user';
const API_KEY_STORAGE = 'InmoDescribe_api_key';

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) !== null;
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
}

// Register user
function registerUser(name, email, password) {
    const user = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // In production, hash this!
        credits: 3,
        plan: 'free',
        createdAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
}

// Login user
function loginUser(email, password) {
    const userData = localStorage.getItem(AUTH_KEY);
    if (!userData) return null;

    const user = JSON.parse(userData);
    if (user.email === email && user.password === password) {
        return user;
    }
    return null;
}

// Logout
function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
}

// Update user credits
function updateCredits(newCredits) {
    const user = getCurrentUser();
    if (user) {
        user.credits = newCredits;
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
}

// Get API Key
function getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE);
}

// Set API Key
function setApiKey(key) {
    localStorage.setItem(API_KEY_STORAGE, key);
}

// Show toast notification
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// Init auth on dashboard
function initDashboardAuth() {
    const user = getCurrentUser();

    // Update UI with user info
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const creditsCount = document.getElementById('creditsCount');
    const creditsDisplay = document.getElementById('creditsDisplay');

    if (user) {
        if (userAvatar) userAvatar.textContent = user.name.charAt(0).toUpperCase();
        if (userName) userName.textContent = user.name;
        if (creditsCount) creditsCount.textContent = user.credits;
        if (creditsDisplay) creditsDisplay.textContent = `${user.credits} créditos restantes`;
    } else {
        // Create a default user for demo purposes
        const defaultUser = registerUser('Usuario Demo', 'demo@InmoDescribe.cl', 'demo123');
        if (userAvatar) userAvatar.textContent = 'U';
        if (userName) userName.textContent = defaultUser.name;
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Sidebar navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            if (page === 'generator') {
                document.querySelector('.generator-card').style.display = 'block';
                document.querySelector('.stats-grid').style.display = 'grid';
                document.querySelector('.dashboard-header').style.display = 'block';
                document.getElementById('historySection').style.display = 'none';
            } else if (page === 'history') {
                document.querySelector('.generator-card').style.display = 'none';
                document.querySelector('.stats-grid').style.display = 'none';
                document.querySelector('.dashboard-header').style.display = 'none';
                document.getElementById('historySection').style.display = 'block';
                renderHistory();
            }
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();

    // If on dashboard, init dashboard auth
    if (document.querySelector('.dashboard-layout')) {
        initDashboardAuth();
    }
});
