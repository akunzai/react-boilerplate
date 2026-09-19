import { expect, test } from '@playwright/test';

test.describe('Authentication and Route Protection', () => {
  test('redirects unauthenticated visitor from root to login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login\?from=%2F/);
    await expect(page.getByRole('heading', { name: /Sign in|登入/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Sign in|登入/i })).toBeVisible();
  });

  test('redirects unauthenticated visitor from protected route with return url', async ({
    page,
  }) => {
    await page.goto('/todo-list');
    await expect(page).toHaveURL(/\/login\?from=%2Ftodo-list/);
    await expect(page.getByRole('heading', { name: /Sign in|登入/i })).toBeVisible();
  });

  test('validates form fields and displays error on incorrect credentials', async ({ page }) => {
    await page.goto('/login');

    // Submit empty form
    await page.getByRole('button', { name: /^(Sign in|登入)$/i }).click();
    await expect(page.getByText(/Email is required|請輸入電子郵件/i)).toBeVisible();
    await expect(page.getByText(/Password is required|請輸入密碼/i)).toBeVisible();

    // Invalid email format
    const emailInput = page.getByLabel(/Email|電子郵件/i);
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    await expect(page.getByText(/Enter a valid email|請輸入有效的電子郵件/i)).toBeVisible();

    // Incorrect password
    await emailInput.fill('ada@example.com');
    await page.locator('#login-password').fill('wrong-password');
    await page.getByRole('button', { name: /^(Sign in|登入)$/i }).click();
    await expect(page.getByRole('alert')).toContainText(
      /Invalid email or password|電子郵件或密碼錯誤/i,
    );
  });

  test('signs in via Quick Demo button and navigates to requested return URL', async ({ page }) => {
    await page.goto('/todo-list');
    await expect(page).toHaveURL(/\/login\?from=%2Ftodo-list/);

    await page.getByRole('button', { name: /Quick Demo Sign In|一鍵示範登入/i }).click();
    await expect(page).toHaveURL(/\/todo-list/);
    await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Todo List|待辦事項/i })).toBeVisible();
  });

  test('supports full sign-out flow from user account dropdown', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Quick Demo Sign In|一鍵示範登入/i }).click();
    await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();

    // Open account dropdown and click Sign out
    await page.getByRole('button', { name: 'Account' }).click();
    await expect(page.getByText('ada@example.com')).toBeVisible();
    await page.getByRole('button', { name: /Sign out|登出/i }).click();

    // Should redirect to login and show Sign in link in nav
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('link', { name: /Sign in|登入/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Account' })).not.toBeVisible();
  });
});
