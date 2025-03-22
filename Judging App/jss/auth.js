const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userId = document.getElementById("userId").value;
    const password = document.getElementById("password").value;
    if (userId === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "judge-dashboard.html";
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
    alert("Judge registered with ID: " + judgeId);
    window.location.href = "login.html";
  });
}
