import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { Input } from "antd";
import { validateEmail } from "../../../utils/validation/validateEmail";
import { validatePassword } from "../../../utils/validation/validatePassword";
import { login } from "../../../api/auth";
import { useAuth } from "../../../hooks/useAuth";

import user from "../../../assets/icons/user.svg";
import lock from "../../../assets/icons/lock.svg";
import { Button } from "../../../components/Button/Button";

import "./LogInForm.scss";

export const LogInForm = () => {
  const { loginContext } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation || passwordValidation) {
      setFormError("Invalid email or password. Please try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await login({ email, password });
      const token = response.data.token;

      if (token) {
        loginContext(token, email);
        console.log(token)
        navigate('/');
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      setFormError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form autoComplete="on" onSubmit={handleLogin} className="auth-form">
      <h2>Log In</h2>

      <div className="auth-form__content">
        <div className="auth-form__field">
          {formError && <p className="auth-form__error">{formError}</p>}

          <Input
            className={formError ? "input-error" : ""}
            placeholder="Email"
            type="email"
            value={email}
            suffix={<img src={user} alt="mail icon" />}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormError("");
            }}
          />
        </div>

        <div className="auth-form__field auth-form__field--right">
          <Input
            className={formError ? "input-error" : ""}
            placeholder="Password"
            type="password"
            value={password}
            suffix={<img src={lock} alt="lock icon" />}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormError("");
            }}
          />

          <Link to="/recover-password" className="auth-form__forgot">
            Forgot password?
          </Link>
        </div>

        <div className="auth-form__actions">
          <Button
            variant="blue"
            size="large"
            text="Log In"
            type="submit"
            disabled={isSubmitting}
          />
        </div>

        <p className="auth-form__footer">
          Don’t have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </form>
  );
};
