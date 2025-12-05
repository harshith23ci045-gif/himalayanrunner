// js/login-handler.js
import { login, getProfile } from "./auth-handler.js";

const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const res = await login(email, password);
    if (!res.success) {
      alert("Login error: " + res.error);
      return;
    }

    // fetch profile to route user
    const user = res.user;
    const profile = await getProfile(user.id);
    const role = profile.data?.role || "Trekker";

    if (role === "Trek Guide") {
      window.location.href = "/guide-dashboard.html";
    } else {
      window.location.href = "/treks.html";
    }
  });
}
