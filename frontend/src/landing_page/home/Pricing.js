import React from "react";
function Pricing() {
  return (
    <section className="container py-5 my-2">
      <div className="row g-5 align-items-center">
        <div className="col-12 col-lg-5">
          <span className="section-tag">Demo access</span>
          <h2 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>No real-money pricing applies</h2>
          <p className="text-muted mb-4">
            This prototype does not accept deposits or charge brokerage. Orders use virtual demo data and do not reach a broker or exchange.
          </p>
          <a href="/pricing" className="arrow-link">
            Read demo details <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
        <div className="col-12 col-lg-7">
          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <div className="price-card featured h-100">
                <div className="mb-2" style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.75, letterSpacing: "0.5px", textTransform: "uppercase" }}>Virtual funds</div>
                <div className="display-6 fw-bold mb-2">Demo only</div>
                <p style={{ fontSize: "0.9rem" }}>Balances shown in the dashboard are practice values, not withdrawable cash.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="price-card h-100">
                <div className="mb-2 text-muted" style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Paper orders</div>
                <div className="display-6 fw-bold mb-2 gradient-text">Simulated</div>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>Order records are created for practice; there is no exchange execution or brokerage charge.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
