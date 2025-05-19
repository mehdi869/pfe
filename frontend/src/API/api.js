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

// --- Admin User Management Endpoints ---

// List/search users
export const fetchUsers = async (authContext, search = "") => {
  const url = search
    ? `http://localhost:8000/api/admin/users/?search=${encodeURIComponent(search)}`
    : "http://localhost:8000/api/admin/users/";
  const response = await authFetch(url, { method: "GET" }, authContext);
  if (!response.ok) throw new Error("Failed to fetch users");
  return await response.json();
};

// Create user
export const createUser = async (authContext, userData) => {
  const response = await authFetch(
    "http://localhost:8000/api/admin/users/create/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    },
    authContext
  );
  if (!response.ok) throw new Error("Failed to create user");
  return await response.json();
};

// Update user
export const updateUser = async (authContext, userId, userData) => {
  const response = await authFetch(
    `http://localhost:8000/api/admin/users/${userId}/update/`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    },
    authContext
  );
  if (!response.ok) throw new Error("Failed to update user");
  return await response.json();
};

// Delete user
export const deleteUser = async (authContext, userId) => {
  const response = await authFetch(
    `http://localhost:8000/api/admin/users/${userId}/delete/`,
    { method: "DELETE" },
    authContext
  );
  if (!response.ok) throw new Error("Failed to delete user");
  return true;
};

// --- NPS Quick Stat Endpoints ---
export const fetchQuickStats = async () => {
  const response = await fetch("http://localhost:8000/nps/quick-stats");
  if (!response.ok) throw new Error("Failed to fetch quick stats");
  return await response.json();
};