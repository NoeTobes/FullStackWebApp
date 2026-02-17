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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    
    // Set initial hash if empty
    if (!window.location.hash) {
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
function navigateTo(hash) {
    window.location.hash = hash;
}

// Handle routing logic
function handleRouting() {
    const hash = window.location.hash || '#/';
    console.log('Navigating to:', hash);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the appropriate page
    let pageId = 'home-page'; // default
    
    if (hash.startsWith('#/register')) {
        pageId = 'register-page';
    } else if (hash.startsWith('#/verify-email')) {
        pageId = 'verify-email-page';
    } else if (hash.startsWith('#/login')) {
        pageId = 'login-page';
    } else if (hash.startsWith('#/profile')) {
        pageId = 'profile-page';
    } else if (hash.startsWith('#/employees')) {
        pageId = 'employees-page';
    } else if (hash.startsWith('#/departments')) {
        pageId = 'departments-page';
    } else if (hash.startsWith('#/accounts')) {
        pageId = 'accounts-page';
    } else if (hash.startsWith('#/requests')) {
        pageId = 'requests-page';
    }
    
    // Check authentication for protected routes
    const protectedRoutes = ['#/profile', '#/requests'];
    const adminRoutes = ['#/employees', '#/departments', '#/accounts'];
    
    if (protectedRoutes.includes(hash) && !currentUser) {
        console.log('Unauthorized access to protected route, redirecting to login');
        pageId = 'login-page';
        window.location.hash = '#/login';
    } else if (adminRoutes.includes(hash) && (!currentUser || currentUser.role !== 'admin')) {
        console.log('Unauthorized access to admin route, redirecting to home');
        pageId = 'home-page';
        window.location.hash = '#/';
    }
    
    // Show the page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update page title
    updatePageTitle(pageId);
}

// Update page title based on active page
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
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            alert('Edit profile functionality coming soon!');
        });
    }
    
    // Admin action buttons (placeholder functionality)
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', function() {
            alert('Add employee functionality coming soon!');
        });
    }
    
    const addDepartmentBtn = document.getElementById('add-department-btn');
    if (addDepartmentBtn) {
        addDepartmentBtn.addEventListener('click', function() {
            alert('Add department functionality coming soon!');
        });
    }
    
    const addAccountBtn = document.getElementById('add-account-btn');
    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', function() {
            alert('Add account functionality coming soon!');
        });
    }
    
    const newRequestBtn = document.getElementById('new-request-btn');
    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', function() {
            alert('New request functionality coming soon!');
        });
    }
}

// Handle registration
function handleRegister() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Check if email already exists
    const existingUser = window.db.accounts.find(acc => acc.email === email);
    
    if (existingUser) {
        alert('Email already registered!');
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
    
    // Update verify email message
    document.getElementById('unverified-email').textContent = email;
    
    // Navigate to verify email page
    navigateTo('#/verify-email');
    
    console.log('Registration successful:', email);
}

// Simulate email verification
function simulateVerification() {
    const unverifiedEmail = localStorage.getItem('unverified_email');
    
    if (!unverifiedEmail) {
        alert('No unverified email found!');
        return;
    }
    
    const account = window.db.accounts.find(acc => acc.email === unverifiedEmail);
    
    if (account) {
        account.verified = true;
        saveToStorage();
        localStorage.removeItem('unverified_email');
        alert('Email verified successfully! You can now login.');
        navigateTo('#/login');
    } else {
        alert('Account not found!');
    }
}

// Handle login
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
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
        
        // Navigate to profile
        navigateTo('#/profile');
        
        console.log('Login successful:', email);
    } else {
        alert('Invalid credentials or unverified account!');
    }
}

// Handle logout
function handleLogout() {
    // Clear auth state
    setAuthState(false, null);
    
    // Remove from localStorage
    localStorage.removeItem('auth_token');
    
    // Navigate to home
    navigateTo('#/');
    
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
        
        // Update profile page
        updateProfilePage(user);
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

// Update profile page with user data
function updateProfilePage(user) {
    if (user) {
        document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-role').textContent = user.role === 'admin' ? 'Administrator' : 'User';
    }
}

// Check for existing session on load
function checkExistingSession() {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
        const account = window.db.accounts.find(acc => acc.email === token);
        if (account) {
            setAuthState(true, account);
        }
    }
}

// Call this after loading data
setTimeout(checkExistingSession, 100);