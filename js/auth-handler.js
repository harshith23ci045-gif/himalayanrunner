// js/auth-handler.js
import { supabase } from "./supabase-client.js";

export async function registerTrekker(fullName, email, phone, password) {
  // only registering Trekker role from frontend
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) return { success: false, error: error.message };

  const user = data.user;
  if (!user) return { success: false, error: "No user returned" };

  const { error: profileErr } = await supabase
    .from("profiles")
    .insert([{ id: user.id, full_name: fullName, phone, role: "Trekker" }]);

  if (profileErr) return { success: false, error: profileErr.message };

  return { success: true };
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return { success: false, error: error.message };

  return { success: true, user: data.user };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function sendResetEmail(email) {
  // Supabase password reset
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/login.html"
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
