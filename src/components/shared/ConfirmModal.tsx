import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel,
}: Props): React.JSX.Element | null {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <>
      <div
        className='modal d-block'
        role='dialog'
        aria-modal='true'
        aria-labelledby='confirm-modal-title'
        tabIndex={-1}
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='confirm-modal-title'>
                {title}
              </h5>
              <button
                type='button'
                className='btn-close'
                aria-label={t('Cancel')}
                onClick={onCancel}
              ></button>
            </div>
            <div className='modal-body'>{children}</div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-outline-secondary'
                onClick={onCancel}
              >
                {t('Cancel')}
              </button>
              <button
                type='button'
                className='btn btn-danger'
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop show'></div>
    </>
  );
}
