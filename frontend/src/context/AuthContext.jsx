import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null); // Store accessToken in memory

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedRefreshToken) {
          // Attempt to refresh the access token
          const refreshResponse = await fetch("http://localhost:8000/api/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: storedRefreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            setAccessToken(data.access);
            setIsAuthenticated(true);
          } else {
            // Refresh token invalid/expired
            console.log("Refresh token invalid, clearing tokens.");
            localStorage.removeItem('refreshToken');
            setAccessToken(null);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false); // No refresh token found
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem('refreshToken'); // Clean up on error
        setAccessToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = (access, refresh) => {
    setAccessToken(access); // Store access token in memory
    localStorage.setItem('refreshToken', refresh); // Store refresh token securely
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Call backend logout API
      const response = await fetch("http://localhost:8000/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: localStorage.getItem('refreshToken') }),
      });

      if (response.ok) {
        console.log("Logout successful.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};