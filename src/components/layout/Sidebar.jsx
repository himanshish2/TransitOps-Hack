import { NavLink } from 'react-router-dom';
import { FiGrid, FiTruck, FiUsers, FiX } from 'react-icons/fi';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/vehicles', label: 'Vehicles', icon: FiTruck },
  { to: '/drivers', label: 'Drivers', icon: FiUsers },
];

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  return (
    <>
      {isMobileOpen && <div className="sidebar-backdrop d-lg-none" onClick={onCloseMobile} />}

      <aside className={`transitops-sidebar ${isMobileOpen ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">T</span>
          <span className="sidebar-brand-text">TransitOps</span>
          <button
            type="button"
            className="btn-icon d-lg-none ms-auto"
            aria-label="Close navigation menu"
            onClick={onCloseMobile}
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
