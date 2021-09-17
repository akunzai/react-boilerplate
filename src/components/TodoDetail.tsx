import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useService } from 'react-service-container';
import { TodoService } from '../api';
import { Todo } from '../types';

export function TodoDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const todoService = useService(TodoService);
  const history = useHistory();
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
          history.goBack();
        });
      }}
    >
      <Form>
        <button
          type="button"
          className="btn-close float-end"
          aria-label="Close"
          onClick={history.goBack}
        ></button>
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            {t('Title')}
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
            {t('Description')}
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
              {t('Done')}
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" aria-label="Save">
          {t('Save')}
        </button>
      </Form>
    </Formik>
  );
}
