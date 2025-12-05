import { supabase } from "./supabase-client.js";

async function registerUser(fullName, email, phone, aadhaar, role, password) {

    // Create account
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        return { success: false, error: error.message };
    }

    const user = data.user;

    // Insert profile data
    const { error: profileError } = await supabase
        .from("profiles")
        .insert([
            {
                id: user.id,
                full_name: fullName,
                phone: phone,
                aadhaar: aadhaar,
                role: role
            }
        ]);

    if (profileError) {
        return { success: false, error: profileError.message };
    }

    return { success: true };
}

export default {
    registerUser
};
