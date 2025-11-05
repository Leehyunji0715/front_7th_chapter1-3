import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByText('일정 로딩 완료!');
});

test('일정 Create => Update => Delete', async ({ page }) => {
  await page.getByLabel('제목').fill('일정 추가 테스트');
  await page.getByLabel('날짜').fill('2025-10-01');
  await page.getByLabel('시작 시간').fill('11:00');
  await page.getByLabel('종료 시간').fill('15:00');
  await page.getByLabel('설명').fill('이것은 Event 설명 테스트.');
  await page.getByLabel('위치').fill('Event 위치 값');

  await page.getByLabel('카테고리').click();
  await page.getByRole('option', { name: `기타-option` }).click();
});

// test('일정 Read', () => {}); // 주간 뷰, 월간 뷰.

// test('일정 Update', () => {});

// test('일정 Delete', () => {});
