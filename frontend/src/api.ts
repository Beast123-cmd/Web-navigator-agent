// src/api.ts
const API_BASE = "http://127.0.0.1:8000"; // FastAPI backend

export async function searchQuery(query: string, mode: string = "search") {
  const res = await fetch(`${API_BASE}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, mode }),
  });

  if (!res.ok) throw new Error("Backend error");

  return res.json(); // { summary, products }
}
