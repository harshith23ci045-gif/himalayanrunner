async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) return { success: false, error: "Invalid email or password" };

    const user = data.user;

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        return { success: false, error: "Profile not found" };
    }

    // REDIRECT using role
    if (profile.role === "Guide") {
        window.location.href = "dashboard-guide.html";
    } 
    else if (profile.role === "Trekker") {
        window.location.href = "dashboard-trekker.html";
    } 
    else {
        return { success: false, error: "Role not assigned" };
    }

    return { success: true };
}
