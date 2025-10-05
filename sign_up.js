document.getElementById('sign-up-btn').addEventListener('click', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const password = document.getElementById('password').value;
    const confirmedPassword = document.getElementById('confirmed-password').value;
    const email = document.getElementById('email').value.trim();
    const errorMessage = document.getElementById('error-message');
    const loader = document.getElementById('loader');

    errorMessage.innerText = "";
    loader.style.display = "block";

    setTimeout(() => {
        // Validate fields are not empty
        if (!fullname || !username || !email || !password || !confirmedPassword) {
            showError('Please fill in all fields!');
            return;
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address!');
            return;
        }

        // Validate passwords match
        if (password !== confirmedPassword) {
            showError('Passwords do not match.');
            return;
        }

        // Validate username length
        if (username.length < 5) {
            showError('Username must be at least 5 characters!');
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            showError('Password must be at least 6 characters!');
            return;
        }

        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if username already exists
        if (users.some(user => user.username === username)) {
            showError('Username already exists!');
            return;
        }

        // Check if email is already registered
        if (users.some(user => user.email === email)) {
            showError('Email already registered!');
            return;
        }

        // Store new user data
        users.push({ fullname, username, password, email });
        localStorage.setItem('users', JSON.stringify(users));

        alert("Sign-up successful! Redirecting...");

        setTimeout(() => {
            window.location.href = 'sign_in.html';
        }, 2000);
    }, 1200);
});

// Function to display errors
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = message;
    document.getElementById('loader').style.display = "none";
}

// Toggle Password Visibility
function togglePassword(inputId, iconId) {
    const inputField = document.getElementById(inputId);
    const imgElement = document.getElementById(iconId);

    inputField.type = inputField.type === "password" ? "text" : "password";
    imgElement.src = inputField.type === "password" ? "photos/opened.png" : "photos/closed.png";
}

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
});