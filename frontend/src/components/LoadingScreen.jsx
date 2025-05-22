import { Loader2 } from "lucide-react"
import logo from "../pages/register/logo.png"
import "../styles/LoadingScreen.css"

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img src={logo || "/placeholder.svg"} alt="Djezzy Logo" className="loading-logo" />
        <div className="loading-spinner-container">
          <Loader2 size={40} className="loading-spinner-large" />
        </div>
        <p>Loading</p>
      </div>
    </div>
  )
}

export default LoadingScreen