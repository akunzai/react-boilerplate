import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Counter() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('Counter')}</h1>
      <p aria-live="polite">
        {t('Current count')}: <strong>{count}</strong>
      </p>
      <button className="btn btn-primary" onClick={() => setCount(count + 1)}>
        {t('Increment')}
      </button>
    </div>
  );
}
