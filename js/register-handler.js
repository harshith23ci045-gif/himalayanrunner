import { supabase } from "./supabase-client.js";

document.getElementById("registerForm").addEventListener("submit", registerUser);

async function registerUser(event) {
  event.preventDefault();

  const full_name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!full_name || !email || !phone || !password) {
    alert("Fill all fields");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone, role: "trekker" }
    }
  });

  if (error) {
    alert("Error: " + error.message);
    return;
  }

  alert("Account created! Check your email for verification.");
  window.location.href = "/login.html";
}
