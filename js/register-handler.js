import authHandler from "./auth-handler.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const aadhaar = document.getElementById("aadhaar").value;
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;

    const result = await authHandler.registerUser(fullName, email, phone, aadhaar, role, password);

    if (!result.success) {
        alert(result.error);
        return;
    }

    alert("Account created! Check your email.");
    window.location.href = "login.html";
});
