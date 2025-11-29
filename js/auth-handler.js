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
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            return { success: false, error: "Unable to load profile" };
        }

        sessionStorage.setItem("currentUser", JSON.stringify(profile));
        return { success: true, user: profile };
    },

    // -------------------------------
    // REGISTER
    // -------------------------------
    async register(formData) {
        try {
            // 1. CREATE SUPABASE USER (ONLY email + password)
            const { data: signupData, error: signupError } = await supabase.auth.signUp({
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            if (signupError) {
                return { success: false, error: signupError.message };
            }

            const user = signupData.user;

            if (!user) {
                return { success: false, error: "Signup failed. Try again." };
            }

            // Aadhaar fields
            const aadhaar_last4 = formData.aadhaar.slice(-4);
            const aadhaar_encrypted = btoa(formData.aadhaar);

            // 2. INSERT INTO PROFILES TABLE
            const { error: profileError } = await supabase.from("profiles").insert({
                id: user.id,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                aadhaar_encrypted: aadhaar_encrypted,
                aadhaar_last4: aadhaar_last4,
                trek_count: 0
            });

            if (profileError) {
                console.error("Profile insert error:", profileError);
                return { success: false, error: "Database error saving new user" };
            }

            return { success: true, user };

        } catch (err) {
            return { success: false, error: "Registration failed" };
        }
    },

    // -------------------------------
    // CURRENT USER
    // -------------------------------
    async getCurrentUser() {
        const session = await supabase.auth.getSession();
        if (!session.data.session) return null;

        const user = session.data.session.user;

        const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (error) return null;

        return profile;
    },

    // -------------------------------
    // LOGOUT
    // -------------------------------
    async logout() {
        await supabase.auth.signOut();
        sessionStorage.removeItem("currentUser");
        window.location.href = "login.html";
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
