
const Features = () => {
  const featuresList = [
    {
      id: 1,
      icon: "chart-bar",
      title: "Real-time NPS Calculation",
      description: "Automatically calculate NPS scores from customer feedback in real-time.",
    },
    {
      id: 2,
      icon: "chart-pie",
      title: "Interactive Dashboards",
      description: "Visualize NPS data with interactive charts and customizable dashboards.",
    },
    {
      id: 3,
      icon: "filter",
      title: "Advanced Segmentation",
      description: "Segment NPS data by region, product, time period, and more.",
    },
    {
      id: 4,
      icon: "bell",
      title: "Alerts & Notifications",
      description: "Get notified when NPS scores change significantly or reach thresholds.",
    },
    {
      id: 5,
      icon: "file-export",
      title: "Export & Reporting",
      description: "Generate and export comprehensive reports in multiple formats.",
    },
    {
      id: 6,
      icon: "lock",
      title: "Secure Data Handling",
      description: "RGPD compliant data storage and processing for customer information.",
    },
  ]

  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <h2>Powerful Features</h2>
        <p>Everything you need to analyze and improve your Net Promoter Score</p>
      </div>

      <div className="features-grid">
        {featuresList.map((feature) => (
          <div className="feature-card" key={feature.id}>
            <div className="feature-icon">
              <i className={`fas fa-${feature.icon}`}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
