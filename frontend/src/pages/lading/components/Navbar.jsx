"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/Djezzy_Logo_2015.svg.png" alt="Djezzy Logo" className="logo" />
          </Link>
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          <span className={`menu-bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`menu-bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`menu-bar ${menuOpen ? "open" : ""}`}></span>
        </div>

        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <a href="#home" className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>
              Features
            </a>
          </li>
          <li className="nav-item">
            <a href="#how-it-works" className="nav-link" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link login-btn" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link register-btn" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar