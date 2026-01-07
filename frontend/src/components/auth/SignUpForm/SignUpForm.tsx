/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Modal } from "antd";

import { validateEmail } from "../../../utils/validation/validateEmail";
import { validatePassword } from "../../../utils/validation/validatePassword";
import { register } from "../../../api/auth";
import { Button } from "../../../components/Button/Button";

import user from "../../../assets/icons/user.svg";
import lock from "../../../assets/icons/lock.svg";

import "./SignUpForm.scss";

export const SignUpForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailError("");
    setPasswordError("");
    setFormError("");

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation) {
      setEmailError(emailValidation);
      setIsSubmitting(false);
      return;
    }

    if (passwordValidation) {
      setPasswordError(passwordValidation);
      setIsSubmitting(false);
      return;
    }

    try {
      await register({ email, password });

      Modal.success({
        title: "Account created successfully!",
        content: "Log in to continue.",
        centered: true,
        okText: "OK",
        onOk: () => navigate("/login"),
      });

      setEmail("");
      setPassword("");
    } catch (error: any) {
      setFormError(
        error.response?.data?.message || "Sign up failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form autoComplete="on" onSubmit={handleSignUp} className="auth-form">
      <h2>Create account</h2>

      <div className="auth-form__content">
        <div className="auth-form__field">
          {formError && <p className="auth-form__error">{formError}</p>}

          <Input
            placeholder="Email"
            type="email"
            value={email}
            suffix={<img src={user} alt="mail icon" />}
            className={emailError ? "input-error" : ""}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />

          {emailError && <p className="auth-form__error">{emailError}</p>}
        </div>

        <div className="auth-form__field">
          <Input
            placeholder="Password"
            type="password"
            value={password}
            suffix={<img src={lock} alt="lock icon" />}
            className={passwordError ? "input-error" : ""}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
          />

          {!passwordError && (
            <p className="auth-form__hint">
              Minimum 8 characters, including a capital letter and a number
            </p>
          )}

          {passwordError && <p className="auth-form__error">{passwordError}</p>}
        </div>

        <div className="auth-form__actions">
          <Button
            variant="blue"
            size="large"
            text="Create account"
            type="submit"
            disabled={isSubmitting}
          />
        </div>

        <p className="auth-form__footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </form>
  );
};
