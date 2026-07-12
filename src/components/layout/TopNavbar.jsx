// src/components/layout/TopNavbar.jsx

import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  FiMenu,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getRoleLabel } from "../../utils/roleUtils";

import ThemeToggle from "./ThemeToggle";

import "./TopNavbar.css";

export default function TopNavbar({
  onOpenMobileSidebar,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((namePart) => namePart[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="transitops-topnavbar">
      <button
        type="button"
        className="btn-icon d-lg-none"
        aria-label="Open navigation menu"
        onClick={onOpenMobileSidebar}
      >
        <FiMenu size={18} />
      </button>

      <div className="ms-auto d-flex align-items-center gap-md">
        <ThemeToggle />

        <div
          className="position-relative"
          ref={dropdownRef}
        >
          <button
            type="button"
            className="profile-trigger"
            onClick={() =>
              setIsDropdownOpen(
                (previous) => !previous
              )
            }
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <span className="profile-avatar">
              {initials}
            </span>

            <span className="d-none d-md-flex flex-column align-items-start">
              <span className="profile-name">
                {user?.name}
              </span>

              <span className="profile-role">
                {getRoleLabel(user?.role)}
              </span>
            </span>

            <FiChevronDown size={14} />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu show profile-dropdown-menu">
              <div className="dropdown-item-text">
                <div className="fw-medium">
                  {user?.name}
                </div>

                <div
                  className="text-muted-custom"
                  style={{
                    fontSize:
                      "var(--font-size-xs)",
                  }}
                >
                  {user?.email}
                </div>
              </div>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-item d-flex align-items-center gap-sm"
                onClick={handleLogout}
              >
                <FiLogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}