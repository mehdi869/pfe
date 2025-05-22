import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

let ongoingRefreshPromise = null;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null); // Store accessToken in memory
  const [user, setUser] = useState(() => {
    // Load user info from localStorage if available
    const storedUserJSON = localStorage.getItem('user');
    if (storedUserJSON) {
      try {
        // JSON.parse will correctly convert the string "null" to the value null
        return JSON.parse(storedUserJSON);
      } catch (error) {
        console.error("AuthContext: Failed to parse stored user data from localStorage. Clearing.", error);
        localStorage.removeItem('user'); // Clear corrupted data
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (ongoingRefreshPromise) {
        console.log("AuthContext: checkAuthStatus - Joining existing refresh operation.");
        try {
          await ongoingRefreshPromise;
        } catch (error) {
        }
        return;
      }

      console.log("AuthContext: checkAuthStatus - Initiating new refresh operation.");
      setIsLoading(true);

      ongoingRefreshPromise = (async () => {
        try {
          const storedRefreshToken = localStorage.getItem('refreshToken');
          console.log("AuthContext: checkAuthStatus - Found refresh token in localStorage:", !!storedRefreshToken);
          
          if (storedRefreshToken) {
            const refreshResponse = await fetch("http://localhost:8000/refresh/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: storedRefreshToken }),
            });

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              console.log("AuthContext: checkAuthStatus - Refresh successful. New access token received.");
              setAccessToken(data.access);
              if (data.refresh) { // Always expect a new refresh token if rotation is on
                console.log("AuthContext: checkAuthStatus - Storing new refresh token from refresh endpoint.");
                localStorage.setItem('refreshToken', data.refresh);
              }
              setIsAuthenticated(true);
            } else {
              const errorBody = await refreshResponse.json().catch(() => ({ detail: "Unknown error during refresh." }));
              console.error(`AuthContext: checkAuthStatus - Refresh token invalid (status ${refreshResponse.status}), clearing tokens. Detail: ${errorBody.detail}`);
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              setAccessToken(null);
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            console.log("AuthContext: checkAuthStatus - No refresh token found in localStorage.");
            setIsAuthenticated(false);
            setAccessToken(null);
          }
        } catch (error) {
          console.error("AuthContext: checkAuthStatus - Auth check/refresh failed with exception:", error);
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setAccessToken(null);
          setUser(null);
          setIsAuthenticated(false);
          throw error;
        }
      })();

      try {
        await ongoingRefreshPromise;
      } catch (error) {
        // Error is logged by the async IIFE.
      } finally {
        ongoingRefreshPromise = null;
        setIsLoading(false);
        console.log("AuthContext: checkAuthStatus - Refresh operation finished. isLoading:", false, "isAuthenticated:", isAuthenticated);
      }
    };

    checkAuthStatus();
    
  }, []); // Run once on component mount

   const login = (access, refresh, userData) => {
    // Ensure full user object is stored
    const userObj = (userData && typeof userData === 'object' && !Array.isArray(userData)) ? userData : { user: userData };

    setAccessToken(access);
    setUser(userObj);
    setIsAuthenticated(true);

    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(userObj));
  };
  
  const logout = async () => {
    console.log("AuthContext: logout - Initiating logout.");
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await fetch("http://localhost:8000/logout/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.ok) {
          console.log("AuthContext: logout - Backend logout successful.");
        } else {
          console.error("AuthContext: logout - Backend logout failed.", await response.text());
        }
      } catch (error) {
        console.error("AuthContext: logout - API call to /logout/ failed:", error);
      }
    }
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log("AuthContext: logout - Tokens and user info cleared from localStorage and state.");
  };
  
  const verify = async (token) => {
    try {
      const res = await fetch("http://localhost:8000/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, login, logout, accessToken, verify, user }}>
      {children}
    </AuthContext.Provider>
  );
};