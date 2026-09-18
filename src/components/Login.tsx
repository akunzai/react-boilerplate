import { Form, Formik } from 'formik';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { UserService } from '../api';

export function Login(): React.JSX.Element {
  const { t } = useTranslation();
  const userService = useMemo(() => new UserService(), []);
  const [, navigate] = useLocation();
  const [failed, setFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="d-flex justify-content-center py-5">
      <div className="card shadow-sm" style={{ width: 360 }}>
        <div className="card-body p-4">
          <h1 className="h4 mb-1">{t('Sign in')}</h1>
          <p className="text-muted small mb-4">{t('Welcome back! Please enter your details')}</p>
          {failed && (
            <div className="alert alert-danger py-2" role="alert">
              {t('Invalid email or password')}
            </div>
          )}
          <Formik
            initialValues={{ email: '', password: '', remember: true }}
            validate={(values) => {
              const errors: Record<string, string> = {};
              if (!values.email) errors.email = t('Email is required');
              else if (!/^\S+@\S+\.\S+$/.test(values.email))
                errors.email = t('Enter a valid email');
              if (!values.password) errors.password = t('Password is required');
              return errors;
            }}
            onSubmit={async (values) => {
              const user = await userService.login(values.email, values.password);
              if (user) {
                navigate('/');
              } else {
                setFailed(true);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form noValidate className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label" htmlFor="login-email">
                    {t('Email')}
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div>
                  <label className="form-label" htmlFor="login-password">
                    {t('Password')}
                  </label>
                  <div className="input-group has-validation">
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label={showPassword ? t('Hide password') : t('Show password')}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    {touched.password && errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="form-check-input"
                      checked={values.remember}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="remember">
                      {t('Remember me')}
                    </label>
                  </div>
                  <a href="#" className="small">
                    {t('Forgot password?')}
                  </a>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                  {isSubmitting && (
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      aria-hidden="true"
                    ></span>
                  )}
                  {t('Sign in')}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
