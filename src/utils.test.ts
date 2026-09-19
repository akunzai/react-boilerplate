import { describe, expect, test } from 'vitest';
import { categoryLabel, flattenCategories, getBaseUrl, isOverdue } from './utils';

describe('isOverdue', () => {
  test('returns false when done or no dueDate', () => {
    expect(isOverdue(undefined, false)).toBe(false);
    expect(isOverdue('2020-01-01', true)).toBe(false);
  });

  test('checks date against today', () => {
    expect(isOverdue('2000-01-01', false)).toBe(true);
    expect(isOverdue('2099-12-31', false)).toBe(false);
  });
});

describe('categoryLabel', () => {
  test('returns formatted category string', () => {
    expect(categoryLabel(undefined)).toBe('');
    expect(categoryLabel('personal/errands')).toBe('Personal / Errands');
    expect(categoryLabel('unknown/path')).toBe('');
  });
});

describe('flattenCategories', () => {
  test('returns flattened category items with depth', () => {
    const list = flattenCategories();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('depth');
    expect(list[0]).toHaveProperty('value');
    expect(list[0]).toHaveProperty('label');
  });
});

describe('getBaseUrl', () => {
  test('returns stripped base href or empty', () => {
    const base = document.createElement('base');
    base.setAttribute('href', '/react-showcase/');
    document.head.appendChild(base);

    expect(getBaseUrl()).toBe('/react-showcase');

    base.setAttribute('href', '/');
    expect(getBaseUrl()).toBe('');

    document.head.removeChild(base);
  });
});
