// js/trek-handler.js
import { supabase } from "./supabase-client.js";

/* TREK CRUD (guide) */
export async function createTrek(title, description, amount) {
  const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
  const created_by = user?.id || null;
  const { data, error } = await supabase
    .from("treks")
    .insert([{ title, description, amount, created_by }]);

  return { data, error };
}

export async function listTreks() {
  const { data, error } = await supabase
    .from("treks")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function listTreksByGuide(guideId) {
  const { data, error } = await supabase
    .from("treks")
    .select("*")
    .eq("created_by", guideId);

  return { data, error };
}

/* BOOKINGS */
export async function recordBooking(trekId, userId, amountPaid, paymentId) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([{ trek_id: trekId, user_id: userId, amount_paid: amountPaid, payment_id: paymentId }]);
  return { data, error };
}

/* COUPONS */
export function generateCouponCode() {
  const a = Math.random().toString(36).slice(2, 8).toUpperCase();
  const b = Math.random().toString(36).slice(2, 8).toUpperCase();
  return a + b;
}

export async function createCouponsForUser(userId) {
  const code1 = generateCouponCode();
  const code2 = generateCouponCode();
  await supabase.from("coupons").insert([{ code: code1, user_id: userId }, { code: code2, user_id: userId }]);
  return [code1, code2];
}

export async function applyCoupon(code) {
  const { data: coupon, error } = await supabase.from("coupons").select("*").eq("code", code).single();
  if (error || !coupon || coupon.used) return { ok: false, message: "Invalid or used coupon" };
  return { ok: true, discount: coupon.discount_percent, coupon };
}

export async function markCouponUsed(code) {
  await supabase.from("coupons").update({ used: true }).eq("code", code);
}

/* CSV export for guide (bookings for a trek) */
export async function fetchBookingsForTrek(trekId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("id,trek_id,user_id,amount_paid,payment_id,created_at")
    .eq("trek_id", trekId);

  return { data, error };
}

export function bookingsToCSV(bookings) {
  const header = ["id", "trek_id", "user_id", "amount_paid", "payment_id", "created_at"];
  const rows = bookings.map((b) => header.map((h) => (b[h] === null || b[h] === undefined ? "" : String(b[h]))));
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  return csv;
}
