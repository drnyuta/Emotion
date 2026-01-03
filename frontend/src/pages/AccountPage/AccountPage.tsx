import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, message, Modal } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { getCurrentStreak, getLongestStreak } from "../../api/streak";
import "./AccountPage.scss";
import { Streak } from "../../globalInterfaces";
import { RingLoader } from "react-spinners";
import SparksIcon from "../../assets/icons/yellow-sparks.svg";
import { formatStreak } from "../../utils/formatStreak";
import { Button } from "../../components/Button/Button";
import DeleteIcon from "../../assets/icons/red-bin.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import { deleteAccount } from "../../api/auth";
import { handleAxiosError } from "../../utils/handleAxiosError";

export const AccountPage = () => {
  const { email, logoutContext } = useAuth();
  const navigate = useNavigate();

  const [currentStreak, setCurrentStreak] = useState<Streak | null>(null);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStreakData = async () => {
      try {
        const [current, longest] = await Promise.all([
          getCurrentStreak(),
          getLongestStreak(),
        ]);
        setCurrentStreak(current);
        setLongestStreak(longest);
      } catch (e) {
        console.error("Failed to load streak info", e);
      } finally {
        setLoading(false);
      }
    };

    loadStreakData();
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: "Log out",
      content: "Are you sure you want to log out?",
      okText: "Log out",
      cancelText: "Cancel",
      centered: true,
      onOk: () => {
        logoutContext();
        navigate("/login", { replace: true });
      },
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete account",
      content:
        "Are you sure you want to delete your account? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteAccount();
          message.success("Account successfully deleted");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.href = "/login";
        } catch (error: unknown) {
          handleAxiosError(error, "Failed to delete account");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="account-page__loader">
        <RingLoader color="#7c3aed" size={60} />
      </div>
    );
  }

  return (
    <div className="account-page">
      <h1 className="account-page__title">Account</h1>

      <Card className="account-card">
        <h3 className="card-title">Email</h3>
        <p className="account-email">{email}</p>
      </Card>

      <Card className="account-card">
        <h3 className="streak-title">
          <img src={SparksIcon} alt="icon" />
          Your Spark
        </h3>
        <p className="streak-description">
          Spark is your daily reflection — a small action that keeps your streak
          alive. Write one short thought or emotion each day to stay consistent
          and build emotional clarity over time.
        </p>

        <div className="streak-info">
          <div className="streak-row">
            <p>Current streak: </p>
            <strong className="streak-row__value">
              {formatStreak(currentStreak?.streakLength || 0)}
            </strong>
          </div>

          <div className="streak-row">
            <p>Best streak: </p>
            <strong className="streak-row__value">
              {formatStreak(longestStreak)}
            </strong>
          </div>
        </div>
      </Card>

      <Card className="account-card">
        <h3 className="card-title">Actions</h3>

        <div className="account-actions">
          <Button
            variant="custom"
            size="small"
            backgroundColor="#eeccffff"
            textColor="#000"
            hoverBackgroundColor="#dc9bffff"
            hoverTextColor="#000"
            text="Logout"
            icon={<img src={LogoutIcon} />}
            iconPosition="left"
            onClick={() => handleLogout()}
          />

          <Button
            text="Delete account"
            size="small"
            variant="custom"
            textColor="#fff"
            backgroundColor="#000"
            hoverBackgroundColor="#353535ff"
            icon={<img src={DeleteIcon} alt="delete icon" />}
            iconPosition="right"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          />
        </div>
      </Card>
    </div>
  );
};
