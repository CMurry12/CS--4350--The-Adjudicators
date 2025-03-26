const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const judgeId = document.getElementById("judgeId").value;
        const password = document.getElementById("password").value;

        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[judgeId] && users[judgeId] === password) {
            alert("Login successful!");
            
            if (judgeId === 'admin') {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href = "judge-dashboard.html";
            }

        } else {
            alert("Invalid Judge ID or password.");
        }
    });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const judgeId = document.getElementById("judgeId").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[judgeId]) {
            alert("Judge ID already exists.");
            return;
        }

        users[judgeId] = password;
        localStorage.setItem('users', JSON.stringify(users));

        alert("Registration successful! Please login.");
        window.location.href = "login.html";
    });
}
