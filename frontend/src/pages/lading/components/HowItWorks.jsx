const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Collect Feedback",
      description: "Gather customer responses through surveys, forms, and other channels.",
      icon: "comment-dots",
    },
    {
      id: 2,
      title: "Calculate NPS",
      description: "Automatically classify responses as Detractors (0-6), Passifs (7-8), or Promoters (9-10).",
      icon: "calculator",
    },
    {
      id: 3,
      title: "Analyze Results",
      description: "Visualize data and identify trends across different segments and time periods.",
      icon: "chart-line",
    },
    {
      id: 4,
      title: "Take Action",
      description: "Implement strategies based on insights to improve customer satisfaction.",
      icon: "rocket",
    },
  ]

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="section-header">
        <h2>How It Works</h2>
        <p>Our simple process for turning feedback into actionable insights</p>
      </div>

      <div className="steps-container">
        {steps.map((step) => (
          <div className="step-card" key={step.id}>
            <div className="step-number">{step.id}</div>
            <div className="step-icon">
              <i className={`fas fa-${step.icon}`}></i>
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      <div className="nps-formula">
        <h3>NPS Formula</h3>
        <div className="formula-box">
          <p>NPS = (% Promoters - % Detractors) × 100</p>
          <div className="formula-scale">
            <div className="scale-item detractors">
              <span className="scale-label">Detractors</span>
              <div className="scale-numbers">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
              </div>
            </div>
            <div className="scale-item passives">
              <span className="scale-label">Passives</span>
              <div className="scale-numbers">
                <span>7</span>
                <span>8</span>
              </div>
            </div>
            <div className="scale-item promoters">
              <span className="scale-label">Promoters</span>
              <div className="scale-numbers">
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks