import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

type ToastVariant = 'success' | 'danger' | 'info';
type ToastMessage = { id: number; text: string; variant: ToastVariant };

const ToastContext = createContext<(text: string, variant?: ToastVariant) => void>(
  () => undefined
);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const show = useCallback(
    (text: string, variant: ToastVariant = 'success') => {
      const id = Date.now() + Math.random();
      setMessages((prev) => [...prev, { id, text, variant }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className='toast-container position-fixed bottom-0 end-0 p-3'>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`toast show align-items-center text-bg-${m.variant} border-0`}
            role='status'
            aria-live='polite'
          >
            <div className='d-flex'>
              <div className='toast-body'>{m.text}</div>
              <button
                type='button'
                className='btn-close btn-close-white me-2 m-auto'
                aria-label='Dismiss'
                onClick={() => dismiss(m.id)}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
