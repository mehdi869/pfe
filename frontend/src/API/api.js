import { authFetch } from "./authFetch";

// Login without DOM event
export const Log = async (username, password) => {
  const response = await fetch("http://localhost:8000/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) throw { status: response.status, data };

  return data; // { access, refresh }
};

// Logout
export const Logout = async () => {
  const refresh = localStorage.getItem("refreshToken");
  const response = await fetch("http://localhost:8000/logout/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) throw new Error("Logout failed");
  return true;
};

// Protected API Call: Status
export const fetchStatus = async (authContext) => {
  const response = await authFetch("http://localhost:8000/status/", { method: "GET" }, authContext);
  if (!response.ok) throw new Error("Failed to fetch status");
  return await response.json();
};

// Protected API Call: NPS Score
export const fetchNpsScore = async (authContext) => {
  const response = await authFetch("http://localhost:8000/nps/", { method: "GET" }, authContext);
  if (!response.ok) throw new Error("Failed to fetch NPS score");
  return await response.json();
};

// Protected API Call: Bar Chart
export const fetchQuestionTypeStats = async (authContext) => {
  const response = await authFetch("http://localhost:8000/barchart/", { method: "GET" }, authContext);
  if (!response.ok) throw new Error("Failed to fetch chart data");
  return await response.json();
};
