import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutsideClickRef } from 'rooks';
import { Link } from 'wouter';

type Props = {
  title: string;
};

export function NavMenu({ title }: Props): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { i18n } = useTranslation();
  const [ref] = useOutsideClickRef(() => {
    setExpanded(false);
  }, expanded);

  const isCurrentLanguage = (pattern: RegExp): boolean => {
    return pattern.test(i18n.languages[0]);
  };
  const changeLanguage = (lang: string): void => {
    i18n.changeLanguage(lang);
  };
  return (
    <header>
      <nav className='navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3'>
        <div className='container'>
          <Link href='/' className='navbar-brand'>
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
            <ul className='navbar-nav flex-grow'>
              <li className='nav-item'>
                <Link href='/' className='nav-link'>
                  Home
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/counter' className='nav-link'>
                  Counter
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/todo-list' className='nav-link'>
                  Todo
                </Link>
              </li>
              <li className='nav-item dropdown'>
                <button
                  className={`btn dropdown-toggle ${expanded ? 'show' : ''}`}
                  id='i18nDropdown'
                  aria-label='Toggle Languages'
                  data-bs-toggle='dropdown'
                  data-bs-auto-close='true'
                  aria-expanded={expanded}
                  onClick={() => setExpanded(!expanded)}
                  ref={ref}
                >
                  <i className='bi bi-globe'></i>
                </button>
                <ul
                  className={`dropdown-menu ${expanded ? 'show' : 'd-none'}`}
                  aria-labelledby='i18nDropdown'
                >
                  <li>
                    <button
                      className={`dropdown-item ${
                        isCurrentLanguage(/^en/i) ? 'active' : ''
                      }`}
                      onClick={() => changeLanguage('en')}
                    >
                      English
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${
                        isCurrentLanguage(/^zh/i) ? 'active' : ''
                      }`}
                      onClick={() => changeLanguage('zh-Hant')}
                    >
                      中文(繁體)
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
