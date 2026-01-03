/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "antd";
import { validateEmail } from "../../../utils/validation/validateEmail";
import { forgotPassword } from "../../../api/auth";
import { Button } from "../../Button/Button";

import user from "../../../assets/icons/user.svg";

import "./RecoverPasswordForm.scss";

export const RecoverPasswordForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailError("");
    setFormError("");

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      setIsSubmitting(false);
      return;
    }

    try {
      await forgotPassword(email);
      setEmail("");
      navigate("/reset-password/email-confirmation");
    } catch (error: any) {
      setFormError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form autoComplete="on" onSubmit={handleRecover} className="auth-form">
      <div className="auth-form__header">
        <h2>Recover password</h2>
        <p>
          Provide the email address associated with your account to recover your
          password
        </p>
      </div>

      <div className="auth-form__content">
        {formError && <p className="auth-form__error">{formError}</p>}

        <div className="auth-form__field">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            suffix={<img src={user} alt="mail icon" />}
            className={emailError ? "input-error" : ""}
            onChange={handleEmailChange}
            disabled={isSubmitting}
          />
          {emailError && (
            <p className="auth-form__error">{emailError}</p>
          )}
        </div>

        <div className="auth-form__actions">
          <Button
            variant="blue"
            size="large"
            text="Recover"
            type="submit"
            disabled={isSubmitting}
          />
        </div>

        <p className="auth-form__footer">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>
      </div>
    </form>
  );
};
