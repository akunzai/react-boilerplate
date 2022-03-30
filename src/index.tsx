import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './index.scss';
import reportWebVitals from './reportWebVitals';

// Start the mocking conditionally.
if (process.env.REACT_APP_MOCK === 'true') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { worker } = require('./mocks/browser');
  worker.start();
}

const container = document.getElementById('root');
if (container !== null) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
