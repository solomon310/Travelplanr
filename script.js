const signUpForm = document.getElementById('sign-up-form');
const signInForm = document.getElementById('sign-in-form');

signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = signUpForm.username.value;
    const password = signUpForm.password.value; const confirmedPassword = signUpForm.confirmedPassword.value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.innerText = "";

    if (!username || !password || !confirmedPassword) {
        errorMessage.innerText = 'Please fill in all fields!';
        setTimeout(() => {
            errorMessage.innerText = "";
        }, 5000);
        return;
    }

    if (password !== confirmedPassword) {
        errorMessage.innerText = 'Passwords do not match.';
        setTimeout(() => {
            errorMessage.innerText = "";
        }, 5000);
        return;
    }

    if (username.length < 5) {
        errorMessage.innerText = 'Username must be atleast 5 characters and must not contain symbols!';
        setTimeout(() => {
            errorMessage.innerText = "";
        }, 5000);
        return;
    }

    if (password.length < 6) {
        errorMessage.innerText = 'Password must be atleast 6 characters and atleast contain a number, special charcter.';
        setTimeout(() => {
            errorMessage.innerText = "";
        }, 5000);
        return;
    }

    // let users = JSON.parse(localStorage.getItem('users')) || {};

    // if (users[username]) {
    //     errorMessage.innerText = 'Username already exists';
    //     setTimeout(() => {
    //         errorMessage.innerText = "";
    //     }, 5000);
    //     return;
    // }
    // users[username] = password;
    // localStorage.setItem('users', JSON.stringify(users));

    // setTimeout(() => {
    //     window.location.href = 'sign_in.html';
    // }, 3000)
});

signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = signInForm.username.value;
    const password = signInForm.password.value;
    signIn(username, password)
});