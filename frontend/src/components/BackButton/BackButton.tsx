import { useNavigate } from "react-router-dom";
import BackArrow from "../../assets/icons/arrow-left.svg";
import "./BackButton.scss";

export const BackButton = ({ onClick }: { onClick?: () => void }) => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(-1) || onClick}>
      <img src={BackArrow} alt="go back" />
    </button>
  );
};