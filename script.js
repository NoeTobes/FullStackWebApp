// Global variables
let currentUser = null;
const STORAGE_KEY = 'ipt_demo_v1';

// Database structure
window.db = {
    accounts: [],
    departments: [],
    employees: [],
    requests: []
};

// Route configuration
const routes = {
    '/': 'home-page',
    '/register': 'register-page',
    '/verify-email': 'verify-email-page',
    '/login': 'login-page',
    '/profile': 'profile-page',
    '/employees': 'employees-page',
    '/departments': 'departments-page',
    '/accounts': 'accounts-page',
    '/requests': 'requests-page'
};

// Protected routes (require authentication)
const protectedRoutes = ['/profile', '/requests'];

// Admin routes (require admin role)
const adminRoutes = ['/employees', '/departments', '/accounts'];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    
    // Set initial hash if empty
    if (!window.location.hash || window.location.hash === '#') {
        window.location.hash = '#/';
    }
    
    // Load data from localStorage
    loadFromStorage();
    
    // Add hash change listener
    window.addEventListener('hashchange', handleRouting);
    
    // Initial routing
    handleRouting();
    
    // Setup form listeners
    setupFormListeners();
    
    // Setup navigation links
    setupNavigationLinks();
    
    // Check for existing session
    checkExistingSession();
});

// Load data from localStorage
function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
        try {
            window.db = JSON.parse(stored);
            console.log('Data loaded from storage');
        } catch (e) {
            console.error('Failed to parse stored data, seeding with defaults');
            seedDefaultData();
        }
    } else {
        seedDefaultData();
    }
}

// Seed default data
function seedDefaultData() {
    window.db = {
        accounts: [
            {
                id: 1,
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                password: 'Password123!',
                role: 'admin',
                verified: true
            }
        ],
        departments: [
            {
                id: 1,
                name: 'Engineering',
                description: 'Software development and engineering'
            },
            {
                id: 2,
                name: 'HR',
                description: 'Human resources'
            }
        ],
        employees: [],
        requests: []
    };
    
    saveToStorage();
    console.log('Default data seeded');
}

// Save to localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.db));
    console.log('Data saved to storage');
}

// Navigation function
function navigateTo(path) {
    window.location.hash = '#' + path;
}

// Handle routing logic
function handleRouting() {
    // Get the current hash path (remove the '#' character)
    let hash = window.location.hash.slice(1) || '/';
    
    // Handle empty hash or just '#'
    if (hash === '') {
        hash = '/';
    }
    
    console.log('Navigating to:', hash);
    
    // Get the route path (remove any query parameters)
    const path = hash.split('?')[0];
    
    // Check if route exists, otherwise default to home
    const pageId = routes[path] || 'home-page';
    
    // Check authentication for protected routes
    if (protectedRoutes.includes(path)) {
        if (!isAuthenticated()) {
            console.log('Unauthorized access to protected route, redirecting to login');
            showNotification('Please login to access this page', 'warning');
            navigateTo('/login');
            return;
        }
    }
    
    // Check admin routes
    if (adminRoutes.includes(path)) {
        if (!isAdmin()) {
            console.log('Unauthorized access to admin route, redirecting to home');
            showNotification('Access denied. Admin privileges required.', 'danger');
            navigateTo('/');
            return;
        }
    }
    
    // Update active page
    showPage(pageId);
    
    // Update navigation active state
    updateActiveNavLink(path);
    
    // Update page title
    updatePageTitle(pageId);
    
    // Trigger page-specific rendering
    renderPageContent(pageId);
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Check if user is admin
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Show a specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.error('Page not found:', pageId);
        // Fallback to home page
        const homePage = document.getElementById('home-page');
        if (homePage) {
            homePage.classList.add('active');
        }
    }
}

// Update active navigation link
function updateActiveNavLink(path) {
    // Remove active class from all nav links
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current link
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + path || href === '#/' + path) {
            link.classList.add('active');
        }
    });
}

