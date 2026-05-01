import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Milk,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/customers", icon: Users, label: "Customers" },
  { to: "/entries", icon: BookOpen, label: "Entries" },
  { to: "/bills", icon: FileText, label: "Bills" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const themeIcons = { light: Sun, dark: Moon, system: Monitor };

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] z-50 transform transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        <div
          className="flex items-center gap-3 px-5 h-14"
          style={{ borderBottom: "1px solid var(--sidebar-border)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--sidebar-accent)" }}
          >
            <Milk className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2
              className="font-heading font-semibold text-sm"
              style={{ color: "var(--sidebar-text-active)" }}
            >
              DairyDesk
            </h2>
            <p className="text-[10px]" style={{ color: "var(--sidebar-text)" }}>
              Bill Manager
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm font-medium transition-all ${
                  isActive ? "" : "hover:bg-[var(--sidebar-active-bg)]"
                }`
              }
              style={({ isActive }) => ({
                color: isActive
                  ? "var(--sidebar-text-active)"
                  : "var(--sidebar-text)",
                backgroundColor: isActive
                  ? "var(--sidebar-active-bg)"
                  : "transparent",
                borderLeft: isActive
                  ? "3px solid var(--sidebar-accent)"
                  : "3px solid transparent",
              })}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-4"
          style={{ borderTop: "1px solid var(--sidebar-border)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--sidebar-accent)" }}
            >
              <span className="text-sm font-semibold text-white">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--sidebar-text-active)" }}
              >
                {user?.displayName || "User"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--sidebar-text)" }}
              >
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onLogout();
              navigate("/login");
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors"
            style={{ color: "var(--sidebar-text)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-danger)";
              e.currentTarget.style.backgroundColor = "rgba(192,57,43,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--sidebar-text)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "Dashboard";
    if (path.startsWith("/customers")) return "Customers";
    if (path.startsWith("/entries")) return "Entries";
    if (path.startsWith("/bills")) return "Bills";
    if (path.startsWith("/settings")) return "Settings";
    return "DairyDesk";
  };

  const cycleTheme = () => {
    const next =
      theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const ThemeIcon = themeIcons[theme] || Monitor;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={logout}
      />

      <div className="lg:ml-[260px] min-h-screen pb-20 lg:pb-0">
        <header
          className="sticky top-0 z-30 border-b"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-light)",
            boxShadow: "var(--shadow-header)",
          }}
        >
          <div className="flex items-center justify-between h-14 px-4 max-w-desktop mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1
                className="font-heading font-semibold text-[20px]"
                style={{ color: "var(--text-primary)" }}
              >
                {getPageTitle()}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={cycleTheme}
                className="p-2 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-card-alt)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title={`Current: ${resolvedTheme}. Click to switch.`}
              >
                <ThemeIcon className="w-4 h-4" />
              </button>
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border"
                style={{ borderColor: "var(--border-light)" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <span className="text-[10px] font-semibold text-white">
                    {user?.displayName?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "U"}
                  </span>
                </div>
                <span
                  className="text-xs truncate max-w-32"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user?.displayName?.split(" ")[0] || "User"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="px-3 py-4 sm:px-4 sm:py-6 max-w-desktop mx-auto page-enter">
          {children}
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 border-t z-40 no-print lg:hidden safe-bottom"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-light)",
        }}
      >
        <div className="flex justify-around items-center h-[60px] max-w-desktop mx-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className="flex flex-col items-center justify-center gap-0.5 w-full h-full relative"
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-b"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                )}
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--text-muted)",
                  }}
                />
                <span
                  className="text-[10px]"
                  style={{
                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
