"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Log } from "../../API/api"
import { AlertCircle, Loader2 } from "lucide-react"
import "../../styles/login.css"
import logo from "../register/logo.png"

const Login = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate()

  const validateForm = () => {
    const errors = {}
    if (!formData.username) errors.username = "Username is required"
    if (!formData.password) errors.password = "Password is required"
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
    e.preventDefault()

    if (!validateForm() || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await Log(e)
      if (!response) {
        setError("Connection failed. Please try again.")
      } else if (response.status === 200) {
        console.log("User logged in:", response)
        navigate("/Dashboard")
      } else {
        setError("Invalid username or password. Please verify your information.")
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
  )
}

export default Login