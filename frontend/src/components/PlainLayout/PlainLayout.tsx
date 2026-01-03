import "./PlainLayout.scss";
import { Outlet } from "react-router-dom";

export const PlainLayout: React.FC = () => {
  return (
    <div className="plain-layout">
      <Outlet />
    </div>
  );
};
