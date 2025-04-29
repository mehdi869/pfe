"use client";

import { useState, useEffect, useContext } from "react"; // ✨ Added useContext
import { useNavigate, Link } from "react-router-dom";
import { Log } from "../../API/api";
import { AlertCircle, Loader2 } from "lucide-react";
import "../../styles/login.css";
import logo from "../register/logo.png";
import { AuthContext } from "../../context/AuthContext"; // ✨ Added AuthContext

const Login = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext); // ✨ Getting setIsAuthenticated

  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await Log(e);
      if (!response) {
        setError("Cannot connect to the server. Please check your internet connection.");
      } else if (response.status === 200) {
        const data = await response.json();

        // ✨ Set authenticated
        setIsAuthenticated(true);

        // ✨ Navigate to dashboard
        navigate("/Dashboard");
      } else {
        let errorMsg = "Invalid username or password. Please verify your information.";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) errorMsg = errorData.error;
        } catch {
          if (response.status >= 500) errorMsg = "Internal server error. Please try again later.";
          else if (response.status === 0) errorMsg = "No response from server. Please check your connection.";
        }
        setError(errorMsg);
      }
    } catch (err) {
      if (err.message && err.message.includes("Network")) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="body1">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="form1">
          <div className="login1">
            <img src={logo || "/placeholder.svg"} alt="Djezzy Logo" className="auth-logo" />
            <h1 className="text">Welcome Back</h1>
            <p className="text2">Please enter your information to login</p>
          </div>

          <div className="input1">
            <div className="labels1">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username or email"
                name="username"
                autocomplete="username" // Add this
                value={formData.username}
                onChange={handleInputChange}
                className={formErrors.username ? "invalid" : ""}
                aria-invalid={formErrors.username ? "true" : "false"}
              />
              {formErrors.username && <p className="field-error">{formErrors.username}</p>}
            </div>

            <div className="labelpassword">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                autocomplete="current-password" // Add this
                value={formData.password}
                onChange={handleInputChange}
                className={formErrors.password ? "invalid" : ""}
                aria-invalid={formErrors.password ? "true" : "false"}
              />
              {formErrors.password && <p className="field-error">{formErrors.password}</p>}
            </div>
          </div>

          {error && (
            <div className="error-container">
              <AlertCircle size={16} />
              <p className="error">{error}</p>
            </div>
          )}

          <div className="input3">
            <button type="submit" className="but" disabled={isLoading}>
              {isLoading ? (
                <span className="button-content">
                  <Loader2 size={18} className="loading-spinner" />
                  <span>Logging in...</span>
                </span>
              ) : (
                <span className="buttonlogin">Login</span>
              )}
            </button>
            <p id="account">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
