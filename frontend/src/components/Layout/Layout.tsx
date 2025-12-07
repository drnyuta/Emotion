import { ReactNode } from "react";
import { Sidebar } from "../Sidebar/Sidebar";

interface SidebarLayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout__content">{children}</main>
    </div>
  );
};
