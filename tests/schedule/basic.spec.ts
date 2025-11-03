import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('일정 Create', async ({ page }) => {
  await page.getByLabel('제목').fill('일정 추가 테스트');
  //   await page.getByLabel('날짜').fill('일정 추가 테스트');
});

test('일정 Read', () => {}); // 주간 뷰, 월간 뷰.

test('일정 Update', () => {});

test('일정 Delete', () => {});