// Update page title
function updatePageTitle(pageId) {
    const titles = {
        'home-page': 'Home',
        'register-page': 'Register',
        'verify-email-page': 'Verify Email',
        'login-page': 'Login',
        'profile-page': 'Profile',
        'employees-page': 'Employees',
        'departments-page': 'Departments',
        'accounts-page': 'Accounts',
        'requests-page': 'My Requests'
    };
    
    const pageName = titles[pageId] || 'Full-Stack App';
    document.title = `${pageName} - Full-Stack App (Student Build)`;
}

// Render page-specific content
function renderPageContent(pageId) {
    switch (pageId) {
        case 'profile-page':
            renderProfilePage();
            break;
        case 'employees-page':
            renderEmployeesPage();
            break;
        case 'departments-page':
            renderDepartmentsPage();
            break;
        case 'accounts-page':
            renderAccountsPage();
            break;
        case 'requests-page':
            renderRequestsPage();
            break;
        case 'verify-email-page':
            renderVerifyEmailPage();
            break;
    }
}

// Page-specific render functions
function renderProfilePage() {
    if (currentUser) {
        document.getElementById('profile-name').textContent = 
            `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-role').textContent = 
            currentUser.role === 'admin' ? 'Administrator' : 'User';
    }
}

function renderEmployeesPage() {
    const tbody = document.getElementById('employees-table-body');
    if (window.db.employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No employees found</td></tr>';
    } else {
        // Employee rendering will be implemented in Phase 6
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Employee data coming in Phase 6</td></tr>';
    }
}

function renderDepartmentsPage() {
    const tbody = document.getElementById('departments-table-body');
    if (window.db.departments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No departments found</td></tr>';
    } else {
        let html = '';
        window.db.departments.forEach(dept => {
            html += `
                <tr>
                    <td>${dept.name}</td>
                    <td>${dept.description}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="alert('Edit department coming in Phase 6')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="alert('Delete department coming in Phase 6')">Delete</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
}

function renderAccountsPage() {
    const tbody = document.getElementById('accounts-table-body');
    if (window.db.accounts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No accounts found</td></tr>';
    } else {
        let html = '';
        window.db.accounts.forEach(account => {
            html += `
                <tr>
                    <td>${account.firstName} ${account.lastName}</td>
                    <td>${account.email}</td>
                    <td><span class="badge bg-${account.role === 'admin' ? 'danger' : 'info'}">${account.role}</span></td>
                    <td><span class="badge bg-${account.verified ? 'success' : 'warning'}">${account.verified ? 'Verified' : 'Pending'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="alert('Edit account coming in Phase 6')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="alert('Delete account coming in Phase 6')">Delete</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
}

function renderRequestsPage() {
    const tbody = document.getElementById('requests-table-body');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Requests coming in Phase 7</td></tr>';
}

function renderVerifyEmailPage() {
    const unverifiedEmail = localStorage.getItem('unverified_email');
    if (unverifiedEmail) {
        document.getElementById('unverified-email').textContent = unverifiedEmail;
    } else {
        document.getElementById('verify-email-message').innerHTML = 
            'No pending verification found. Please <a href="#/register">register</a> first.';
    }
}

// Setup navigation links to use client-side routing
function setupNavigationLinks() {
    document.addEventListener('click', function(e) {
        // Check if clicked element is a navigation link
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Handle internal navigation links (starting with #/)
        if (href && href.startsWith('#/')) {
            e.preventDefault();
            navigateTo(href.slice(1)); // Remove the '#' and navigate
        }
        
        // Handle logout link
        if (link.id === 'logout-btn') {
            e.preventDefault();
            handleLogout();
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type} border-0`;
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Setup form listeners
function setupFormListeners() {
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Simulate verify button
    const verifyBtn = document.getElementById('simulate-verify-btn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function() {
            simulateVerification();
        });
    }
    
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            showNotification('Edit profile functionality coming in Phase 5!', 'info');
        });
    }
    
    // Admin action buttons
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', function() {
            showNotification('Add employee functionality coming in Phase 6!', 'info');
        });
    }
    
    const addDepartmentBtn = document.getElementById('add-department-btn');
    if (addDepartmentBtn) {
        addDepartmentBtn.addEventListener('click', function() {
            showNotification('Add department functionality coming in Phase 6!', 'info');
        });
    }
    
    const addAccountBtn = document.getElementById('add-account-btn');
    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', function() {
            showNotification('Add account functionality coming in Phase 6!', 'info');
        });
    }
    
    const newRequestBtn = document.getElementById('new-request-btn');
    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', function() {
            showNotification('New request functionality coming in Phase 7!', 'info');
        });
    }
}

