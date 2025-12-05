import { supabase } from "./supabase-client.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    const user = data.user;

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError) {
        alert(profileError.message);
        return;
    }

    const role = profile.role;

    if (role === "Admin") {
        window.location.href = "dashboard-admin.html";
    } else if (role === "Trek Guide") {
        window.location.href = "dashboard-guide.html";
    } else {
        window.location.href = "dashboard-trekker.html";
    }
});
