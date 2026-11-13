import React from "react";
function Hero() {
  return (
    <section style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #fafafe 60%, #fff 100%)", padding: "5rem 0 3rem" }}>
      <div className="container text-center">
        <span className="section-tag">Paper-trading demo</span>
        <h1 className="fw-bold mt-3 mb-3" style={{ fontSize: "2.75rem", letterSpacing: "-1px" }}>
          Explore the <span className="gradient-text">demo</span>
        </h1>
        <p className="text-muted fs-5 mb-4" style={{ maxWidth: 520, margin: "0 auto 1.5rem" }}>
          Practice a simple workflow for tracking symbols, recording simulated
          orders, and reviewing a virtual portfolio.
        </p>
        <a href="/demo-info" className="arrow-link justify-content-center">
          Read how the demo works <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </section>
  );
}

export default Hero;
