import { supabase } from "./supabase-client.js";

const Auth = {
    async register(formData) {
        // 1. Create Auth user
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
        });

        if (error) return { success: false, error: error.message };

        // 2. Insert profile row
        const user = data.user;

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

    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) return { success: false, error: "Invalid email or password" };

        return { success: true, user: data.user };
    }
};

export default Auth;
