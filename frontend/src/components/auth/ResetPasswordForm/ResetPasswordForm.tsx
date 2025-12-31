/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Input, Modal } from "antd";
import { validatePassword } from "../../../utils/validation/validatePassword";
import { resetPassword } from "../../../api/auth";
import { Button } from "../../Button/Button";

import lock from "../../../assets/icons/lock.svg";

import "./ResetPasswordForm.scss";

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setFormError("Password reset token is missing from the URL.");
    }
  }, [location.search]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordError("");
    setConfirmPasswordError("");
    setFormError("");

    if (!token) {
      setFormError("Password reset token is missing. Cannot proceed.");
      setIsSubmitting(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      await resetPassword(token, password);
      setPassword("");
      setConfirmPassword("");

      Modal.success({
        title: "Your password has been successfully reset!",
        content: "Log in to continue.",
        centered: true,
        okText: "OK",
        onOk: () => navigate("/login", { replace: true }),
      });
    } catch (error: any) {
      setFormError(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form autoComplete="on" onSubmit={handleReset} className="auth-form">
      <div className="auth-form__header">
        <h2>Reset password</h2>
        <p>Create a new password</p>
      </div>

      <div className="auth-form__content">
        {formError && <p className="auth-form__error">{formError}</p>}

        <div className="auth-form__field">
          <Input
            placeholder="Password"
            type="password"
            value={password}
            suffix={<img src={lock} alt="password icon" />}
            className={passwordError ? "input-error" : ""}
            onChange={handlePasswordChange}
            disabled={isSubmitting || !token}
          />
          {!passwordError && (
            <p className="auth-form__hint">
              Minimum 8 characters, including a capital letter and a number
            </p>
          )}
          {passwordError && <p className="auth-form__error">{passwordError}</p>}
        </div>

        <div className="auth-form__field">
          <Input
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            suffix={<img src={lock} alt="confirm password icon" />}
            className={confirmPasswordError ? "input-error" : ""}
            onChange={handleConfirmPasswordChange}
            disabled={isSubmitting || !token}
          />
          {confirmPasswordError && (
            <p className="auth-form__error">{confirmPasswordError}</p>
          )}
        </div>

        <div className="auth-form__actions">
          <Button
            variant="blue"
            size="large"
            text="Reset"
            type="submit"
            disabled={isSubmitting || !token}
          />
        </div>
      </div>
    </form>
  );
};
