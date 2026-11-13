import React from "react";

const DemoInfo = () => (
  <main className="container py-5" style={{ maxWidth: 900 }}>
    <span className="section-tag">Transparency</span>
    <h1 className="fw-bold mt-3">Demo use and data information</h1>
    <p className="text-muted fs-5">
      Finovate is a paper-trading software prototype. This page describes the current demo;
      it is not a complete Terms of Use or Privacy Policy.
    </p>

    <section className="feature-card p-4 my-4">
      <h2 className="h4">What the demo does</h2>
      <ul className="text-muted mb-0">
        <li>Records simulated buy and sell orders in a demo portfolio.</li>
        <li>Does not open a demat or brokerage account, accept funds, or route orders to an exchange or broker.</li>
        <li>Shows generated simulated prices and chart history for practice. They are not live market data and must not be used for investment decisions.</li>
        <li>Generates experimental AI stock summaries that may be incomplete or incorrect and currently do not provide source citations.</li>
      </ul>
    </section>

    <section className="feature-card p-4 my-4">
      <h2 className="h4">Information used by this prototype</h2>
      <ul className="text-muted mb-0">
        <li>Account email and a password hash are stored by the application backend.</li>
        <li>Watchlist entries and simulated order, holding, and position records are stored by the backend.</li>
        <li>After sign-in, the frontend passes a short-lived, single-use handoff code to the dashboard; the dashboard then stores its session token in browser storage.</li>
        <li>AI stock-insight requests send the selected symbol and historical price data to Google Gemini through the backend.</li>
      </ul>
    </section>

    <section className="alert alert-warning" role="note">
      <strong>Prototype notice:</strong> Hosting region, retention, account deletion, and a support contact are not configured in this project’s published information. Do not reuse an important password or enter identity, bank, or brokerage credentials. Complete Terms and Privacy documents are needed before a broader public launch.
    </section>
  </main>
);

export default DemoInfo;
