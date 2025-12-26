import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MENU_ITEMS, MenuItem } from "../../constants/menuItems";
import BurgerIcon from "../../assets/icons/burger-menu.svg";
import "./Sidebar.scss";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
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
        </header>
      )}

      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          {!isMobile && (
            <button className="sidebar__burger-menu">
              <img
                className="sidebar__burger-menu-icon"
                src={BurgerIcon}
                alt="burger menu"
              />
            </button>
          )}
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
          </ul>
        </nav>
      </aside>
    </>
  );
};