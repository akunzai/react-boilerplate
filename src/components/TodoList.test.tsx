import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { expect, test } from 'vitest';
import '../i18nForTests';
import { server } from '../mocks/server';
import { Todo } from '../types';
import { TodoList } from './TodoList';

const setup = () => {
  render(<TodoList />);
};

test('should renders as expected', async () => {
  setup();
  const links = await screen.findAllByRole('link');
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
  setup();
  server.use(
    http.delete('/api/todos/3', () => {
      return new HttpResponse(null, { status: 200 });
    }),
    http.get('/api/todos', () => {
      return HttpResponse.json([
        new Todo(1, 'Pay bills', '', true),
        new Todo(2, 'Read a book'),
      ]);
    })
  );
  const buttons = await screen.findAllByRole('button', { name: /Close/i });
  fireEvent.click(buttons[2]);
  await waitForElementToBeRemoved(
    screen.queryByRole('link', { name: /Buy eggs/ })
  );
  expect(screen.getAllByRole('link').length).toBe(2);
});

test('should update item when checkbox checked', async () => {
  setup();
  const inputs = await screen.findAllByRole('checkbox');
  fireEvent.click(inputs[2]);
  await waitFor(() => {
    expect(screen.getAllByRole('link')[2].getAttribute('class')).toContain(
      'text-decoration-line-through'
    );
  });
});

test('should not add item without any input', async () => {
  setup();
  fireEvent.click(await screen.findByRole('button', { name: /Add/i }));
  expect((await screen.findAllByRole('link')).length).toBe(3);
});

test('should not add item with blank input', async () => {
  setup();
  await userEvent.type(await screen.findByRole('textbox'), '   ');
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  expect((await screen.findAllByRole('link')).length).toBe(3);
});

test('should add item and clears the input', async () => {
  setup();
  await userEvent.type(await screen.findByRole('textbox'), 'Test');
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  await screen.findByText('Test');
  const link = screen.getByRole('link', { name: /Test/i });
  expect(link.textContent).toContain('Test');
  expect(link.getAttribute('href')).toBe('/todo/4');
});
