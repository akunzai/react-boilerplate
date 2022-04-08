import { useTranslation } from 'react-i18next';

export function Home(): JSX.Element {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('Welcome!') as string}</h1>
      <p>
        You are running this application in <b>{process.env.NODE_ENV}</b> mode.
      </p>
    </div>
  );
}
