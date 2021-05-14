import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useOnclickOutside from "react-cool-onclickoutside";

type Props = {
  title: string
}

export default function NavMenu({ title }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { i18n } = useTranslation();
  const ref = useOnclickOutside(() => {
    setExpanded(false);
  });

  const getLanguage = () => {
    return i18n.language ||
      (typeof window !== 'undefined' && window.localStorage.getItem('i18nextLng')) ||
      'en';
  }
  return (
    <header>
      <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/" >{title}</Link>
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
            className={`navbar-collapse collapse d-sm-inline-flex justify-content-end ${collapsed ? "" : "show"}`}
          >
            <ul className="navbar-nav flex-grow">
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/counter">Counter</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/todo-list">Todo</Link>
              </li>
              <li className="nav-item dropdown">
                <button className={`btn dropdown-toggle ${expanded ? "show" : ""}`}
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded={expanded}
                  onClick={() => setExpanded(!expanded)}
                >
                  <i className="bi bi-globe"></i>
                </button>
                {expanded && (
                  <ul ref={ref} className={`dropdown-menu ${expanded ? "show" : ""}`} aria-labelledby="navbarDropdown">
                    <li><button className={`dropdown-item ${getLanguage().startsWith("en") ? "active" : ""}`}
                      onClick={() => i18n.changeLanguage('en')}>English</button></li>
                    <li><button className={`dropdown-item ${getLanguage().startsWith("zh") ? "active" : ""}`}
                      onClick={() => i18n.changeLanguage('zh-Hant')}>正體中文</button></li>
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
