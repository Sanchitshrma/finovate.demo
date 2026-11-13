import React, { useState } from "react";

import Menu from "./Menu";
import UserMenu from "./UserMenu";

const TopBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="topbar-container">
      <div className="topbar-bar">
        <div className="topbar-left">
          <div className="topbar-meta">
            <p className="topbar-label">Finovate paper-trading demo</p>
            <p className="topbar-time">Virtual funds · simulated orders</p>
          </div>
        </div>

        <div className="topbar-right">
          <div className="menu-desktop">
            <Menu />
          </div>

          <button
            className="topbar-hamburger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={menuOpen ? "hamburger open" : "hamburger"} />
          </button>

          <UserMenu />
        </div>
      </div>

      <div className="demo-disclosure" role="note">
        <span className="demo-disclosure-mark" aria-hidden="true">i</span>
        <p className="demo-disclosure-copy">
          <strong>Demo environment</strong>
          <span className="demo-disclosure-separator" aria-hidden="true">·</span>
          No real funds or orders. Quotes are simulated.
        </p>
      </div>

      <div id="mobileMenu" className={`menu-mobile ${menuOpen ? 'open' : ''}`} role="navigation">
        <Menu />
      </div>
    </div>
  );
};

export default TopBar;
