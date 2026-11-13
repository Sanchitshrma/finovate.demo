import React from "react";
function Education() {
  return (
    <section style={{ background: "var(--color-bg)", padding: "5rem 0" }}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6">
            <div className="feature-card h-100 p-5 d-flex align-items-center justify-content-center text-center">
              <i className="fa-solid fa-graduation-cap" aria-hidden="true" style={{ fontSize: "4rem", color: "var(--color-primary)" }}></i>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <span className="section-tag">Practice safely</span>
            <h2 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>Learn the workflow with paper orders</h2>
            <div className="feature-card mb-3">
              <h6 className="fw-semibold mb-1"><i className="fa-solid fa-list-check me-2" style={{ color: "var(--color-primary)" }}></i>Explore the dashboard</h6>
              <p className="text-muted mb-2" style={{ fontSize: "0.875rem" }}>
                Add supported symbols to a watchlist, then review simulated orders and portfolio changes.
              </p>
              <a href="/product" className="arrow-link" style={{ fontSize: "0.85rem" }}>
                See demo features <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
            <div className="feature-card">
              <h6 className="fw-semibold mb-1"><i className="fa-solid fa-circle-info me-2" style={{ color: "var(--color-accent)" }}></i>Know the limits</h6>
              <p className="text-muted mb-2" style={{ fontSize: "0.875rem" }}>
                This demo does not place real orders. Quotes are simulated, and AI text can be wrong.
              </p>
              <a href="/demo-info" className="arrow-link" style={{ fontSize: "0.85rem" }}>
                Read demo information <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
