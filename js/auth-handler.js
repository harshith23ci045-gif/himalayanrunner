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

        // Fetch user profile
        const { data: profile, error: pErr } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

        if (pErr) {
            return { success: false, error: "User profile not found" };
        }

        sessionStorage.setItem("currentUser", JSON.stringify(profile));

        return { success: true, user: profile };
    },

    // -------------------------------
    // REGISTER
    // -------------------------------
    async register(formData) {
        try {
            // 1. Create Supabase Auth account
            const { data, error } = await supabase.auth.signUp({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone,
                        role: formData.role,
                        aadhaar_encrypted: formData.aadhaar ? formData.aadhaar : null,
                        aadhaar_last4: formData.aadhaar ? formData.aadhaar.slice(-4) : null
                    }
                }
            });

            if (error) {
                console.error("Auth signup error:", error);
                return { success: false, error: error.message };
            }

            const user = data.user;

            // 2. Try to insert into users table with proper error handling
            if (user) {
                const { data: insertData, error: insertErr } = await supabase
                    .from("users")
                    .insert([{
                        id: user.id,
                        email: formData.email.trim().toLowerCase(),
                        full_name: formData.fullName,
                        phone: formData.phone,
                        role: formData.role,
                        aadhaar_encrypted: formData.aadhaar ? formData.aadhaar : null,
                        aadhaar_last4: formData.aadhaar ? formData.aadhaar.slice(-4) : null,
                        trek_count: 0
                    }]);

                if (insertErr) {
                    console.error("Database insert error:", insertErr);
                    // Don't fail registration if insert fails - user account is created
                    console.warn("User created in auth but profile insert failed. This may be due to RLS policies.");
                }
            }

            return { success: true, user };
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

        const user_id = session.data.session.user.id;

        const { data: profile } = await supabase
            .from("users")
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
