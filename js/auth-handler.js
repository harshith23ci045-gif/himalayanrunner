import { supabase } from "./supabase-client.js";

const Auth = {
    // --------------------------------------------------------
    // REGISTER NEW USER
    // --------------------------------------------------------
    async register(formData) {
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
        });

        if (error) return { success: false, error: error.message };

        const user = data.user;

        // Insert user profile
        const { error: profileError } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                aadhaar_encrypted: formData.aadhaar,
                aadhaar_last4: formData.aadhaar.slice(-4),
                trek_count: 0
            });

        if (profileError)
            return { success: false, error: profileError.message };

        return { success: true };
    },

    // --------------------------------------------------------
    // LOGIN USER
    // --------------------------------------------------------
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) return { success: false, error: "Invalid email or password" };

        return { success: true, user: data.user };
    },

    // --------------------------------------------------------
    // GET CURRENT USER + PROFILE
    // --------------------------------------------------------
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        return { ...user, ...profile };
    },

    // --------------------------------------------------------
    // REQUIRE AUTH (REDIRECT IF NOT LOGGED IN)
    // --------------------------------------------------------
    async requireAuth() {
        const user = await this.getCurrentUser();
        if (!user) {
            window.location.href = "login.html";
            return null;
        }
        return user;
    },

    // --------------------------------------------------------
    // LOGOUT
    // --------------------------------------------------------
    async logout() {
        await supabase.auth.signOut();
        window.location.href = "login.html";
    },

    // --------------------------------------------------------
    // HELPER: MASK PHONE
    // --------------------------------------------------------
    maskPhone(phone) {
        if (!phone) return "";
        return "******" + phone.slice(-4);
    }
};

export default Auth;
