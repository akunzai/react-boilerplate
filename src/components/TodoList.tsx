import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TodoService } from '../api';
import { Todo } from '../types';

export function TodoList(): JSX.Element {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const todoService = useMemo(() => new TodoService(), []);
  const { t } = useTranslation();

  useEffect(() => {
    todoService.getTodoList().subscribe((values) => {
      setTodos(values);
    });
  }, [todoService]);

  const handleRemove = (todo: Todo) => {
    todoService.deleteTodo(todo).subscribe((_) => {
      setTodos(todos.filter((x) => x !== todo));
    });
  };

  const handleUpdate = (id: number, done: boolean) => {
    const todo = todos.find((x) => x.id === id);
    if (todo === undefined) return;
    const newTodo = Object.assign(todo, { done: done });
    todoService.updateTodo(newTodo).subscribe((_) => {
      const index = todos.findIndex((x) => x.id === id);
      if (index > -1) {
        const newTodos = [...todos];
        newTodos[index] = newTodo;
        setTodos(newTodos);
      }
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    const newTodo = { title: trimmedTitle, done: false } as Todo;
    todoService.addTodo(newTodo).subscribe((value) => {
      const newTodos = [...todos];
      if (!newTodos.some((x) => x.id === value.id)) {
        newTodos.push(value);
      }
      setTodos(newTodos);
    });
    setTitle('');
  };

  return (
    <div className='row justify-content-md-center'>
      <div className='col-6'>
        <h1>{t('Todo List')}</h1>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <input
              type='text'
              className='form-control'
              name='title'
              placeholder={t('What need to be done?')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <button
              className='btn btn-outline-secondary'
              type='submit'
              aria-label='Add'
            >
              <i className='bi bi-plus'></i>
            </button>
          </div>
        </form>
        <div className='todo list-group'>
          {todos.map((todo) => (
            <div
              key={todo.id}
              className='list-group-item list-group-item-action'
            >
              <div className='d-flex w-100 justify-content-between'>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    name='done'
                    type='checkbox'
                    checked={todo.done}
                    onChange={(e) => handleUpdate(todo.id, e.target.checked)}
                  />
                </div>
                <Link
                  className={todo.done ? 'text-decoration-line-through' : ''}
                  to={`/todo/${todo.id}`}
                >
                  {todo.title}
                </Link>
                <button
                  type='button'
                  className='btn-close'
                  aria-label='Close'
                  onClick={(e) => handleRemove(todo)}
                ></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
