import { useTranslation } from 'react-i18next';
import { Priority } from '../../types';

const variants: Record<Priority, string> = {
  high: 'text-bg-danger',
  medium: 'text-bg-warning',
  low: 'text-bg-secondary',
};

export function usePriorityLabel(): (priority: Priority) => string {
  const { t } = useTranslation();
  return (priority) => ({ high: t('High'), medium: t('Medium'), low: t('Low') })[priority];
}

export function PriorityBadge({ priority }: { priority: Priority }): React.JSX.Element {
  const label = usePriorityLabel();
  return <span className={`badge rounded-pill ${variants[priority]}`}>{label(priority)}</span>;
}
