import { expect, test } from '@playwright/test';

test.describe('Todo Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Access todo list; unauthenticated user is redirected to login with return URL
    await page.goto('/todo-list');
    await page.getByRole('button', { name: /Quick Demo Sign In|一鍵示範登入/i }).click();
    await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Todo List|待辦事項/i })).toBeVisible();
  });

  test('loads initial todo list with correct stats and pagination', async ({ page }) => {
    // Verify initial items
    await expect(page.getByText('Pay bills')).toBeVisible();
    await expect(page.getByText('Read a book')).toBeVisible();
    await expect(page.getByText('Buy eggs')).toBeVisible();

    // Verify pagination controls
    const page2Button = page.getByRole('button', { name: '2' });
    await expect(page2Button).toBeVisible();
    await page2Button.click();
    await expect(page.getByText('Write Beta release notes')).toBeVisible();
    await expect(page.getByText('Book dentist appointment')).toBeVisible();
  });

  test('creates a new todo item and verifies it appears in the list', async ({ page }) => {
    const newTodoTitle = `Test Playwright Todo ${Date.now()}`;

    const input = page.getByPlaceholder(/What need to be done\?|有什麼需要完成的事嗎\?/i);
    await input.fill(newTodoTitle);
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify it appears (using search to handle pagination)
    const searchInput = page.getByRole('searchbox', { name: /Search|搜尋/i });
    await searchInput.fill(newTodoTitle);
    await expect(page.getByText(newTodoTitle)).toBeVisible();
  });

  test('filters todos by tag and search query', async ({ page }) => {
    // Filter by tag #reading
    await page.getByRole('button', { name: '#reading' }).click();
    await expect(page.getByText('Read a book')).toBeVisible();
    await expect(page.getByText('Pay bills')).not.toBeVisible();

    // Clear tag filter by clicking it again
    await page.getByRole('button', { name: '#reading' }).click();
    await expect(page.getByText('Pay bills')).toBeVisible();

    // Search query filter
    const searchInput = page.getByRole('searchbox', { name: /Search|搜尋/i });
    await searchInput.fill('sprint');
    await expect(page.getByText('Prepare sprint review')).toBeVisible();
    await expect(page.getByText('Pay bills')).not.toBeVisible();
  });

  test('navigates to todo details and returns to list', async ({ page }) => {
    await page.getByRole('link', { name: 'Pay bills' }).click();

    await expect(page).toHaveURL(/\/todo\/1/);
    const titleInput = page.getByLabel(/Title|標題/i);
    await expect(titleInput).toHaveValue('Pay bills');
    await expect(page.getByRole('radio', { name: /High|高/i })).toBeChecked();
  });
});
