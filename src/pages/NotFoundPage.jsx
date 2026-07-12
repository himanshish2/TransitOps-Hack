import React from "react";
import { useNavigate } from "react-router-dom";
import { FiTruck, FiArrowLeft } from "react-icons/fi";

import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-brand">
        <div className="notfound-brand-icon">
          <FiTruck />
        </div>
        <span className="notfound-brand-name">TransitOps</span>
      </div>

      <h1 className="notfound-code">404</h1>
      <h2 className="notfound-title">Page not found</h2>
      <p className="notfound-message">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <button
        type="button"
        className="notfound-button"
        onClick={() => navigate("/dashboard")}
      >
        <FiArrowLeft />
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
