import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './index.scss';
import reportWebVitals from './reportWebVitals';

// Start the mocking conditionally.
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  worker.start();
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
