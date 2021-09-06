import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useService } from 'react-service-container';
import Todo from './Todo';
import TodoService from './TodoService';

export default function TodoDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string | undefined>();
  const [done, setDone] = useState(false);
  const todoService = useService(TodoService);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    todoService.getTodo(Number(id)).subscribe((value) => {
      if (value !== undefined) {
        setLoaded(true);
        setTitle(value.title);
        setDescription(value.description);
        setDone(value.done);
      }
    });
  }, [id, todoService]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo = new Todo(Number(id), title, description, done);
    todoService.updateTodo(newTodo).subscribe(() => {
      history.goBack();
    });
  };

  if (!loaded) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
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
        <input
          className="form-control"
          name="title"
          aria-label="Title"
          placeholder={t('Title')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="description">
          {t('Description')}
        </label>
        <textarea
          className="form-control"
          name="description"
          aria-label="Description"
          placeholder={t('Description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            name="done"
            type="checkbox"
            checked={done}
            onChange={(e) => setDone(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="done">
            {t('Done')}
          </label>
        </div>
      </div>
      <button type="submit" className="btn btn-primary" aria-label="Save">
        {t('Save')}
      </button>
    </form>
  );
}
