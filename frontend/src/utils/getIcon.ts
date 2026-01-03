import FlowerIcon from "../assets/icons/flower.png";
import DiscoIcon from "../assets/icons/disco-ball.png";
import { Report } from "../globalInterfaces";

export const getIcon = (report: Report) => {
    if (report.type === "daily") {
      return FlowerIcon;
    }
    return DiscoIcon;
  };