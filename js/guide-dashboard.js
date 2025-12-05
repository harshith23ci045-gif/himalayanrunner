import { supabase } from "./supabase-client.js";

const trekList = document.getElementById("myTreks");
const createBtn = document.getElementById("createTrekBtn");

// load treks created by this guide
async function loadTreks() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return (window.location.href = "/login.html");

  const { data, error } = await supabase
    .from("treks")
    .select("*")
    .eq("created_by", user.id);

  if (error) {
    console.error(error);
    trekList.innerHTML = "<p>Error loading treks.</p>";
    return;
  }

  if (!data.length) {
    trekList.innerHTML = "<p>No treks created yet.</p>";
    return;
  }

  trekList.innerHTML = data
    .map(
      (t) => `
      <article class="card">
        <h4>${t.trek_name}</h4>
        <p>Date: ${t.date}</p>
        <p>Price: ₹${t.price}</p>
      </article>
    `
    )
    .join("");
}

// create a new trek
createBtn.addEventListener("click", async () => {
  const name = document.getElementById("trek_name").value.trim();
  const date = document.getElementById("trek_date").value;
  const price = parseInt(document.getElementById("trek_price").value);

  if (!name || !date || !price) return alert("All fields required");

  const user = (await supabase.auth.getUser()).data.user;

  const { error } = await supabase.from("treks").insert([
    {
      trek_name: name,
      date,
      price,
      created_by: user.id, // REQUIRED by RLS
    },
  ]);

  if (error) {
    alert("Insert failed: " + error.message);
    console.error(error);
    return;
  }

  alert("Trek added successfully!");
  loadTreks();
});

// logout
document.getElementById("btn-logout").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
});

loadTreks();
