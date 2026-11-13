import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/axios";
import CircularProgress from "@mui/material/CircularProgress";

const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://finovate-one.vercel.app'
    : 'http://localhost:3001');

const handoffExchanges = new Map();

const exchangeHandoff = (code) => {
  if (!handoffExchanges.has(code)) {
    const request = api
      .post("/auth/handoff/exchange", { code })
      .finally(() => handoffExchanges.delete(code));
    handoffExchanges.set(code, request);
  }
  return handoffExchanges.get(code);
};

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const verifyToken = async () => {
      const params = new URLSearchParams(location.search);
      const handoffCode = params.get("handoff");

      try {
        if (handoffCode) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);

          const { data } = await exchangeHandoff(handoffCode);
          if (!data?.token || !data?.user) {
            throw new Error("The sign-in handoff did not return a session.");
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No active session.");
        }

        await api.get("/verify");
        if (active) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (active) {
          setIsAuthenticated(false);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    verifyToken();

    return () => {
      active = false;
    };
  }, [location.search]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "12px",
          color: "#666",
        }}
        aria-live="polite"
      >
        <CircularProgress color="primary" />
        <div>Loading your dashboard…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = `${FRONTEND_URL}/signup`;
    return null;
  }

  return children;
};

export default ProtectedRoute;
