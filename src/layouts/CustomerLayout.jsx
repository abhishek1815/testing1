import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./CustomerLayout.css";

const NAV_LINKS = [
  { label: "Explore", to: "/home", key: "home" },
  { label: "AI Suggest", to: "/ai-suggest", key: "ai-suggest" },
];

const BOTTOM_ITEMS = [
  { label: "Home", to: "/home", icon: "home", key: "home" },
  { label: "Search", to: "/home", icon: "search", key: "search" },
  { label: "AI Suggest", to: "/ai-suggest", icon: "auto_awesome", key: "ai-suggest" },
  { label: "Orders", to: "/orders", icon: "shopping_bag", key: "orders" },
  { label: "Profile", to: "/profile", icon: "person", key: "profile" },
];

function CustomerNavbar() {
  const { pathname } = useLocation();
  const { user, profile } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="customer-navbar">
      <div className="customer-navbar-inner">
        {/* Left: Logo + Location */}
        <div className="customer-nav-left">
          <Link to="/home" className="customer-logo">QuickBite</Link>
          <div className="customer-location-pill">
            <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "var(--primary)" }}>location_on</span>
            <span>Patna, Bihar</span>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>expand_more</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="customer-search-wrapper">
          <div className="customer-search-icon">
            <span className="material-symbols-outlined" style={{ color: "var(--on-surface-variant)", fontSize: "18px" }}>search</span>
          </div>
          <input
            className="customer-search-input"
            type="text"
            placeholder="Search food or restaurants..."
          />
          <div className="customer-search-ai">
            <span className="material-symbols-outlined" style={{ color: "var(--ai-glow)", fontSize: "17px" }}>auto_awesome</span>
          </div>
        </div>

        {/* Right: Nav + Actions */}
        <div className="customer-nav-right">
          <nav className="customer-nav-links">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                to={link.to}
                className={`customer-nav-link ${pathname.startsWith(link.to) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart */}
          <Link to="/cart" className="customer-nav-icon-btn" style={{ textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--on-surface-variant)", fontSize: "22px" }}>shopping_cart</span>
            {totalItems > 0 && <span className="customer-cart-badge">{totalItems}</span>}
          </Link>

          {/* Notifications */}
          <button className="customer-nav-icon-btn">
            <span className="material-symbols-outlined" style={{ color: "var(--on-surface-variant)", fontSize: "22px" }}>notifications</span>
          </button>

          {/* Avatar */}
          <Link to="/profile" className="customer-avatar-link">
            <img
              src={profile?.profileImage || user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
              alt="Profile"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

function CustomerBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="customer-bottom-nav">
      {BOTTOM_ITEMS.map((item) => {
        const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <Link
            key={item.key}
            to={item.to}
            className={`customer-bottom-item ${isActive ? "active" : ""}`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "24px",
                fontVariationSettings: isActive
                  ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                  : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              }}
            >{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function CustomerLayout() {
  return (
    <div className="customer-layout">
      <CustomerNavbar />
      <main className="customer-content">
        <Outlet />
      </main>
      <CustomerBottomNav />
    </div>
  );
}
