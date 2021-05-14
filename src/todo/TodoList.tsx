import { useState, useEffect, FormEvent } from 'react';
import { useService } from "react-service-container";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Todo from './Todo';
import TodoService from './TodoService';

export default function TodoList() {
    const [title, setTitle] = useState('');
    const [todos, setTodos] = useState<Todo[]>([]);
    const todoService = useService(TodoService);
    const { t } = useTranslation();

    useEffect(() => {
        todoService
            .getTodos()
            .subscribe(values => {
                setTodos(values);
            })
    }, [todoService]);

    const handleRemove = (item: Todo) => {
        todoService.deleteTodo(item).subscribe(value => {
            if (todos.some(x => x.id === item.id)) {
                const newTodos = todos.filter((x) => x !== item);
                setTodos(newTodos);
            }
        });
    }

    const handleUpdate = (id: number, done: boolean) => {
        let todo = todos.find(x => x.id === id);
        if (todo === undefined) return;
        const newTodo = Object.assign(todo, { done: done });
        todoService.updateTodo(newTodo).subscribe(_ => {
            let index = todos.findIndex(x => x.id === id);
            if (index > -1) {
                const newTodos = [...todos];
                newTodos[index] = newTodo;
                setTodos(newTodos);
            }
        });
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let trimmedTitle = title.trim();
        if (!trimmedTitle) {
            return;
        }
        const newTodo = { title: trimmedTitle } as Todo;
        todoService.addTodo(newTodo).subscribe(value => {
            const newTodos = [...todos];
            if (!newTodos.some(x => x.id === value.id)) {
                newTodos.push(value);
            }
            setTodos(newTodos);
        });
        setTitle('');
    }

    return (
        <div className="row justify-content-md-center">
            <div className="col-6">
                <h1>{t('Todo List')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            placeholder={t('What need to be done?')}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="submit"
                            id="button-addon2"
                        >
                            <i className="bi bi-plus"></i>
                        </button>
                    </div>
                </form>
                <div className="todo list-group">
                    {todos.map((todo) => (
                        <div key={todo.id} className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        name="done"
                                        type="checkbox"
                                        checked={todo.done}
                                        onChange={e => handleUpdate(todo.id, e.target.checked)}
                                    />
                                </div>
                                <Link className={todo.done ? "text-decoration-line-through" : ""} to={`/todo/${todo.id}`}>{todo.title}</Link>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={e => handleRemove(todo)}
                                ></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}