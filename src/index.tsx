import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { getBaseUrl } from './utils';

// Start the mocking conditionally.
if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCK === 'true') {
  const { worker } = await import('./mocks/browser');
  const baseUrl = getBaseUrl();
  await worker.start({
    serviceWorker: {
      url: `${baseUrl}/mockServiceWorker.js`,
    },
    onUnhandledRequest: 'bypass',
  });
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
