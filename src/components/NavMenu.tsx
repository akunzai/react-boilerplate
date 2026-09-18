import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutsideClickRef } from 'rooks';
import { Link, useLocation } from 'wouter';
import { UserService } from '../api';
import { User } from '../types';

type Props = {
  title: string;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function NavMenu({ title }: Props): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(true);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const [location, navigate] = useLocation();
  const { t, i18n } = useTranslation();
  const userService = useMemo(() => new UserService(), []);
  const [languageRef] = useOutsideClickRef(() => {
    setLanguageOpen(false);
  }, languageOpen);
  const [accountRef] = useOutsideClickRef(() => {
    setAccountOpen(false);
  }, accountOpen);

  useEffect(() => {
    userService
      .getMe()
      .then(setUser)
      .catch(() => setUser(undefined));
  }, [userService]);

  const isCurrentLanguage = (pattern: RegExp): boolean => {
    return pattern.test(i18n.languages[0]);
  };
  const changeLanguage = (lang: string): void => {
    i18n.changeLanguage(lang);
    setLanguageOpen(false);
  };
  const navClass = (href: string) =>
    `nav-link ${location === href ? 'active fw-semibold' : ''}`;

  return (
    <header>
      <nav className='navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3'>
        <div className='container'>
          <Link href='/' className='navbar-brand d-flex align-items-center gap-2'>
            <i className='bi bi-check2-square text-primary'></i>
            {title}
          </Link>
          <button
            className='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='.navbar-collapse'
            aria-label='Toggle navigation'
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div
            className={`navbar-collapse collapse d-sm-inline-flex justify-content-end ${
              collapsed ? '' : 'show'
            }`}
            role='menu'
          >
            <ul className='navbar-nav flex-grow align-items-sm-center gap-sm-1'>
              <li className='nav-item'>
                <Link href='/' className={navClass('/')}>
                  {t('Home')}
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/counter' className={navClass('/counter')}>
                  {t('Counter')}
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/todo-list' className={navClass('/todo-list')}>
                  {t('Todo')}
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/settings' className={navClass('/settings')}>
                  {t('Settings')}
                </Link>
              </li>
              <li className='nav-item dropdown'>
                <button
                  className={`btn dropdown-toggle ${languageOpen ? 'show' : ''}`}
                  id='i18nDropdown'
                  aria-label='Toggle Languages'
                  aria-expanded={languageOpen}
                  onClick={() => setLanguageOpen(!languageOpen)}
                  ref={languageRef}
                >
                  <i className='bi bi-globe'></i>
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end ${languageOpen ? 'show' : 'd-none'}`}
                  aria-labelledby='i18nDropdown'
                >
                  <li>
                    <button
                      className={`dropdown-item ${isCurrentLanguage(/^en/i) ? 'active' : ''}`}
                      onClick={() => changeLanguage('en')}
                    >
                      English
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${isCurrentLanguage(/^zh/i) ? 'active' : ''}`}
                      onClick={() => changeLanguage('zh-Hant')}
                    >
                      中文(繁體)
                    </button>
                  </li>
                </ul>
              </li>
              {user ? (
                <li className='nav-item dropdown'>
                  <button
                    className={`btn d-flex align-items-center gap-2 ${accountOpen ? 'show' : ''}`}
                    aria-label='Account'
                    aria-expanded={accountOpen}
                    onClick={() => setAccountOpen(!accountOpen)}
                    ref={accountRef}
                  >
                    <span
                      className='rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center small'
                      style={{ width: 32, height: 32 }}
                      aria-hidden='true'
                    >
                      {initials(user.name)}
                    </span>
                    <span className='d-sm-none d-lg-inline'>{user.name}</span>
                  </button>
                  <ul
                    className={`dropdown-menu dropdown-menu-end ${accountOpen ? 'show' : 'd-none'}`}
                  >
                    <li>
                      <h6 className='dropdown-header'>{user.email}</h6>
                    </li>
                    <li>
                      <button
                        className='dropdown-item'
                        onClick={() => {
                          setAccountOpen(false);
                          navigate('/settings');
                        }}
                      >
                        <i className='bi bi-gear me-2'></i>
                        {t('Settings')}
                      </button>
                    </li>
                    <li>
                      <hr className='dropdown-divider' />
                    </li>
                    <li>
                      <button
                        className='dropdown-item text-danger'
                        onClick={() => {
                          setAccountOpen(false);
                          setUser(undefined);
                          navigate('/login');
                        }}
                      >
                        <i className='bi bi-box-arrow-right me-2'></i>
                        {t('Sign out')}
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className='nav-item'>
                  <Link href='/login' className='btn btn-outline-primary btn-sm'>
                    {t('Sign in')}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
