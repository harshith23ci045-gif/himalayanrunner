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
        const profile = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            phone: user.user_metadata?.phone || '',
            role: user.user_metadata?.role || 'Trekker',
            aadhaar_encrypted: user.user_metadata?.aadhaar_encrypted,
            aadhaar_last4: user.user_metadata?.aadhaar_last4,
            trek_count: user.user_metadata?.trek_count || 0
        };

        sessionStorage.setItem("currentUser", JSON.stringify(profile));
        return { success: true, user: profile };
    },

    // -------------------------------
    // REGISTER
    // -------------------------------
    async register(formData) {
        try {
            // 1. Create Supabase Auth account with user metadata
            const { data, error } = await supabase.auth.signUp({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone,
                        role: formData.role,
                        aadhaar_encrypted: formData.aadhaar ? formData.aadhaar : null,
                        aadhaar_last4: formData.aadhaar ? formData.aadhaar.slice(-4) : null,
                        trek_count: 0
                    }
                }
            });

            if (error) {
                console.error("Auth signup error:", error);
                return { success: false, error: error.message };
            }

            // Registration successful - user profile is stored in auth metadata
            return { success: true, user: data.user };
        } catch (err) {
            console.error("Registration error:", err);
            return { success: false, error: err.message || "Registration failed" };
        }
    },

    // -------------------------------
    // CURRENT USER
    // -------------------------------
    async getCurrentUser() {
        const session = await supabase.auth.getSession();
        if (!session.data.session) return null;

        const user = session.data.session.user;
        const profile = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            phone: user.user_metadata?.phone || '',
            role: user.user_metadata?.role || 'Trekker',
            aadhaar_encrypted: user.user_metadata?.aadhaar_encrypted,
            aadhaar_last4: user.user_metadata?.aadhaar_last4,
            trek_count: user.user_metadata?.trek_count || 0
        };

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
