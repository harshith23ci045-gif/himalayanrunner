import { supabase } from "./supabase-client.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    const user = data.user;

    // Get user role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile) {
        alert("No profile found.");
        return;
    }

    if (profile.role === "Admin") {
        window.location.href = "dashboard-admin.html";
    } else if (profile.role === "Trek Guide") {
        window.location.href = "dashboard-guide.html";
    } else {
        window.location.href = "dashboard-trekker.html";
    }
});
