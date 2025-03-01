import { Field, Form, Formik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TodoService } from '../api';
import { Todo } from '../types';
type Props = {
  id: number;
};
export function TodoDetail({ id }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const todoService: TodoService = useMemo(() => new TodoService(), []);
  const [loaded, setLoaded] = useState(false);
  const [todo, setTodo] = useState<Todo>(new Todo(id, '', undefined, false));

  useEffect(() => {
    todoService.getTodo(todo.id).then((value) => {
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
      onSubmit={async (values) => {
        await todoService.updateTodo(values);
        window.history.back();
      }}
    >
      <Form>
        <button
          type='button'
          className='btn-close float-end'
          aria-label='Close'
          onClick={() => window.history.back()}
        ></button>
        <div className='mb-3'>
          <label className='form-label' htmlFor='title'>
            {t('Title')}
          </label>
          <Field
            name='title'
            className='form-control'
            aria-label='Title'
            placeholder={t('Title')}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label' htmlFor='description'>
            {t('Description')}
          </label>
          <Field
            as='textarea'
            name='description'
            className='form-control'
            aria-label='Description'
            placeholder={t('Description')}
          />
        </div>
        <div className='mb-3'>
          <div className='form-check'>
            <Field name='done' type='checkbox' className='form-check-input' />
            <label className='form-check-label' htmlFor='done'>
              {t('Done')}
            </label>
          </div>
        </div>
        <button type='submit' className='btn btn-primary' aria-label='Save'>
          {t('Save')}
        </button>
      </Form>
    </Formik>
  );
}
