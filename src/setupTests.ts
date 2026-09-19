// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetAuth } from './mocks/handlers';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetAuth();
});
afterAll(() => server.close());
