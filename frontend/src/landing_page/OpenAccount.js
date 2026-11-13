import React from "react";
import { Link } from "react-router-dom";
import "../components/Buttons.css";

function OpenAccount() {
  return (
    <section style={{ padding: "4rem 1rem" }}>
      <div className="container">
        <div className="cta-section">
          <span className="section-tag" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
            Paper-trading demo
          </span>
          <h2 className="fw-bold mt-3 mb-2" style={{ fontSize: "2.25rem", color: "#fff" }}>
            Create a demo account
          </h2>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", maxWidth: 480, margin: "0 auto 1.5rem" }}>
            Try the watchlist, simulated orders, and virtual portfolio. No funds
            are accepted and no trades are sent to a broker or exchange.
          </p>
          <Link
            to="/signup"
            className="btn btn-lg rounded-pill signup-cta"
            aria-label="Create a demo account"
            style={{ background: "#fff", color: "var(--color-primary)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
          >
            Try the demo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OpenAccount;
