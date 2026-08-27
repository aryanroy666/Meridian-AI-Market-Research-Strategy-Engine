import { supabase } from "../lib/supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeaders()),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let body = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const detail =
      (body && (body.detail || body.error)) || `Request failed (${response.status})`;
    throw new ApiError(detail, response.status, body);
  }

  return body;
}

export const api = {
  listResearch: () => request("/api/research/"),
  createResearch: (query) =>
    request("/api/research/", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),
  getJob: (jobId) => request(`/api/research/${jobId}`),
  getTasks: (jobId) => request(`/api/research/${jobId}/tasks`),
  getSources: (jobId) => request(`/api/research/${jobId}/sources`),
  getEvidence: (jobId) => request(`/api/research/${jobId}/evidence`),
  getValidations: (jobId) => request(`/api/research/${jobId}/validations`),
  getReport: (jobId) => request(`/api/research/${jobId}/report`),
};
