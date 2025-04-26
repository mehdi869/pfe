import { Link } from "react-router-dom"
import { Home } from "lucide-react"
import logo from "../pages/register/logo.png"
import "../../src/styles/NotFound.css"

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <img src={logo || "/placeholder.svg"} alt="Djezzy Logo" className="not-found-logo" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-button">
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
