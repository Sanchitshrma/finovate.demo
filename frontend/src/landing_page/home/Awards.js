import React from "react";
function Awards() {
  const items = [
    { title: "Watchlist", detail: "Save supported stock symbols to a personal demo list." },
    { title: "Paper orders", detail: "Record simulated buy and sell orders in the demo account." },
    { title: "Portfolio views", detail: "Review holdings, positions, and order history created in the simulator." },
  ];
  return (
    <section className="container py-5 my-4">
      <div className="row g-4">
        <div className="col-12 text-center mb-2">
          <span className="section-tag">Demo workspace</span>
          <h2 className="fw-bold mt-3" style={{ fontSize: "2rem" }}>What you can try</h2>
          <p className="text-muted">Practice common portfolio workflows with virtual data.</p>
        </div>
        {items.map((item) => (
          <div className="col-12 col-md-4" key={item.title}>
            <div className="feature-card h-100 p-4">
              <h3 className="h5 fw-semibold">{item.title}</h3>
              <p className="text-muted mb-0">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Awards;
