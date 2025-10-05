document.getElementById('sign-in-btn').addEventListener('click', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const loader = document.getElementById('loader');

    // Reset errors & show loader
    errorMessage.innerText = "";
    loader.style.display = "block";

    setTimeout(() => {
        // Validate input fields
        if (!username || !password) return showError("Please fill in all fields!");

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.length === 0) return showError("No users found!");

        const user = users.find(user => user.username === username);

        if (!user || user.password !== password) return showError("Invalid username or password");

        // Save current user session
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Redirect after successful login
        setTimeout(() => window.location.href = 'index.html', 1500);
    }, 1200);
});

// Helper function for error handling
function showError(message) {
    document.getElementById('error-message').innerText = message;
    document.getElementById('loader').style.display = "none";
    setTimeout(() => {
        document.getElementById('error-message').innerText = "";
    }, 5000);
}

// Toggle Password Visibility
document.getElementById('eye-icon-3').addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon-3');

    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    eyeIcon.src = passwordInput.type === "password" ? "photos/opened.png" : "photos/closed.png";
});