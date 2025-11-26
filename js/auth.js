import { supabase } from "./supabase-client.js";

const Auth = {
    // -------------------------------
    // LOGIN
    // -------------------------------
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
        });

        if (error) {
            return { success: false, error: "Invalid email or password" };
        }

        const user = data.user;

        // Fetch profile
        const { data: profile, error: pErr } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (pErr) {
            return { success: false, error: "Profile not found" };
        }

        sessionStorage.setItem("currentUser", JSON.stringify(profile));

        return { success: true, user: profile };
    },

    // -------------------------------
    // REGISTER
    // -------------------------------
    async register(formData) {
        // 1. Create Supabase Auth account
        const { data, error } = await supabase.auth.signUp({
            email: formData.email.trim().toLowerCase(),
            password: formData.password
        });

        if (error) {
            return { success: false, error: error.message };
        }

        const user = data.user;

        // 2. Insert profile row
        const { error: insertErr } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                full_name: formData.fullName,
                phone: formData.phone,
                role: formData.role,
                aadhaar_encrypted: formData.aadhaar ? formData.aadhaar : null,
                aadhaar_last4: formData.aadhaar ? formData.aadhaar.slice(-4) : null,
                trek_count: 0
            });

        if (insertErr) {
            return { success: false, error: insertErr.message };
        }

        return { success: true, user };
    },

    // -------------------------------
    // CURRENT USER
    // -------------------------------
    async getCurrentUser() {
        const session = await supabase.auth.getSession();
        if (!session.data.session) return null;

        const user_id = session.data.session.user.id;

        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user_id)
            .single();

        return profile;
    },

    // -------------------------------
    // LOGOUT
    // -------------------------------
    async logout() {
        await supabase.auth.signOut();
        sessionStorage.removeItem("currentUser");
        window.location.href = "index.html";
    },

    async requireAuth() {
        const user = await this.getCurrentUser();
        if (!user) {
            window.location.href = "login.html";
            return null;
        }
        return user;
    }
};

export default Auth;
