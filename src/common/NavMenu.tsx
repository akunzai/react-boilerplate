import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useOnclickOutside from 'react-cool-onclickoutside';

type Props = {
  title: string;
};

export default function NavMenu({ title }: Props): JSX.Element {
  const [collapsed, setCollapsed] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { i18n } = useTranslation();
  const ref = useOnclickOutside(() => {
    setExpanded(false);
  });

  const isCurrentLanguage = (pattern: RegExp): boolean => {
    return pattern.test(i18n.languages[0]);
  };
  const changeLanguage = (lang: string): void => {
    i18n.changeLanguage(lang);
    setExpanded(false);
  };
  return (
    <header>
      <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            {title}
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target=".navbar-collapse"
            aria-label="Toggle navigation"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`navbar-collapse collapse d-sm-inline-flex justify-content-end ${
              collapsed ? '' : 'show'
            }`}
            data-testid="navbar-collapse"
          >
            <ul className="navbar-nav flex-grow">
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/counter">
                  Counter
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/todo-list">
                  Todo
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <button
                  className={`btn dropdown-toggle ${expanded ? 'show' : ''}`}
                  id="i18nDropdown"
                  aria-label="Toggle Languages"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded={expanded}
                  onClick={() => setExpanded(!expanded)}
                >
                  <i className="bi bi-globe"></i>
                </button>
                {expanded && (
                  <ul
                    ref={ref}
                    className={`dropdown-menu ${expanded ? 'show' : ''}`}
                    aria-labelledby="i18nDropdown"
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
                        正體中文
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
