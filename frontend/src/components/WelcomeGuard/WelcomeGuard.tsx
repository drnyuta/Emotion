import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface WelcomeGuardProps {
  children: React.ReactNode;
}

export const WelcomeGuard = ({ children }: WelcomeGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    
    if (!hasVisited && location.pathname !== "/welcome") {
      navigate("/welcome", { replace: true });
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
};