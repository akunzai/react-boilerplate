import { useTranslation } from 'react-i18next';

export function Home(): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('Welcome!')}</h1>
      <p>
        You are running this application in <b>{import.meta.env.MODE}</b> mode.
      </p>
    </div>
  );
}
