import { Field, Form, Formik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { TodoService } from '../api';
import { Priority, Todo, allTags } from '../types';
import { flattenCategories } from '../utils';
import { ConfirmModal, usePriorityLabel, useToast } from './shared';

type Props = {
  id: number;
};

type Tab = 'details' | 'activity';
const priorities: Priority[] = ['low', 'medium', 'high'];

export function TodoDetail({ id }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const todoService: TodoService = useMemo(() => new TodoService(), []);
  const [loaded, setLoaded] = useState(false);
  const [todo, setTodo] = useState<Todo>(new Todo(id, '', undefined, false));
  const [tab, setTab] = useState<Tab>('details');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [, navigate] = useLocation();
  const toast = useToast();
  const priorityLabel = usePriorityLabel();

  useEffect(() => {
    todoService.getTodo(todo.id).then((value) => {
      if (value !== undefined) {
        setLoaded(true);
        setTodo({ ...new Todo(value.id, value.title), ...value });
      }
    });
  }, [todo.id, todoService]);

  if (!loaded) return <div>Loading...</div>;

  const handleDelete = async () => {
    setConfirmDelete(false);
    await todoService.deleteTodo(todo);
    toast(t('Todo deleted'));
    navigate('/todo-list');
  };

  return (
    <div className='row justify-content-md-center'>
      <div className='col-lg-8'>
        <nav aria-label='breadcrumb'>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item'>
              <Link href='/todo-list'>{t('Todo List')}</Link>
            </li>
            <li className='breadcrumb-item active' aria-current='page'>
              {todo.title}
            </li>
          </ol>
        </nav>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h1 className='h3 mb-0'>{todo.title}</h1>
          <button
            type='button'
            className='btn-close'
            aria-label='Close'
            onClick={() => window.history.back()}
          ></button>
        </div>
        <ul className='nav nav-tabs mb-3' role='tablist'>
          {(['details', 'activity'] as Tab[]).map((key) => (
            <li className='nav-item' role='presentation' key={key}>
              <button
                type='button'
                role='tab'
                aria-selected={tab === key}
                className={`nav-link ${tab === key ? 'active' : ''}`}
                onClick={() => setTab(key)}
              >
                {key === 'details' ? t('Details') : t('Activity')}
              </button>
            </li>
          ))}
        </ul>

        {tab === 'activity' ? (
          <ul className='list-group' role='tabpanel'>
            <li className='list-group-item'>
              <i className='bi bi-plus-circle me-2 text-success'></i>
              {t('Created')}
            </li>
            {todo.done && (
              <li className='list-group-item'>
                <i className='bi bi-check-circle me-2 text-primary'></i>
                {t('Marked as done')}
              </li>
            )}
          </ul>
        ) : (
          <Formik
            enableReinitialize
            initialValues={{ ...todo, notify: false }}
            validate={(values) => {
              const errors: Record<string, string> = {};
              if (!values.title.trim()) errors.title = t('Title is required');
              if (values.title.length > 80) errors.title = t('Title must be 80 characters or less');
              return errors;
            }}
            onSubmit={async (values) => {
              await todoService.updateTodo(
                new Todo(
                  values.id,
                  values.title,
                  values.description,
                  values.done,
                  values.priority,
                  values.tags,
                  values.category || undefined,
                  values.dueDate || undefined
                )
              );
              toast(t('Saved'));
              window.history.back();
            }}
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form role='tabpanel' noValidate>
                <div className='mb-3'>
                  <label className='form-label' htmlFor='title'>
                    {t('Title')}
                  </label>
                  <Field
                    id='title'
                    name='title'
                    className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                    aria-label='Title'
                    placeholder={t('Title')}
                    required
                  />
                  {touched.title && errors.title && (
                    <div className='invalid-feedback'>{errors.title}</div>
                  )}
                </div>
                <div className='mb-3'>
                  <label className='form-label' htmlFor='description'>
                    {t('Description')}
                  </label>
                  <Field
                    as='textarea'
                    id='description'
                    name='description'
                    rows={3}
                    className='form-control'
                    aria-label='Description'
                    placeholder={t('Description')}
                  />
                  <div className='form-text'>{t('Markdown is not supported')}</div>
                </div>
                <fieldset className='mb-3'>
                  <legend className='form-label fs-6'>{t('Priority')}</legend>
                  <div className='btn-group' role='radiogroup'>
                    {priorities.map((p) => (
                      <label key={p} className={`btn btn-outline-primary ${values.priority === p ? 'active' : ''}`}>
                        <Field type='radio' name='priority' value={p} className='btn-check' />
                        {priorityLabel(p)}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className='row g-3 mb-3'>
                  <div className='col-md-6'>
                    <label className='form-label' htmlFor='category'>
                      {t('Category')}
                    </label>
                    <Field as='select' id='category' name='category' className='form-select'>
                      <option value=''>{t('None')}</option>
                      {flattenCategories().map((c) => (
                        <option key={c.value} value={c.value}>
                          {'  '.repeat(c.depth)}
                          {c.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label' htmlFor='dueDate'>
                      {t('Due date')}
                    </label>
                    <Field type='date' id='dueDate' name='dueDate' className='form-control' />
                  </div>
                </div>
                <div className='mb-3'>
                  <span className='form-label d-block'>{t('Tags')}</span>
                  {allTags.map((tag) => (
                    <div className='form-check form-check-inline' key={tag}>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`tag-${tag}`}
                        checked={(values.tags ?? []).includes(tag)}
                        onChange={(e) =>
                          setFieldValue(
                            'tags',
                            e.target.checked
                              ? [...(values.tags ?? []), tag]
                              : (values.tags ?? []).filter((x) => x !== tag)
                          )
                        }
                      />
                      <label className='form-check-label' htmlFor={`tag-${tag}`}>
                        #{tag}
                      </label>
                    </div>
                  ))}
                </div>
                <div className='mb-3'>
                  <div className='form-check'>
                    <Field id='done' name='done' type='checkbox' className='form-check-input' />
                    <label className='form-check-label' htmlFor='done'>
                      {t('Done')}
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <Field id='notify' name='notify' type='checkbox' role='switch' className='form-check-input' />
                    <label className='form-check-label' htmlFor='notify'>
                      {t('Remind me on the due date')}
                    </label>
                  </div>
                </div>
                <div className='d-flex justify-content-between'>
                  <button type='button' className='btn btn-outline-danger' onClick={() => setConfirmDelete(true)}>
                    <i className='bi bi-trash me-1'></i>
                    {t('Delete')}
                  </button>
                  <div className='d-flex gap-2'>
                    <button type='button' className='btn btn-outline-secondary' onClick={() => window.history.back()}>
                      {t('Cancel')}
                    </button>
                    <button type='submit' className='btn btn-primary' aria-label='Save' disabled={isSubmitting}>
                      {isSubmitting && <span className='spinner-border spinner-border-sm me-1' aria-hidden='true'></span>}
                      {t('Save')}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <ConfirmModal
        open={confirmDelete}
        title={t('Delete todo?')}
        confirmLabel={t('Delete')}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      >
        {t('"{{title}}" will be permanently deleted', { title: todo.title })}
      </ConfirmModal>
    </div>
  );
}
