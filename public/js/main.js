// Base API call helper
async function apiCall(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// Authentication Check
function checkAuth() {
    const token = localStorage.getItem('token');
    const authPages = ['/', '/register'];
    const currentPath = window.location.pathname;

    if (!token && !authPages.includes(currentPath)) {
        window.location.href = '/';
    } else if (token && authPages.includes(currentPath)) {
        window.location.href = '/home';
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/';
}