// Handle registration
function handleRegister() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
        showNotification('Please fill in all fields', 'warning');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'warning');
        return;
    }
    
    // Check if email already exists
    const existingUser = window.db.accounts.find(acc => acc.email === email);
    
    if (existingUser) {
        showNotification('Email already registered!', 'danger');
        return;
    }
    
    // Create new account
    const newAccount = {
        id: window.db.accounts.length + 1,
        firstName,
        lastName,
        email,
        password,
        role: 'user',
        verified: false
    };
    
    window.db.accounts.push(newAccount);
    saveToStorage();
    
    // Store email for verification
    localStorage.setItem('unverified_email', email);
    
    showNotification('Registration successful! Please verify your email.', 'success');
    
    // Navigate to verify email page
    navigateTo('/verify-email');
    
    console.log('Registration successful:', email);
}

// Simulate email verification
function simulateVerification() {
    const unverifiedEmail = localStorage.getItem('unverified_email');
    
    if (!unverifiedEmail) {
        showNotification('No unverified email found!', 'warning');
        return;
    }
    
    const account = window.db.accounts.find(acc => acc.email === unverifiedEmail);
    
    if (account) {
        account.verified = true;
        saveToStorage();
        localStorage.removeItem('unverified_email');
        showNotification('Email verified successfully! You can now login.', 'success');
        navigateTo('/login');
    } else {
        showNotification('Account not found!', 'danger');
    }
}

// Handle login
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'warning');
        return;
    }
    
    const account = window.db.accounts.find(acc => 
        acc.email === email && 
        acc.password === password && 
        acc.verified === true
    );
    
    if (account) {
        // Set auth state
        setAuthState(true, account);
        
        // Save to localStorage
        localStorage.setItem('auth_token', email);
        
        showNotification('Login successful!', 'success');
        
        // Navigate to profile
        navigateTo('/profile');
        
        console.log('Login successful:', email);
    } else {
        showNotification('Invalid credentials or unverified account!', 'danger');
    }
}

// Handle logout
function handleLogout() {
    // Clear auth state
    setAuthState(false, null);
    
    // Remove from localStorage
    localStorage.removeItem('auth_token');
    
    showNotification('Logged out successfully', 'info');
    
    // Navigate to home
    navigateTo('/');
    
    console.log('Logout successful');
}

// Set authentication state
function setAuthState(isAuth, user) {
    currentUser = user;
    
    const body = document.body;
    
    if (isAuth && user) {
        body.classList.remove('not-authenticated');
        body.classList.add('authenticated');
        
        // Update username display
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = `${user.firstName} ${user.lastName}`;
        }
        
        // Check if admin
        if (user.role === 'admin') {
            body.classList.add('is-admin');
        } else {
            body.classList.remove('is-admin');
        }
        
        // Update profile page if it's visible
        if (document.getElementById('profile-page').classList.contains('active')) {
            renderProfilePage();
        }
    } else {
        body.classList.add('not-authenticated');
        body.classList.remove('authenticated', 'is-admin');
        
        // Clear username display
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = 'User';
        }
    }
}

// Check for existing session on load
function checkExistingSession() {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
        const account = window.db.accounts.find(acc => acc.email === token);
        if (account && account.verified) {
            setAuthState(true, account);
            console.log('Session restored for:', account.email);
        } else {
            // Clear invalid token
            localStorage.removeItem('auth_token');
        }
    }
}

// Test function to demonstrate routing
function testRouting() {
    console.log('Testing routing functionality:');
    console.log('- Try typing #/register in the URL → Register form should appear');
    console.log('- Try typing #/employees without logging in → Should redirect to login');
    console.log('- Try typing #/employees as non-admin → Should redirect to home');
    console.log('- Try typing #/invalid → Should show home page');
}

// Call test function in console for demonstration
window.testRouting = testRouting;