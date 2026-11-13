import React from "react";
import { Link } from "react-router-dom";
import "../../components/Buttons.css";

function Hero() {
  return (
    <section
      style={{
        background: "linear-gradient(160deg, #f0f7ff 0%, #fafafe 60%, #fff 100%)",
        paddingBottom: "4rem",
      }}
    >
      <div className="container py-5">
        <div className="row text-center justify-content-center">
          <div className="col-12 col-lg-8 mb-3">
            <span className="section-tag">Paper-trading demo</span>
            <h1
              className="display-4 fw-bold mt-2 mb-3"
              style={{ letterSpacing: "-1px", lineHeight: 1.15 }}
            >
              Practice investing with <span className="gradient-text">simulated trades</span>
            </h1>
            <p className="fs-5 text-muted mb-4" style={{ maxWidth: 520, margin: "0 auto 1.5rem" }}>
              Build a watchlist, place simulated buy and sell orders, and review
              a virtual portfolio. No money moves and no orders are sent to a broker or exchange.
            </p>
          </div>
          <div className="col-12 d-flex justify-content-center gap-3 flex-wrap mb-5">
            <Link to="/signup" className="btn btn-lg rounded-pill signup-cta" aria-label="Create a demo account">
              Create a demo account
            </Link>
            <a href="/product" className="btn btn-lg btn-outline-secondary rounded-pill px-4" style={{ fontWeight: 500 }}>
              Explore demo features
            </a>
          </div>
          <div className="col-12 col-lg-9 mx-auto">
            <div className="feature-card d-flex flex-wrap justify-content-center gap-3 py-4" role="note">
              <span>Watchlist</span><span aria-hidden="true">·</span>
              <span>Paper orders</span><span aria-hidden="true">·</span>
              <span>Portfolio views</span><span aria-hidden="true">·</span>
              <span>AI insight preview</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
