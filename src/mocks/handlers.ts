import { http, HttpResponse } from 'msw';
import { Todo, User } from '../types';

const db: Todo[] = [
  new Todo(
    1,
    'Pay bills',
    '',
    true,
    'high',
    ['finance', 'urgent'],
    'personal/errands',
    '2026-01-10',
  ),
  new Todo(2, 'Read a book', undefined, false, 'low', ['reading'], 'personal/health'),
  new Todo(
    3,
    'Buy eggs',
    undefined,
    false,
    'medium',
    ['shopping', 'home'],
    'personal/errands',
    '2099-12-31',
  ),
  new Todo(
    4,
    'Prepare sprint review',
    'Slides and demo',
    false,
    'high',
    ['urgent'],
    'work/meetings',
    '2026-01-05',
  ),
  new Todo(5, 'Refactor Alpha API', undefined, false, 'medium', [], 'work/projects/alpha'),
  new Todo(6, 'Write Beta release notes', undefined, true, 'low', [], 'work/projects/beta'),
  new Todo(
    7,
    'Book dentist appointment',
    undefined,
    false,
    'medium',
    ['home'],
    'personal/health',
    '2099-06-01',
  ),
];

const me: User = { name: 'Ada Lovelace', email: 'ada@example.com' };

export const handlers = [
  http.get('/api/me', () => HttpResponse.json(me)),
  http.put('/api/me', async ({ request }) => {
    Object.assign(me, (await request.json()) as User);
    return HttpResponse.json(me);
  }),
  http.post('/api/login', async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    if (email === me.email && password === 'password') {
      return HttpResponse.json(me);
    }
    return new HttpResponse(null, { status: 401 });
  }),
  http.get('/api/todos', () => {
    return HttpResponse.json(db);
  }),
  http.get('/api/todos/:id', ({ params }) => {
    const { id } = params;
    const todo = db.find((x) => x.id === Number(id));
    if (todo === undefined) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(todo);
  }),
  http.post('/api/todos', async ({ request }) => {
    const todo = (await request.json()) as Todo;
    if (!todo.id) {
      todo.id = db.length > 0 ? Math.max(...db.map((x) => x.id)) + 1 : 1;
    }
    db.push(todo);
    return HttpResponse.json(todo);
  }),
  http.delete('/api/todos/:id', ({ params }) => {
    const { id } = params;
    const index = db.findIndex((x) => x.id === Number(id));
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(db.splice(index, 1)[0]);
  }),
  http.put('/api/todos/:id', async ({ params, request }) => {
    const { id } = params;
    const index = db.findIndex((x) => x.id === Number(id));
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const todo = (await request.json()) as Todo;
    db[index] = todo;
    return new HttpResponse(null, { status: 200 });
  }),
];
