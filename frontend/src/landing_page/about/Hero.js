import React from "react";
function Hero() {
  return (
    <section style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #fafafe 60%, #fff 100%)", padding: "4rem 0 3rem" }}>
      <div className="container">
        <div className="row mb-4 text-center">
          <div className="col-12">
            <span className="section-tag">Project overview</span>
            <h1 className="fw-bold mt-3" style={{ fontSize: "2.25rem", letterSpacing: "-0.5px", maxWidth: 700, margin: "0.75rem auto 0" }}>
              Finovate is a paper-trading demo.
              <br />
              <span className="gradient-text">Practice portfolio workflows with virtual data.</span>
            </h1>
          </div>
        </div>
        <div className="row g-4" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "2.5rem" }}>
          <div className="col-12 col-lg-6">
            <p className="text-muted" style={{ lineHeight: 1.9 }}>
              Finovate is a software project that demonstrates a stock-market
              watchlist, simulated buy and sell orders, and portfolio views.
              Accounts and trades in this demo do not connect to a broker or exchange.
            </p>
            <p className="text-muted" style={{ lineHeight: 1.9 }}>
              The project is intended for learning and demonstration. It does not
              accept deposits, hold customer funds, or execute real transactions.
            </p>
            <p className="text-muted" style={{ lineHeight: 1.9 }}>
              Quotes and chart history are generated simulated data for this
              demo. Check the demo information page for data limitations.
            </p>
          </div>
          <div className="col-12 col-lg-6">
            <p className="text-muted" style={{ lineHeight: 1.9 }}>
              The dashboard includes a watchlist, paper orders, holdings, positions,
              virtual funds, and an experimental AI stock-insight preview.
            </p>
            <p className="text-muted" style={{ lineHeight: 1.9 }}>
              AI-generated text can be incomplete or incorrect and currently
              does not include citations to supporting documents.
            </p>
            <p className="text-muted" style={{ lineHeight: 1.9 }}>
              No affiliation with a brokerage, exchange, depository, or third-party
              platform is claimed by this demo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
