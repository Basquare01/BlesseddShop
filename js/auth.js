// Authentication Functions

// Mock user storage
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize admin account on first load
function initializeAdmin() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.find(u => u.email === 'admin@blessedshop.com');
    
    if (!adminExists) {
        const adminUser = {
            uid: 'admin-001',
            email: 'admin@blessedshop.com',
            displayName: 'Admin',
            password: btoa('admin123'), // Password: admin123
            createdAt: new Date().toISOString(),
            isAdmin: true,
            metadata: {
                creationTime: new Date().toISOString()
            }
        };
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Admin account initialized');
    }
}

// Call initialization on page load
initializeAdmin();

// Get current logged-in user
function getCurrentUser() {
    return currentUser;
}

// Register new user
async function registerUser(email, password, name) {
    try {
        // Validate inputs
        if (!email || !password || !name) {
            throw new Error('Please fill in all fields');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        if (existingUsers.find(u => u.email === email)) {
            throw new Error('Email already registered');
        }

        // Create new user
        const newUser = {
            uid: Math.random().toString(36).substr(2, 9),
            email: email,
            displayName: name,
            password: btoa(password), // Simple encoding (not secure for production)
            createdAt: new Date().toISOString(),
            metadata: {
                creationTime: new Date().toISOString()
            }
        };

        // Store user
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // Auto-login
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert('Registration successful! Welcome to ShopHub');
        window.location.href = 'index.html';
    } catch (error) {
        const errorDiv = document.getElementById('registerError');
        if (errorDiv) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
        console.error('Registration error:', error);
    }
}

// Login user
async function loginUser(email, password) {
    try {
        // Validate inputs
        if (!email || !password) {
            throw new Error('Please fill in all fields');
        }

        // Find user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error('User not found');
        }

        // Check password
        if (btoa(password) !== user.password) {
            throw new Error('Incorrect password');
        }

        // Login successful
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert('Login successful!');
        return true; // Return success
    } catch (error) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
        console.error('Login error:', error);
        return false; // Return failure
    }
}

// Logout user
async function logoutUser() {
    try {
        currentUser = null;
        localStorage.removeItem('currentUser');
        alert('Logged out successfully');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Update auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    const profileLink = document.getElementById('profileLink');
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        // User is logged in
        if (profileLink) profileLink.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        // User is not logged in
        if (profileLink) profileLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }

    // Add logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
});

console.log('Auth functions loaded');
