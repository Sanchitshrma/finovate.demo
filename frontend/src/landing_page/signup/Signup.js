import React, { useState } from "react";
import OpenAccount from "../OpenAccount";
import axios from "axios";
import Toast from "../../components/Toast";

// Environment variables for API URLs (with production fallbacks)
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://finovate-uh8i.onrender.com"
    : "http://localhost:8000");

const DASHBOARD_URL =
  process.env.REACT_APP_DASHBOARD_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://finovate-dashboard.vercel.app"
    : "http://localhost:3000");

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "#ef4444" };
    if (strength <= 4) return { strength, label: "Medium", color: "#f59e0b" };
    return { strength, label: "Strong", color: "#10b981" };
  };

  const passwordStrength = getPasswordStrength(password);
  function signupHandler() {
    setLogin(false);
  }
  function loginHandler() {
    setLogin(true);
  }
  async function signup() {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Email validation
    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 10) {
      setPasswordError("Password must be at least 10 characters long.");
      valid = false;
    } else if (!login) {
      // Strict validation only for signup
      if (!/(?=.*[a-z])/.test(password)) {
        setPasswordError(
          "Password must contain at least one lowercase letter."
        );
        valid = false;
      } else if (!/(?=.*[A-Z])/.test(password)) {
        setPasswordError(
          "Password must contain at least one uppercase letter."
        );
        valid = false;
      } else if (!/(?=.*\d)/.test(password)) {
        setPasswordError("Password must contain at least one number.");
        valid = false;
      }
    }

    // Confirm password validation (only for signup)
    if (!login) {
      if (!confirmPassword) {
        setConfirmPasswordError("Please confirm your password.");
        valid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
        valid = false;
      }
    }

    if (!valid) {
      showToast("Please fix the errors in the form.", "error");
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    setIsSubmitting(true);
    try {
      if (!login) {
        const res = await axios.post(`${BACKEND_URL}/signup`, data);
        if (!res.data.handoffCode) {
          throw new Error("The sign-in handoff could not be created.");
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("Account created successfully! Redirecting...", "success");
        setRedirecting(true);
        setTimeout(() => {
          const redirectUrl = `${DASHBOARD_URL}?handoff=${encodeURIComponent(res.data.handoffCode)}`;
          window.location.href = redirectUrl;
        }, 800);
      } else {
        const res = await axios.post(`${BACKEND_URL}/login`, data);
        if (!res.data.handoffCode) {
          throw new Error("The sign-in handoff could not be created.");
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("Login successful! Redirecting...", "success");
        setRedirecting(true);
        setTimeout(() => {
          const redirectUrl = `${DASHBOARD_URL}?handoff=${encodeURIComponent(res.data.handoffCode)}`;
          window.location.href = redirectUrl;
        }, 800);
      }
    } catch (error) {
      // Reset request-level state and map server error to form feedback.
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");

      if (axios.isAxiosError(error) && error.response) {
        const msg = error.response.data?.message ?? "An unexpected error occurred.";

        if (error.response.status === 400 || error.response.status === 409) {
          // Map known error messages to specific fields for UX.
          if (msg.toLowerCase().includes("account already") || msg.toLowerCase().includes("user already")) {
            setEmailError(msg);
          } else if (msg.toLowerCase().includes("password")) {
            setPasswordError(msg);
          } else {
            showToast(msg, "error");
          }
        } else if (error.response.status === 401 || error.response.status === 403) {
          setPasswordError("Invalid email or password. Please try again.");
        } else {
          showToast("An unexpected error occurred. Please try again.", "error");
        }
      } else {
        showToast("Network error. Please check your connection.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  function passwordHanlder(event) {
    setPassword(event.target.value);
  }
  function emailHanlder(event) {
    setEmail(event.target.value);
  }
  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
      {(redirecting || isSubmitting) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.85)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="spinner-border text-primary"
            role="status"
            aria-label="Loading"
          />
          <p className="mt-3 text-muted">
            {redirecting ? "Redirecting to dashboard…" : "Processing…"}
          </p>
        </div>
      )}
      <div className="container mb-5">
        <div
          className="text-center py-5"
          style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #fafafe 60%, #fff 100%)", borderRadius: "0 0 24px 24px", marginBottom: "2rem" }}
        >
          <span className="section-tag">Paper-trading demo</span>
          <h1 className="fw-bold mt-3 mb-2" style={{ fontSize: "2.25rem", letterSpacing: "-0.5px" }}>
            Create a demo account
          </h1>
          <p className="fs-5 text-muted" style={{ maxWidth: 540, margin: "0 auto" }}>
            Sign in to a simulated trading workspace. This does not open a demat
            account or connect you to a broker.
          </p>
        </div>
        <div className="row g-4 px-3 px-md-5">
          <div className="col-12 col-lg-6 d-flex align-items-center">
            <div className="feature-card p-4 p-md-5">
              <h2 className="h4 fw-bold">Practice with virtual data</h2>
              <p className="text-muted">Create a demo login to explore a watchlist, simulated orders, holdings, and stock insight previews.</p>
              <p className="text-muted mb-0">No deposits are accepted and no real orders are placed.</p>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="signup-form-card">
            <h2 className="mb-2">{login ? "Sign in to the demo" : "Create demo login"}</h2>
            <span style={{ display: "flex", flexWrap: "wrap" }}>
              {!login ? (
                <>
                  <p className="mb-3">
                    For existing user{" "}
                    <button
                      onClick={loginHandler}
                      className="btn btn-primary btn-md"
                    >
                      login
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-3">
                    For new user{" "}
                    <button
                      onClick={signupHandler}
                      className="btn btn-primary btn-md"
                    >
                      Signup
                    </button>
                  </p>
                </>
              )}
            </span>

            <div className="form-floating mb-3">
              <input
                onChange={emailHanlder}
                value={email}
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email address</label>
              {emailError && (
                <div className="text-danger mt-1">{emailError}</div>
              )}
            </div>
            <div className="form-floating position-relative">
              <input
                onChange={passwordHanlder}
                value={password}
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                style={{ paddingRight: "4rem" }}
              />
              <label htmlFor="floatingPassword">Password</label>
              <div
                className="position-absolute"
                style={{
                  top: "50%",
                  right: "0.5rem",
                  transform: "translateY(-50%)",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-2 py-1 mt-5 shadow-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {passwordError && (
                <div className="text-danger mt-1">{passwordError}</div>
              )}
              {!login && password && (
                <div className="mt-2" style={{ fontSize: "13px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "4px",
                        backgroundColor: "#e5e7eb",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(passwordStrength.strength / 6) * 100}%`,
                          height: "100%",
                          backgroundColor: passwordStrength.color,
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: passwordStrength.color,
                        fontWeight: "500",
                      }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
              {!login && !passwordError && (
                <div
                  className="mt-2"
                  style={{ fontSize: "12px", color: "#6b7280" }}
                >
                  Use 10 or more characters with uppercase, lowercase, and a number
                </div>
              )}
              {!login && (
                <div className="form-floating mt-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label>Confirm Password</label>
                  {confirmPasswordError && (
                    <div className="text-danger mt-1">
                      {confirmPasswordError}
                    </div>
                  )}
                </div>
              )}
              <div className="col-auto">
                <button
                  onClick={signup}
                  type="button"
                  className="btn btn-primary btn-lg mb-3 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Please wait..."
                    : login
                    ? "Sign in"
                    : "Create demo login"}
                </button>
                <p className="mt-3 text-muted">
                  Read what the demo stores and how simulated data works{" "}
                  <a href="/demo-info" style={{ textDecoration: "none" }}>here</a>.
                </p>
              </div>
            </div>
            </div>{/* /signup-form-card */}
          </div>
        </div>
        <div className="row text-center p-3 p-md-5">
          <span className="section-tag">Features available in the demo</span>
          <h2 className="fw-bold mt-3 mb-4" style={{ fontSize: "1.75rem" }}>
            Explore the paper-trading workspace
          </h2>
          <div className="row g-4 p-3 p-md-5">
            <div className="col-12 col-md-6">
              <i className="fa-solid fa-star" aria-hidden="true" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
              <div className="mt-2">
                <h2>Watchlist</h2>
                <p className="fs-6 text-muted">
                  Add supported symbols to a personal demo watchlist.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <i className="fa-solid fa-chart-pie" aria-hidden="true" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
              <div className="mt-2">
                <h2>Portfolio</h2>
                <p className="fs-6 text-muted mt-1">
                  Review holdings and positions created by simulated orders.
                </p>
              </div>
            </div>
            <div className="row g-4 p-3 p-md-5">
              <div className="col-12 col-md-6">
                <i className="fa-solid fa-receipt" aria-hidden="true" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
                <div className="mt-2">
                  <h2>Paper orders</h2>
                  <p className="fs-6 text-muted">
                    View order records created in the demo. No real order is sent.
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
                <div className="mt-2">
                  <h2>AI insight preview</h2>
                  <p className="fs-6 text-muted">
                    Generated summaries may be incomplete or incorrect.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <a href="/product" className="btn btn-lg rounded-pill signup-cta">Explore demo features</a>
          </div>
        </div>
        <div className="row mb-5 p-3 p-md-5 border-top border-bottom">
          <div className="text-center">
            <span className="section-tag">How it works</span>
            <h2 className="fw-bold mt-3 mb-4" style={{ fontSize: "1.75rem" }}>
              How to use the demo
            </h2>
          </div>
          <div className="col-12 col-lg-6 mt-4">
            <div className="feature-card h-100 d-flex align-items-center justify-content-center p-5">
              <i className="fa-solid fa-list-check" aria-hidden="true" style={{ fontSize: "4rem", color: "var(--color-primary)" }}></i>
            </div>
          </div>
          <div className="col-12 col-lg-6 mb-4 d-flex flex-column gap-3 justify-content-center">
            {[
              { num: "01", text: "Create a demo login" },
              { num: "02", text: "Add a supported symbol to your watchlist" },
              { num: "03", text: "Place a simulated order and review the portfolio" },
            ].map((step) => (
              <div key={step.num} className="feature-card d-flex align-items-center gap-3">
                <span
                  className="fw-bold gradient-text"
                  style={{ fontSize: "1.5rem", minWidth: 36 }}
                >
                  {step.num}
                </span>
                <span className="fw-medium" style={{ fontSize: "1.05rem" }}>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="row p-3 p-md-5 mb-5">
          <div className="col-12 col-lg-6 mt-4">
            <h1 className="mt-4 text-muted">
              What to know about this prototype
            </h1>
          </div>
          <div className="col-12 col-lg-6" style={{ lineHeight: "2rem" }}>
            <h2 className="mb-3">Virtual funds only</h2>
            <p className="text-muted mb-4">
              The displayed balance is for practice and cannot be deposited or withdrawn.
            </p>
            <h2 className="mb-3">Simulated execution</h2>
            <p className="text-muted mb-4">
              Orders update demo records only; no broker or exchange receives them.
            </p>
            <h2 className="mb-3">Quote and AI limits</h2>
            <p className="text-muted mb-4">
              Prices may be delayed or simulated. AI-generated text can be incomplete or wrong.
            </p>
          </div>
        </div>
        {/* <div className="row">
        <h1>FAQs</h1>
      </div> */}
        <OpenAccount />
      </div>
    </>
  );
}

export default Signup;
