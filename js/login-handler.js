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

    const user = res.user;

    // fetch user profile
    const { data: profile, error } = await getProfile(user.id);
    if (error || !profile) {
      console.error("PROFILE ERROR:", error);
      alert("Profile not found.");
      return;
    }

    const role = profile.role;

    console.log("ROLE:", role); // Debugging

    // Redirect based on EXACT role stored in DB
    if (role === "guide") {
      window.location.href = "/guide-dashboard.html";
    } else {
      window.location.href = "/treks.html";
    }
  });
}
