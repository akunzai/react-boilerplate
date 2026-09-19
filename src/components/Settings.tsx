import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserService } from '../api';
import { ConfirmModal, useAuth, useToast } from './shared';

type View = 'list' | 'compact';

export function Settings(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const userService = useMemo(() => new UserService(), []);
  const toast = useToast();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [view, setView] = useState<View>('list');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  useEffect(() => {
    userService
      .getMe()
      .then((user) => {
        setName(user.name);
        setEmail(user.email);
      })
      .catch(() => undefined);
  }, [userService]);

  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await userService.updateMe({ name, email });
    setUser({ name, email });
    toast(t('Profile saved'));
  };

  const changePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPassword('');
    setNewPassword('');
    toast(t('Password changed'));
  };

  const passwordTooShort = newPassword.length > 0 && newPassword.length < 8;

  return (
    <div className="row justify-content-md-center">
      <div className="col-lg-8 d-flex flex-column gap-4">
        <div>
          <h1>{t('Settings')}</h1>
          <p className="text-muted">{t('Manage your profile and preferences')}</p>
        </div>

        <form className="card" onSubmit={saveProfile}>
          <div className="card-header fw-semibold">{t('Profile')}</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="name">
                {t('Name')}
              </label>
              <input
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="email">
                {t('Email')}
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="card-footer text-end">
            <button type="submit" className="btn btn-primary">
              {t('Save profile')}
            </button>
          </div>
        </form>

        <div className="card">
          <div className="card-header fw-semibold">{t('Preferences')}</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-medium">{t('Email notifications')}</div>
                <div className="small text-muted">{t('Get an email when a todo is due')}</div>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  aria-label={t('Email notifications')}
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-medium">{t('Weekly digest')}</div>
                <div className="small text-muted">{t('A summary of your week, every Monday')}</div>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  aria-label={t('Weekly digest')}
                  checked={weeklyDigest}
                  disabled={!emailNotifications}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                />
              </div>
            </li>
            <li className="list-group-item">
              <div className="fw-medium mb-2">{t('Default view')}</div>
              {(['list', 'compact'] as View[]).map((v) => (
                <div className="form-check" key={v}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="view"
                    id={`view-${v}`}
                    checked={view === v}
                    onChange={() => setView(v)}
                  />
                  <label className="form-check-label" htmlFor={`view-${v}`}>
                    {v === 'list' ? t('Comfortable list') : t('Compact list')}
                  </label>
                </div>
              ))}
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fw-medium" htmlFor="language">
                {t('Language')}
              </label>
              <select
                id="language"
                className="form-select w-auto"
                value={/^zh/i.test(i18n.languages?.[0] ?? '') ? 'zh-Hant' : 'en'}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="zh-Hant">中文(繁體)</option>
              </select>
            </li>
          </ul>
        </div>

        <form className="card" onSubmit={changePassword}>
          <div className="card-header fw-semibold">{t('Security')}</div>
          <div className="card-body d-flex flex-column gap-3">
            <div>
              <label className="form-label" htmlFor="current-password">
                {t('Current password')}
              </label>
              <input
                id="current-password"
                type="password"
                className="form-control"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="new-password">
                {t('New password')}
              </label>
              <div className="input-group has-validation">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${passwordTooShort ? 'is-invalid' : ''}`}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  aria-label={showPassword ? t('Hide password') : t('Show password')}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {passwordTooShort && (
                  <div className="invalid-feedback">{t('Use at least 8 characters')}</div>
                )}
              </div>
            </div>
          </div>
          <div className="card-footer text-end">
            <button type="submit" className="btn btn-primary" disabled={passwordTooShort}>
              {t('Change password')}
            </button>
          </div>
        </form>

        <div className="card border-danger">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-medium text-danger">{t('Deactivate account')}</div>
              <div className="small text-muted">{t('Your todos will be kept for 30 days')}</div>
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setConfirmDeactivate(true)}
            >
              {t('Deactivate')}
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={confirmDeactivate}
        title={t('Deactivate account?')}
        confirmLabel={t('Deactivate')}
        onConfirm={() => {
          setConfirmDeactivate(false);
          toast(t('Account deactivated'), 'info');
        }}
        onCancel={() => setConfirmDeactivate(false)}
      >
        {t('Your todos will be kept for 30 days')}
      </ConfirmModal>
    </div>
  );
}
