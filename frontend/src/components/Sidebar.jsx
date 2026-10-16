import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  ChartNoAxesCombined,
  Menu,
  BookCopy,
  Bell,
  ShieldCheck,
  UserRound,
  UserPlus,
  LogIn,
  X,
  ChevronRight,
} from "lucide-react";

import { sidebarStyles as s } from "../assets/dummyStyles";

const iconMap = {
  dashboard: ChartNoAxesCombined,
  books: BookCopy,
  alerts: Bell,
  admin: ShieldCheck,
  users: UserRound,
};

const footerIconMap = {
  signup: UserPlus,
  login: LogIn,
};

const Sidebar = ({
  title,
  subtitle,
  badge,
  navItems = [],
  footerItems = [],
  accent = "user",
  logoSrc,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const badgeStyles = accent === "admin" ? s.badgeAdmin : s.badgeUser;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // FIX: close on Escape while the drawer is open
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={s.mobileMenuButton}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu size={18} />
      </button>

      <div
        className={`${s.mobileOverlay} ${
          open ? s.mobileOverlayOpen : s.mobileOverlayClosed
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`${s.sidebar} ${open ? s.sidebarOpen : s.sidebarClosed}`}
      >
        <div className={s.sidebarHeader}>
          <div className="min-w-0 pr-3">
            <div className={s.logoWrapper}>
              {logoSrc ? (
                <img src={logoSrc} alt="Logo" className={s.logoImage} />
              ) : (
                <BookCopy size={22} />
              )}
            </div>

            <h2 className={s.title}>{title}</h2>

            <p className={s.subtitle}>{subtitle}</p>

            {badge && (
              <span className={`${s.badgeBase} ${badgeStyles}`}>{badge}</span>
            )}
          </div>

          <button
            onClick={() => setOpen(false)}
            type="button"
            className={s.closeButton}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className={s.nav}>
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] ?? ChevronRight;

            const active =
              location.pathname === item.href ||
              (item.match && item.match !== "/"
                ? location.pathname.startsWith(item.match)
                : false);

            return (
              <Link
                key={item.href ?? item.label}
                to={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`${s.navLink} ${
                  active ? s.navLinkActive : s.navLinkInactive
                }`}
              >
                <span
                  className={`${s.navIconWrapper} ${
                    active ? s.navIconWrapperActive : s.navIconWrapperInactive
                  }`}
                >
                  <Icon size={18} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className={s.navLabel}>{item.label}</span>

                  <span
                    className={`${s.navDescription} ${
                      active ? s.navDescriptionActive : s.navDescriptionInactive
                    }`}
                  >
                    {item.description}
                  </span>
                </span>

                <ChevronRight
                  size={16}
                  className={active ? s.navChevronActive : s.navChevronInactive}
                />
              </Link>
            );
          })}
        </nav>

        <div className={s.footer}>
          {footerItems.map((item) => {
            const Icon = footerIconMap[item.icon] ?? LogIn;
            const itemKey = item.href ?? item.label;

            if (item.action) {
              return (
                <button
                  key={itemKey}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    item.action();
                  }}
                  className={`${s.footerButton} ${
                    item.kind === "primary"
                      ? s.footerButtonPrimary
                      : s.footerButtonSecondary
                  }`}
                >
                  <span className={s.footerIconWrapper}>
                    <Icon size={16} />
                    {item.label}
                  </span>

                  <ChevronRight size={16} />
                </button>
              );
            }

            return (
              <Link
                key={itemKey}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`${s.footerLink} ${
                  item.kind === "primary"
                    ? s.footerLinkPrimary
                    : s.footerLinkSecondary
                }`}
              >
                <span className={s.footerIconWrapper}>
                  <Icon size={16} />
                  {item.label}
                </span>

                <ChevronRight size={16} />
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
