import React from "react";
import { Link } from "react-router-dom";
import "./Apps.css";

const sections = [
  {
    to: "/",
    name: "Watchlist",
    icon: "☆",
    description: "Track supported symbols and open paper order tickets.",
    category: "Available demo feature",
  },
  {
    to: "/orders",
    name: "Paper orders",
    icon: "↗",
    description: "Review simulated orders recorded in your demo account.",
    category: "Available demo feature",
  },
  {
    to: "/holdings",
    name: "Holdings",
    icon: "▤",
    description: "View your paper portfolio and estimated returns.",
    category: "Available demo feature",
  },
  {
    to: "/positions",
    name: "Positions",
    icon: "⌁",
    description: "Review simulated positions using available demo prices.",
    category: "Available demo feature",
  },
  {
    to: "/funds",
    name: "Virtual funds",
    icon: "₹",
    description: "View the fixed virtual balance used for paper trading.",
    category: "Available demo feature",
  },
  {
    to: "/ai",
    name: "Experimental AI summary",
    icon: "✧",
    description: "Generate an uncited summary from available price history.",
    category: "Experimental demo feature",
  },
];

const Apps = () => (
  <div className="apps-container">
    <div className="apps-header">
      <h2>Demo features</h2>
      <p>These are the sections currently available in the Finovate paper-trading demo.</p>
    </div>

    <div className="apps-grid">
      {sections.map((section) => (
        <Link key={section.to} to={section.to} className="app-card">
          <div className="app-icon" aria-hidden="true">{section.icon}</div>
          <h3 className="app-name">{section.name}</h3>
          <p className="app-description">{section.description}</p>
          <span className="app-category">{section.category}</span>
        </Link>
      ))}
    </div>
  </div>
);

export default Apps;
