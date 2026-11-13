import React from "react";
function Hero() {
  return (
    <section style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #fafafe 60%, #fff 100%)", padding: "4rem 0 3rem" }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="section-tag">Demo details</span>
          <h1 className="fw-bold mt-3 mb-2" style={{ fontSize: "2.75rem", letterSpacing: "-1px" }}>
            <span className="gradient-text">Virtual</span> funds and paper orders
          </h1>
          <p className="text-muted fs-5">
            This prototype does not process payments or real trades.
          </p>
        </div>
        <div className="row text-center g-4">
          <div className="col-12 col-md-4">
            <div className="feature-card h-100 py-4">
              <i className="fa-solid fa-wallet mb-3" aria-hidden="true" style={{ color: "var(--color-primary)", fontSize: "2rem" }}></i>
              <h5 className="fw-bold mb-2">Virtual balance</h5>
              <p className="text-muted" style={{ lineHeight: 1.8, fontSize: "0.9rem" }}>
                The dashboard displays a practice balance. It is not a bank or brokerage balance and cannot be deposited or withdrawn.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="price-card featured h-100">
              <i className="fa-solid fa-arrow-right-arrow-left mb-3" aria-hidden="true" style={{ color: "#fff", fontSize: "2rem" }}></i>
              <h5 className="fw-bold mb-2">Simulated orders</h5>
              <p style={{ lineHeight: 1.8, fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
                Orders update demo records only. No broker or exchange receives them.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="feature-card h-100 py-4">
              <i className="fa-solid fa-chart-line mb-3" aria-hidden="true" style={{ color: "var(--color-primary)", fontSize: "2rem" }}></i>
              <h5 className="fw-bold mb-2">Market data</h5>
              <p className="text-muted" style={{ lineHeight: 1.8, fontSize: "0.9rem" }}>
                Quotes and chart history are generated for the demo and are not live market data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
