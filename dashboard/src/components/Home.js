import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      document.body.classList.toggle("theme-dark", settings.darkMode === true);
    } catch {
      document.body.classList.remove("theme-dark");
    }
  }, []);

  useEffect(() => {
    // Clean up obsolete sign-in parameters if a user opens an older redirect URL.
    const params = new URLSearchParams(location.search);
    if (params.has('token') || params.has('user') || params.has('handoff')) {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
