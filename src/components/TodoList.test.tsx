import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ServiceContainer } from 'react-service-container';
import { TodoService } from '../api';
import '../i18nForTests';
import { rest, server } from '../mocks/server';
import { Todo } from '../types';
import { TodoList } from './TodoList';

const setup = async () => {
  render(
    <ServiceContainer providers={[TodoService]}>
      <MemoryRouter>
        <TodoList />
      </MemoryRouter>
    </ServiceContainer>
  );
  await waitFor(() => expect(screen.getAllByRole('link').length).toBe(3));
};

test('should renders as expected', async () => {
  await setup();
  const links = screen.getAllByRole('link');
  expect(links.length).toBe(3);
  expect(links[0].textContent).toContain('Pay bills');
  expect(links[0].getAttribute('href')).toBe('/todo/1');
  expect(links[1].textContent).toContain('Read a book');
  expect(links[1].getAttribute('href')).toBe('/todo/2');
  expect(links[2].textContent).toContain('Buy eggs');
  expect(links[2].getAttribute('href')).toBe('/todo/3');

  const inputs = screen
    .getAllByRole('checkbox')
    .map((x) => x as HTMLInputElement);
  expect(inputs.length).toBe(3);
  expect(inputs[0].checked).toBeTruthy();
  expect(inputs[1].checked).toBeFalsy();
  expect(inputs[2].checked).toBeFalsy();
});

test('should remove item when delete button clicked', async () => {
  await setup();
  server.use(
    rest.delete('/api/todos/3', (req, res, ctx) => {
      return res(ctx.json(req.body));
    }),
    rest.get('/api/todos', (req, res, ctx) => {
      return res(
        ctx.json([
          new Todo(1, 'Pay bills', '', true),
          new Todo(2, 'Read a book'),
        ])
      );
    })
  );
  const buttons = screen.getAllByRole('button', { name: /Close/i });
  fireEvent.click(buttons[2]);
  await waitForElementToBeRemoved(
    screen.queryByRole('link', { name: /Buy eggs/ })
  );
  expect(screen.getAllByRole('link').length).toBe(2);
});

test('should update item when checkbox checked', async () => {
  await setup();
  const inputs = screen.getAllByRole('checkbox');
  fireEvent.click(inputs[2]);
  await waitFor(() => {
    expect(screen.getAllByRole('link')[2].getAttribute('class')).toContain(
      'text-decoration-line-through'
    );
  });
});

test('should not add item without any input', async () => {
  await setup();
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  expect((await screen.findAllByRole('link')).length).toBe(3);
});

test('should not add item with blank input', async () => {
  await setup();
  userEvent.type(screen.getByRole('textbox'), '   ');
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  expect((await screen.findAllByRole('link')).length).toBe(3);
});

test('should add item and clears the input', async () => {
  await setup();
  userEvent.type(screen.getByRole('textbox'), 'Test');
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  await screen.findByText('Test');
  const link = screen.getByRole('link', { name: /Test/i });
  expect(link.textContent).toContain('Test');
  expect(link.getAttribute('href')).toBe('/todo/4');
});
