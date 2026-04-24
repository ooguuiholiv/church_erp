const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && typeof window !== "undefined") {
  console.warn("NEXT_PUBLIC_API_URL is not defined! API calls may fail.");
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_URL || "http://localhost:3001"}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Required for HttpOnly cookies
  });

  if (response.status === 401) {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new Error("Não autorizado");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(error.message || "Erro na requisição");
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => apiFetch(endpoint, { method: "GET" }),
  post: (endpoint: string, body: any) => 
    apiFetch(endpoint, { 
      method: "POST", 
      body: JSON.stringify(body) 
    }),
  delete: (endpoint: string) => apiFetch(endpoint, { method: "DELETE" }),
  patch: (endpoint: string, body: any) => 
    apiFetch(endpoint, { 
      method: "PATCH", 
      body: JSON.stringify(body) 
    }),
};
