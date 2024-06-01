import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { TodoService } from '../api';
import { Todo } from '../types';

export function TodoList(): JSX.Element {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const todoService: TodoService = useMemo(() => new TodoService(), []);
  const { t } = useTranslation();

  useEffect(() => {
    todoService.getTodoList().then((values) => {
      setTodos(values);
    });
  }, [todoService]);

  const handleRemove = async (todo: Todo) => {
    await todoService.deleteTodo(todo);
    setTodos(todos.filter((x: Todo) => x !== todo));
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    const newTodo = { title: trimmedTitle, done: false } as Todo;
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
                  href={`/todo/${todo.id}`}
                  className={todo.done ? 'text-decoration-line-through' : ''}
                >
                  {todo.title}
                </Link>
                <button
                  type='button'
                  className='btn-close'
                  aria-label='Close'
                  onClick={() => handleRemove(todo)}
                ></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
