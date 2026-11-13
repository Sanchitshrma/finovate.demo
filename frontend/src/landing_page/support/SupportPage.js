import React from "react";

function SupportPage() {
  const questions = [
    {
      question: "Are orders sent to a broker or exchange?",
      answer: "No. Buy and sell actions create simulated demo records only.",
    },
    {
      question: "Can I add or withdraw real money?",
      answer: "No. The dashboard uses virtual values and does not process payments or fund transfers.",
    },
    {
      question: "Are the prices live?",
      answer: "Current prices and chart history are generated simulated data for practice, not live market data.",
    },
    {
      question: "Is the AI stock summary investment advice?",
      answer: "No. AI output can be incomplete or incorrect and should not be used to make investment decisions.",
    },
  ];

  return (
    <>
      <section className="container-fluid" id="supportHero">
        <div className="container py-5">
          <span className="section-tag">Demo help</span>
          <h1 className="fw-bold mt-3 mb-3" style={{ color: "#fff" }}>Help with the Finovate demo</h1>
          <p style={{ color: "rgba(255,255,255,0.82)", maxWidth: 640 }}>
            This prototype does not have a brokerage support desk or ticketing system.
            The answers below explain what the demo currently does.
          </p>
        </div>
      </section>
      <section className="container py-5">
        <div className="row g-3">
          {questions.map((item) => (
            <div className="col-12 col-md-6" key={item.question}>
              <article className="feature-card h-100 p-4">
                <h2 className="h5 fw-semibold">{item.question}</h2>
                <p className="text-muted mb-0">{item.answer}</p>
              </article>
            </div>
          ))}
          <div className="col-12 mt-3">
            <a href="/demo-info" className="arrow-link">Read demo and data information <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          </div>
        </div>
      </section>
    </>
  );
}

export default SupportPage;
