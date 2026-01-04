import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import SparksIcon from "../../assets/icons/yellow-sparks.svg";
import "./WelcomePage.scss";

export const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem("hasVisitedBefore", "true");
    
    navigate("/login");
  };

  return (
    <div className="welcome-page">
      <div className="welcome-page__content">
        <div className="welcome-page__header">
          <h1>Welcome to Emotion!</h1>
          <img src={SparksIcon} alt="icon" className="welcome-page__icon" />
        </div>
        <p>Your emotions matter. </p>
        <p>
          Here you can observe your feelings, reflect on your day, and
          understand yourself a little deeper.
        </p>
        <p>Let's begin your journey toward emotional clarity.</p>
        <Button
          text="Start exploring"
          onClick={handleStart}
          variant="blue"
          size="large"
          fullWidth={false}
        />
      </div>
    </div>
  );
};