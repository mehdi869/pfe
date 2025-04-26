"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Registration } from "../../API/register.js"
import { AlertCircle, Loader2 } from "lucide-react"
import "../../styles/registre.css"
import logo from "./logo.png"

const Register = () => {
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setIsAuthenticated } = useContext(AuthContext)

  const validateForm = () => {
    const errors = {}
    if (!formData.name) errors.name = "Name is required"
    if (!formData.surname) errors.surname = "Surname is required"

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format"
    }

    if (!formData.username) {
      errors.username = "Username is required"
    } else if (formData.username.includes("@")) {
      errors.username = "Username must not contain '@'"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 4) {
      errors.password = "Password must be at least 4 characters"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await Registration(e);

      if (!response) {
        setError("Cannot connect to the server. Please check your internet connection.");
      } else if (response.status === 201 || response.status === 200) {
        setIsAuthenticated(true);
        navigate("/Dashboard");
      } else {
        let errorMsg = "Registration failed. Please try again.";
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
    let timer
    if (error) {
      timer = setTimeout(() => {
        setError(null)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [error])

return (
    <div className="element">
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="FORM">
                <header>
                    <img src={logo || "/placeholder.svg"} alt="Djezzy Logo" className="auth-logo" />
                    <h1>Registration</h1>
                    <p className="header">Please enter your information</p>
                </header>

                <div className="info">
                    <div className="name">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name..."
                            name="name"
                            maxLength={20}
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className={formErrors.name ? "invalid" : ""}
                            aria-invalid={formErrors.name ? "true" : "false"}
                        />
                        {formErrors.name && <p className="field-error">{formErrors.name}</p>}
                    </div>

                    <div className="surname">
                        <label htmlFor="surname">Surname</label>
                        <input
                            id="surname"
                            type="text"
                            placeholder="Enter your surname"
                            name="surname"
                            maxLength={20}
                            required
                            value={formData.surname}
                            onChange={handleInputChange}
                            className={formErrors.surname ? "invalid" : ""}
                            aria-invalid={formErrors.surname ? "true" : "false"}
                        />
                        {formErrors.surname && <p className="field-error">{formErrors.surname}</p>}
                    </div>

                    <div className="email">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email..."
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className={formErrors.email ? "invalid" : ""}
                            aria-invalid={formErrors.email ? "true" : "false"}
                        />
                        {formErrors.email && <p className="field-error">{formErrors.email}</p>}
                    </div>

                    <div className="username">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username..."
                            name="username"
                            maxLength={15}
                            required
                            value={formData.username}
                            onChange={handleInputChange}
                            className={formErrors.username ? "invalid" : ""}
                            aria-invalid={formErrors.username ? "true" : "false"}
                        />
                        {formErrors.username && <p className="field-error">{formErrors.username}</p>}
                    </div>

                    <div className="password">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password..."
                            name="password"
                            minLength={4}
                            required
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
                        <AlertCircle size={18} color="#FFFFFF" />
                        <p className="erreur">{error}</p>
                    </div>
                )}

                <footer>
                    <button type="submit" className="button2" disabled={isLoading}>
                        {isLoading ? (
                            <span className="button-content">
                                <Loader2 size={18} className="loading-spinner" />
                                <span className="p">Registering...</span>
                            </span>
                        ) : (
                            <p className="p">Register</p>
                        )}
                    </button>
                    <p className="paragraph">
                        Already have an account?{" "}
                        <Link to="/" className="link">
                            Login
                        </Link>
                    </p>
                </footer>
            </form>
        </div>
    </div>
)
}

export default Register
