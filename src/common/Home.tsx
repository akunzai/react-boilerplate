import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('Welcome!')}</h1>
      <p>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</p>
    </div>
  );
}
