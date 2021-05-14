import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import '../i18nForTests';
import Counter from './Counter';

let container: HTMLElement | null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  if (container != null){
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  }
});

test('can render and update a counter', () => {
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const label = container?.querySelector('p');
  expect(label?.textContent).toBe('Current count: 0');
  
  const button = container?.querySelector('button');
  act(() => {
    button?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label?.textContent).toBe('Current count: 1');
});