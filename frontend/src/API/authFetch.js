// utils/authFetch.js
import { AuthContext } from "../context/AuthContext";

export const authFetch = async (url, options = {}, authContext) => {
  const { accessToken, logout, login } = authContext;

  // Check if access token is available auto-refresh is not present in the context so we need to check it here
  if (!accessToken) {
    console.error("No access token available for authenticated request");
    // Return a 401 response manually
    return new Response(JSON.stringify({ detail: "Authentication credentials were not provided." }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const fetchWithToken = async (token) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    return await fetch(url, { ...options, headers });
  };

  let response = await fetchWithToken(accessToken);

  // If unauthorized, try refreshing the token
  if (response.status === 401) {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        console.error("No refresh token available");
        logout();
        return response;
      }
      
      const refreshRes = await fetch("http://localhost:8000/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: storedRefreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        console.log("Token refreshed successfully");
        
        // Store both tokens - critical when BLACKLIST_AFTER_ROTATION is enabled
        if (data.refresh) {
          login(data.access, data.refresh);
        } else {
          // If no new refresh token is returned (depends on backend config)
          login(data.access, storedRefreshToken);
        }
        
        response = await fetchWithToken(data.access);
      } else {
        console.error("Failed to refresh token, logging out");
        logout();
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
    }
  }

  return response;
};
