import { Sidebar } from "../Sidebar/Sidebar";
import "./Layout.scss";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
};
