import { useState, useEffect, useContext } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { Log } from "../../API/api";
import { AlertCircle, Loader2 } from "lucide-react";
import "../../styles/login.css";
import logo from "../register/logo.png";
import { AuthContext } from "../../context/AuthContext"; 

const Login = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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
    e.preventDefault(); // Prevents the browser from refreshing or redirecting when the form is submitted — a must in React apps.

    if (!validateForm() || isLoading) return; // Validate form and prevent submission if already loading

    setIsLoading(true); // Set loading state to true
    setError(null); // Reset error state

    try {
      const data = await Log(formData.username, formData.password); // Call the Log function to authenticate no DOM event passed here

      
      // Make sure both tokens exist before proceeding
      if (data && data.access && data.refresh) {
        // Store tokens using AuthContext login function
        login(data.access, data.refresh , data.user); // Pass user data to login function 
        navigate("/Dashboard"); // Navigate on success
      } else {
         // Handle case where tokens might be missing in response
         setError("Login successful, but token data is missing.");
      }

    } catch (err) {
       // Handle errors thrown by Log function or network issues
       let errorMsg = "An unexpected error occurred.";
       if (err.status === 401) {
           errorMsg = err.data?.detail || "Invalid username or password.";
       } else if (err.message?.includes("Network") || err.message?.includes("fetch")) {
           errorMsg = "Cannot connect to the server. Please check connection.";
       } else if (err.status >= 500) {
           errorMsg = "Server error. Please try again later.";
       } else {
           errorMsg = err.message || errorMsg;
       }
       setError(errorMsg);
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
                autoComplete="username" // Add this
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
                autoComplete="current-password" // Add this
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
