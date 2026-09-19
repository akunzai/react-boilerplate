import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { TodoService } from '../api';
import { Todo } from '../types';
import { isOverdue } from '../utils';
import { PriorityBadge } from './shared';

export function Home(): React.JSX.Element {
  const { t } = useTranslation();
  const todoService = useMemo(() => new TodoService(), []);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    todoService
      .getTodoList()
      .then(setTodos)
      .catch(() => setTodos([]));
  }, [todoService]);

  const done = todos.filter((x) => x.done).length;
  const overdue = todos.filter((x) => isOverdue(x.dueDate, x.done)).length;
  const percent = todos.length ? Math.round((done / todos.length) * 100) : 0;
  const upNext = todos.filter((x) => !x.done).slice(0, 3);
  const stats = [
    { label: t('Total'), value: todos.length, icon: 'bi-list-task' },
    { label: t('Active'), value: todos.length - done, icon: 'bi-hourglass-split' },
    { label: t('Completed'), value: done, icon: 'bi-check-circle' },
    { label: t('Overdue'), value: overdue, icon: 'bi-exclamation-triangle' },
  ];

  return (
    <div>
      <h1 className="mb-3">{t('Welcome!')}</h1>
      {showTip && (
        <div className="alert alert-info alert-dismissible d-flex gap-2" role="alert">
          <i className="bi bi-info-circle"></i>
          <div>{t('Open a todo to set its priority, tags and due date')}</div>
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss tip"
            onClick={() => setShowTip(false)}
          ></button>
        </div>
      )}
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between text-muted small">
                  {s.label}
                  <i className={`bi ${s.icon}`}></i>
                </div>
                <div className="fs-3 fw-semibold">{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span>{t('Progress')}</span>
            <span className="text-muted">{percent}%</span>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label={t('Progress')}
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar bg-success" style={{ width: `${percent}%` }}></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-semibold">{t('Up next')}</span>
          <Link href="/todo-list" className="btn btn-sm btn-link">
            {t('View all')}
          </Link>
        </div>
        <ul className="list-group list-group-flush">
          {upNext.map((todo) => (
            <li
              key={todo.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <Link href={`/todo/${todo.id}`}>{todo.title}</Link>
              <PriorityBadge priority={todo.priority} />
            </li>
          ))}
          {upNext.length === 0 && (
            <li className="list-group-item text-muted">{t('Nothing to do, enjoy!')}</li>
          )}
        </ul>
      </div>
    </div>
  );
}
