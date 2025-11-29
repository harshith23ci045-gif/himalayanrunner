async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) return { success: false, error: "Invalid email or password" };

    const user = data.user;

    // Fetch profile details
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileError || !profile)
        return { success: false, error: "Profile not found" };

    // Return both user + profile (so login page handles redirect)
    return {
        success: true,
        user: user,
        profile: profile
    };
}
