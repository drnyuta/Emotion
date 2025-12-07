import { NavLink } from "react-router-dom";
import { menuItems, MenuItem } from "../../constants/menuItems";
import BurgerIcon from "../../assets/icons/burger-menu.svg";

import "./Sidebar.scss";

export const Sidebar = () => (
  <aside className="sidebar">
    <img className="sidebar__logo" src={BurgerIcon} alt="logo" />
    <nav className="sidebar__nav">
      <ul className="sidebar__nav-list">
        {menuItems.map((item: MenuItem) => (
          <li key={item.label} className="sidebar__nav-list-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `sidebar__nav-list-item-link ${
                  isActive ? "sidebar__nav-list-item-link--active" : ""
                }`
              }
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
);
