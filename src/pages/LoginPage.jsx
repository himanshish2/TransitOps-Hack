import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff, FiTruck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/layout/ThemeToggle';
import { isValidEmail, isBlank } from '../utils/validationUtils';
import { DEMO_CREDENTIALS_HINT } from '../data/mockUsers';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  function validate() {
    const newErrors = {};
    if (isBlank(email)) {
      newErrors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (isBlank(password)) {
      newErrors.password = 'Password is required.';
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setApiError(error?.normalized?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="login-card surface-card">
        <div className="login-brand">
          <span className="login-brand-mark"><FiTruck size={22} /></span>
          <div>
            <h1 className="fs-4 mb-0">TransitOps</h1>
            <p className="text-muted-custom mb-0" style={{ fontSize: 'var(--font-size-sm)' }}>
              Smart Transport Operations Platform
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {apiError && (
            <div className="alert alert-danger" role="alert" style={{ fontSize: 'var(--font-size-sm)' }}>
              {apiError}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid-field' : ''}`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <div className="field-error-text">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="position-relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid-field' : ''}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <div className="field-error-text">{errors.password}</div>}
          </div>

          <div className="form-check mb-3">
            <input
              id="rememberMe"
              type="checkbox"
              className="form-check-input"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="form-check-label" style={{ fontSize: 'var(--font-size-sm)' }}>
              Remember me
            </label>
          </div>

          <button type="submit" className="btn btn-brand w-100" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-demo-hint">
          <p className="fw-medium mb-2" style={{ fontSize: 'var(--font-size-sm)' }}>Demo credentials</p>
          {DEMO_CREDENTIALS_HINT.map((cred) => (
            <div key={cred.email} className="demo-cred-row">
              <span className="text-muted-custom">{cred.role}:</span>
              <span>{cred.email} / {cred.password}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
