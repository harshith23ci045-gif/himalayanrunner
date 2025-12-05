// js/register-handler.js
import { registerTrekker } from "./auth-handler.js";

const form = document.getElementById("registerForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    const res = await registerTrekker(fullName, email, phone, password);
    if (!res.success) {
      alert("Error: " + res.error);
      return;
    }
    alert("Registered. Check your email for confirmation. Then login.");
    window.location.href = "/login.html";
  });
}
