import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-text">
          <h1>NPS Analysis for Djezzy</h1>
          <h2>Transforming Customer Feedback into Actionable Insights</h2>
          <p>
            Track customer satisfaction, uncover trends, and make data-driven decisions to enhance service quality.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <a href="#how-it-works" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="triangle-network">
            <div className="glow-effect" />
          </div>
        </div>
      </div>
      <div className="hero-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
