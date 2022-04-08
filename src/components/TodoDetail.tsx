import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useService } from 'react-service-container';
import { TodoService } from '../api';
import { Todo } from '../types';

export function TodoDetail(): JSX.Element {
  const { id } = useParams();
  const { t } = useTranslation();
  const todoService = useService(TodoService);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [todo, setTodo] = useState<Todo>(
    new Todo(Number(id), '', undefined, false)
  );

  useEffect(() => {
    todoService.getTodo(todo.id).subscribe((value) => {
      if (value !== undefined) {
        setLoaded(true);
        setTodo(value);
      }
    });
  }, [todo.id, todoService]);

  if (!loaded) return <div>Loading...</div>;

  return (
    <Formik
      enableReinitialize
      initialValues={todo}
      onSubmit={(values) => {
        todoService.updateTodo(values).subscribe(() => {
          navigate(-1);
        });
      }}
    >
      <Form>
        <button
          type="button"
          className="btn-close float-end"
          aria-label="Close"
          onClick={() => navigate(-1)}
        ></button>
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            {t('Title') as string}
          </label>
          <Field
            name="title"
            className="form-control"
            aria-label="Title"
            placeholder={t('Title')}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="description">
            {t('Description') as string}
          </label>
          <Field
            as="textarea"
            name="description"
            className="form-control"
            aria-label="Description"
            placeholder={t('Description')}
          />
        </div>
        <div className="mb-3">
          <div className="form-check">
            <Field name="done" type="checkbox" className="form-check-input" />
            <label className="form-check-label" htmlFor="done">
              {t('Done') as string}
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" aria-label="Save">
          {t('Save') as string}
        </button>
      </Form>
    </Formik>
  );
}
