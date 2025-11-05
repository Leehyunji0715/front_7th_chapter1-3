import { test, expect } from '@playwright/test';

import { resetE2EDatabase } from '../utils';

test.beforeEach(async ({ page }) => {
  resetE2EDatabase();
  await page.clock.setFixedTime(new Date('2025-10-01T00:00:00'));
  await page.goto('/');
  await page.getByText('일정 로딩 완료!');
});

test('일정 Create => Update => Delete', async ({ page }) => {
  // STEP1: CREATE
  await page.getByLabel('제목').fill('새 회의');
  await page.getByLabel('날짜').fill('2025-10-01');
  await page.getByLabel('시작 시간').fill('11:00');
  await page.getByLabel('종료 시간').fill('15:00');
  await page.getByLabel('설명').fill('이것은 Event 설명 테스트.');
  await page.getByLabel('위치').fill('Event 위치 값');
  await page.getByLabel('카테고리').click();
  await page.getByRole('option', { name: `기타-option` }).click();
  await page.getByRole('button', { name: /일정 추가/ }).click();

  const eventList = page.getByTestId('event-list');
  await expect(eventList.getByText('새 회의')).toBeVisible();
  await expect(eventList.getByText('기타')).toBeVisible();

  const calendar = page.getByTestId('month-view');
  await expect(calendar.getByText('새 회의')).toBeVisible();

  // STEP2: UPDATE

  // STEP3: DELETE
});
