import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutsideClickRef } from 'rooks';
import { Link } from 'wouter';
import { TodoService } from '../api';
import { Priority, Todo, allTags } from '../types';
import { categoryLabel, isOverdue } from '../utils';
import { ConfirmModal, PriorityBadge, usePriorityLabel, useToast } from './shared';

type StatusFilter = 'all' | 'active' | 'done';
const PAGE_SIZE = 5;

export function TodoList(): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Todo>();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkRef] = useOutsideClickRef(() => setBulkOpen(false), bulkOpen);
  const todoService: TodoService = useMemo(() => new TodoService(), []);
  const toast = useToast();
  const priorityLabel = usePriorityLabel();
  const { t } = useTranslation();

  useEffect(() => {
    todoService
      .getTodoList()
      .then((values) => {
        setTodos(values);
      })
      .catch(() => setError(t('Failed to load todos')))
      .finally(() => setLoading(false));
  }, [todoService, t]);

  const filtered = todos.filter(
    (x) =>
      x.title.toLowerCase().includes(query.trim().toLowerCase()) &&
      (status === 'all' || (status === 'done') === x.done) &&
      (!priority || x.priority === priority) &&
      tags.every((tag) => (x.tags ?? []).includes(tag))
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = query !== '' || status !== 'all' || priority !== '' || tags.length > 0;

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setPriority('');
    setTags([]);
    setPage(1);
  };

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));
    setPage(1);
  };

  const handleRemove = async (todo: Todo) => {
    setPendingDelete(undefined);
    await todoService.deleteTodo(todo);
    setTodos((prev) => prev.filter((x: Todo) => x !== todo));
    toast(t('Todo deleted'));
  };

  const handleUpdate = async (id: number, done: boolean) => {
    const todo = todos.find((x: { id: number }) => x.id === id);
    if (todo === undefined) return;
    const newTodo = Object.assign(todo, { done: done });
    await todoService.updateTodo(newTodo);
    const index = todos.findIndex((x: { id: number }) => x.id === id);
    if (index > -1) {
      const newTodos = [...todos];
      newTodos[index] = newTodo;
      setTodos(newTodos);
    }
  };

  const markAll = async (done: boolean) => {
    setBulkOpen(false);
    const targets = filtered.filter((x) => x.done !== done);
    await Promise.all(targets.map((x) => todoService.updateTodo({ ...x, done })));
    setTodos((prev) =>
      prev.map((x) => (targets.includes(x) ? { ...x, done } : x))
    );
    toast(t('Updated {{count}} todos', { count: targets.length }));
  };

  const clearCompleted = async () => {
    setBulkOpen(false);
    const targets = todos.filter((x) => x.done);
    await Promise.all(targets.map((x) => todoService.deleteTodo(x)));
    setTodos((prev) => prev.filter((x) => !x.done));
    toast(t('Deleted {{count}} todos', { count: targets.length }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    const newTodo = { title: trimmedTitle, done: false, priority: 'medium', tags: [] } as unknown as Todo;
    const value = await todoService.addTodo(newTodo);
    const newTodos = [...todos];
    if (!newTodos.some((x) => x.id === value.id)) {
      newTodos.push(value);
    }
    setTodos(newTodos);
    setTitle('');
  };

  return (
    <div className='row justify-content-md-center'>
      <div className='col-lg-8'>
        <div className='d-flex justify-content-between align-items-start mb-3'>
          <div>
            <h1>{t('Todo List')}</h1>
            <p className='text-muted mb-0'>
              {t('{{done}} of {{total}} completed', {
                done: todos.filter((x) => x.done).length,
                total: todos.length,
              })}
            </p>
          </div>
          <div className='btn-group' ref={bulkRef}>
            <button type='button' className='btn btn-outline-primary' onClick={() => markAll(true)}>
              <i className='bi bi-check2-all me-1'></i>
              {t('Mark all done')}
            </button>
            <button
              type='button'
              className='btn btn-outline-primary dropdown-toggle dropdown-toggle-split'
              aria-label='More bulk actions'
              aria-expanded={bulkOpen}
              onClick={() => setBulkOpen(!bulkOpen)}
            ></button>
            <ul className={`dropdown-menu dropdown-menu-end ${bulkOpen ? 'show' : 'd-none'}`}>
              <li>
                <button className='dropdown-item' onClick={() => markAll(false)}>
                  {t('Mark all active')}
                </button>
              </li>
              <li>
                <button className='dropdown-item text-danger' onClick={clearCompleted}>
                  {t('Clear completed')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='mb-3'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control'
              name='title'
              aria-label={t('New todo')}
              placeholder={t('What need to be done?')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <button className='btn btn-outline-secondary' type='submit' aria-label='Add'>
              <i className='bi bi-plus'></i>
            </button>
          </div>
        </form>

        <div className='d-flex flex-wrap gap-2 align-items-center mb-2'>
          <div className='input-group' style={{ maxWidth: 260 }}>
            <span className='input-group-text'>
              <i className='bi bi-search'></i>
            </span>
            <input
              type='search'
              className='form-control'
              aria-label={t('Search')}
              placeholder={t('Search')}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className='form-select w-auto'
            aria-label={t('Status')}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(1);
            }}
          >
            <option value='all'>{t('All')}</option>
            <option value='active'>{t('Active')}</option>
            <option value='done'>{t('Completed')}</option>
          </select>
          <select
            className='form-select w-auto'
            aria-label={t('Priority')}
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value as Priority | '');
              setPage(1);
            }}
          >
            <option value=''>{t('Any priority')}</option>
            <option value='high'>{priorityLabel('high')}</option>
            <option value='medium'>{priorityLabel('medium')}</option>
            <option value='low'>{priorityLabel('low')}</option>
          </select>
          {hasFilters && (
            <button type='button' className='btn btn-link' onClick={clearFilters}>
              {t('Clear filters')}
            </button>
          )}
        </div>
        <div className='d-flex flex-wrap gap-1 mb-3' aria-label={t('Tags')}>
          {allTags.map((tag) => (
            <button
              key={tag}
              type='button'
              className={`btn btn-sm rounded-pill ${
                tags.includes(tag) ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              aria-pressed={tags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              #{tag}
              {tags.includes(tag) && <i className='bi bi-x ms-1'></i>}
            </button>
          ))}
        </div>

        {error && (
          <div className='alert alert-danger' role='alert'>
            {error}
          </div>
        )}
        {loading ? (
          <div className='d-flex justify-content-center py-5'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>{t('Loading')}</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className='text-center text-muted py-5 border rounded'>
            <i className='bi bi-inbox fs-1 d-block mb-2'></i>
            <p className='mb-2'>{t('No todos match your filters')}</p>
            {hasFilters && (
              <button type='button' className='btn btn-outline-primary btn-sm' onClick={clearFilters}>
                {t('Clear filters')}
              </button>
            )}
          </div>
        ) : (
          <div className='todo list-group'>
            {visible.map((todo) => (
              <div key={todo.id} className='list-group-item list-group-item-action'>
                <div className='d-flex w-100 align-items-center gap-3'>
                  <div className='form-check mb-0'>
                    <input
                      className='form-check-input'
                      name='done'
                      type='checkbox'
                      aria-label={todo.title}
                      checked={todo.done}
                      onChange={(e) => handleUpdate(todo.id, e.target.checked)}
                    />
                  </div>
                  <div className='flex-grow-1'>
                    <Link
                      href={`/todo/${todo.id}`}
                      className={todo.done ? 'text-decoration-line-through' : ''}
                    >
                      {todo.title}
                    </Link>
                    <div className='small text-muted d-flex flex-wrap gap-2'>
                      {todo.category && <span>{categoryLabel(todo.category)}</span>}
                      {todo.dueDate && (
                        <span className={isOverdue(todo.dueDate, todo.done) ? 'text-danger' : ''}>
                          <i className='bi bi-calendar-event me-1'></i>
                          {todo.dueDate}
                        </span>
                      )}
                      {(todo.tags ?? []).map((tag) => (
                        <span key={tag} className='badge text-bg-light border'>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <PriorityBadge priority={todo.priority ?? 'medium'} />
                  <button
                    type='button'
                    className='btn-close'
                    aria-label='Close'
                    onClick={() => setPendingDelete(todo)}
                  ></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <nav aria-label={t('Pagination')} className='mt-3'>
            <ul className='pagination justify-content-center'>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className='page-link' aria-label={t('Previous')} onClick={() => setPage(currentPage - 1)}>
                  <i className='bi bi-chevron-left'></i>
                </button>
              </li>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <li key={n} className={`page-item ${n === currentPage ? 'active' : ''}`}>
                  <button
                    className='page-link'
                    aria-current={n === currentPage ? 'page' : undefined}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
                <button className='page-link' aria-label={t('Next')} onClick={() => setPage(currentPage + 1)}>
                  <i className='bi bi-chevron-right'></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
      <ConfirmModal
        open={pendingDelete !== undefined}
        title={t('Delete todo?')}
        confirmLabel={t('Delete')}
        onConfirm={() => pendingDelete && handleRemove(pendingDelete)}
        onCancel={() => setPendingDelete(undefined)}
      >
        {t('"{{title}}" will be permanently deleted', { title: pendingDelete?.title })}
      </ConfirmModal>
    </div>
  );
}
