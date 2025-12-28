import { Button } from "../../components/Button/Button";
import Emoji from "../../assets/icons/sad-face.svg";
import { useNavigate } from "react-router-dom";
import "./NotFound.scss";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <img src={Emoji} alt="icon" className="not-found__icon" />
      <h2>Not found</h2>
      <p>The page you’re looking for doesn’t exist or may have been moved.</p>
      <p>Please check the URL or return to the homepage.</p>
      <Button
        text="Go Home"
        onClick={() => navigate("/diary")}
        variant="blue"
        size="large"
      />
    </div>
  );
};
