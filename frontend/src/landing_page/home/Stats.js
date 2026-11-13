import React from "react";

const features = [
  {
    icon: "fa-solid fa-list",
    title: "A watchlist for practice",
    desc: "Add supported symbols and review the quote snapshots available in this demo.",
  },
  {
    icon: "fa-solid fa-arrow-right-arrow-left",
    title: "Simulated orders",
    desc: "Try buy and sell flows that update demo portfolio records. They are not routed to a broker or exchange.",
  },
  {
    icon: "fa-solid fa-chart-pie",
    title: "Portfolio views",
    desc: "Review holdings, paper positions, and order history created in your account.",
  },
  {
    icon: "fa-solid fa-wand-magic-sparkles",
    title: "AI insight preview",
    desc: "Generate an experimental stock summary. AI output may be incomplete and is not investment advice.",
  },
];

function Stats() {
  return (
    <section style={{ background: "var(--color-bg)", padding: "5rem 0" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-12 col-lg-6">
            <span className="section-tag">Inside the demo</span>
            <h2 className="fw-bold mb-4" style={{ fontSize: "2rem" }}>Practice with a virtual portfolio</h2>
            <div className="d-flex flex-column gap-3">
              {features.map((f) => (
                <div className="feature-card d-flex gap-3 align-items-start" key={f.title}>
                  <div className="icon-circle mt-1" style={{ minWidth: 40 }}>
                    <i className={f.icon}></i>
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">{f.title}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="feature-card p-4 p-md-5 h-100 d-flex flex-column justify-content-center">
              <span className="section-tag align-self-start">Important</span>
              <h3 className="h4 fw-bold mt-3">This is not a brokerage account</h3>
              <p className="text-muted mb-0">Orders, balances, quotes, and chart history in this project are simulated. Check the demo information page for details.</p>
            </div>
            <div className="d-flex gap-4 mt-4 justify-content-center">
              <a href="/product" className="arrow-link">
                Explore demo features <i className="fa-solid fa-arrow-right"></i>
              </a>
              <a href="/demo-info" className="arrow-link">
                Demo and data info <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
