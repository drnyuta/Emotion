import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Modal } from "antd";

import { MENU_ITEMS, MenuItem } from "../../constants/menuItems";
import BurgerIcon from "../../assets/icons/burger-menu.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import SparksIcon from "../../assets/icons/yellow-sparks.svg";

import { useAuth } from "../../hooks/useAuth";
import { getCurrentStreak } from "../../api/streak";

import "./Sidebar.scss";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 980
  );
  const [streakDays, setStreakDays] = useState(0);

  const { logoutContext } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 980);

      if (width <= 768) {
        setIsCollapsed(false);
        setIsOpen(false);
      } else if (width <= 980) {
        setIsCollapsed(true);
        setIsOpen(false);
      } else {
        setIsCollapsed(false);
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadStreakData = async () => {
      try {
        const current = await getCurrentStreak();
        setStreakDays(current?.streakLength || 0);
      } catch (e) {
        console.error("Failed to load streak info", e);
      }
    };

    loadStreakData();
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen((prev) => !prev);
    } else if (isTablet) {
      setIsOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const closeSidebar = () => {
    if (isMobile || isTablet) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Log out",
      content: "Are you sure you want to log out?",
      okText: "Log out",
      cancelText: "Cancel",
      centered: true,
      onOk: () => {
        logoutContext();
        navigate("/login", { replace: true });
        closeSidebar();
      },
    });
  };

  return (
    <>
      {isMobile && (
        <header className="mobile-header">
          <button
            className="mobile-header__burger"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <img
              className="mobile-header__burger-icon"
              src={BurgerIcon}
              alt="menu"
            />
          </button>

          <div className="streak-indicator">
            <p className="streak-indicator__value">{streakDays}</p>
            <img
              src={SparksIcon}
              alt="icon"
              className="streak-indicator__icon"
            />
          </div>
        </header>
      )}

      {(isMobile || isTablet) && isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <aside
        className={`sidebar 
          ${isOpen ? "sidebar--open" : ""} 
          ${isCollapsed ? "sidebar--collapsed" : ""}
          ${isTablet ? "sidebar--tablet" : ""}
        `}
      >
        <div className="sidebar__header">
          <button className="sidebar__burger-menu" onClick={toggleSidebar}>
            <img
              className="sidebar__burger-menu-icon"
              src={BurgerIcon}
              alt="burger menu"
            />
          </button>

          <div className="streak-indicator">
            <p className="streak-indicator__value">{streakDays}</p>
            <img
              src={SparksIcon}
              alt="icon"
              className="streak-indicator__icon"
            />
          </div>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {MENU_ITEMS.map((item: MenuItem) => (
              <li key={item.label} className="sidebar__nav-list-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar__nav-list-item-link ${
                      isActive ? "sidebar__nav-list-item-link--active" : ""
                    }`
                  }
                  onClick={closeSidebar}
                >
                  <span className="sidebar__nav-list-item-link__icon">
                    <img src={item.icon} alt={item.label} />
                  </span>
                  <span className="sidebar__nav-list-item-link__label">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}

            <li className="sidebar__nav-list-item sidebar__nav-list-item--logout">
              <button
                type="button"
                className="sidebar__nav-list-item-link sidebar__logout-button"
                onClick={handleLogout}
              >
                <span className="sidebar__nav-list-item-link__icon">
                  <img src={LogoutIcon} alt="Logout" />
                </span>
                <span className="sidebar__nav-list-item-link__label">
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};
