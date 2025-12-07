import DiaryIcon from "../assets/icons/diary.svg";
import QuestionIcon from "../assets/icons/question-mark.svg";
import HappyFaceIcon from "../assets/icons/happy-face.svg";
import AnalyticsIcon from "../assets/icons/analytics.svg";
import SparkIcon from "../assets/icons/spark.svg";
import UserIcon from "../assets/icons/user.svg";
import LightbulbIcon from "../assets/icons/lightbulb.svg";

export interface MenuItem {
  label: string;
  icon: string;
  path: string;
}

export const menuItems: MenuItem[] = [
  { label: "Diary", icon: DiaryIcon, path: "/diary" },
  { label: "Question Of The Day", icon: QuestionIcon, path: "/questions" },
  { label: "Emotion Wheel", icon: HappyFaceIcon, path: "/emotion-wheel" },
  { label: "Analytics", icon: AnalyticsIcon, path: "/analytics" },
  { label: "AI Reports", icon: SparkIcon, path: "/reports" },
  { label: "Insights", icon: LightbulbIcon, path: "/insights" },
  { label: "My Account", icon: UserIcon, path: "/account" },
];
