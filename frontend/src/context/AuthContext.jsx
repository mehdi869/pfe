import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          // Verify the token with the backend
          const verifyResponse = await fetch("http://localhost:8000/token/verify/", { // Correct verify endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: accessToken }),
          });
          if (verifyResponse.ok) {
            setIsAuthenticated(true); // Token is valid
          } else {
            // Token invalid/expired - attempt refresh or clear tokens
            console.log("Access token invalid, attempting refresh or clearing.");
            // TODO: Implement refresh token logic here if desired
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false); // No token found
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem('accessToken'); // Clean up on error
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Optionally call backend logout API first
    // fetch("http://localhost:8000/api/logout/", { method: "POST", ... });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};