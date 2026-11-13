import React from "react";
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="finovate-footer">
      <div className="container py-5">
        {/* Top links row */}
        <div className="row g-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="col-12 col-md-4">
            <a className="d-flex align-items-center text-decoration-none mb-3 footer-brand" href="/">
              <img
                src="media/images/coins-solid.svg"
                alt="Finovate logo"
                className="img-fluid"
                style={{ height: 24, width: 24, filter: "brightness(0) invert(1)" }}
              />
              <span className="ms-2 fs-5">Finovate</span>
            </a>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              &copy; {year} Finovate demo.
            </p>
          </div>
          <div className="col-6 col-md-2">
            <p className="footer-col-head">Explore</p>
            <a className="footer-top-links" href="/about">About</a>
            <a className="footer-top-links" href="/product">Demo features</a>
            <a className="footer-top-links" href="/pricing">Demo details</a>
            <a className="footer-top-links" href="/demo-info">Data information</a>
          </div>
          <div className="col-6 col-md-3">
            <p className="footer-col-head">Help</p>
            <a className="footer-top-links" href="/support">Demo help</a>
            <a className="footer-top-links" href="/demo-info">How simulated data works</a>
          </div>
          <div className="col-12 col-md-3">
            <p className="footer-col-head">Demo account</p>
            <a className="footer-top-links" href="/signup">Create or sign in</a>
            <a className="footer-top-links" href="/product">Explore features</a>
          </div>
        </div>

        {/* Legal */}
        <div className="pt-4" style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>
          <p>
            Finovate is a paper-trading software demo. It does not accept customer funds or send orders to a broker or exchange. Quotes are simulated, and AI-generated content may be incomplete or incorrect.
          </p>
          <div className="d-flex flex-wrap gap-3 mt-3 mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
            <a href="/demo-info" style={{ color: "inherit", textDecoration: "none" }}>Demo and data information</a>
            <a href="/support" style={{ color: "inherit", textDecoration: "none" }}>Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
