import { test, expect } from '@playwright/test';

import { resetE2EDatabase } from '../utils';

test.beforeEach(async ({ page }) => {
  await resetE2EDatabase([
    {
      id: '1',
      title: '점심 약속',
      date: '2025-10-10',
      startTime: '12:00',
      endTime: '14:30',
      description: '친구랑',
      location: '선릉역 근처',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);
  await page.clock.setFixedTime(new Date('2025-10-01T00:00:00'));
  await page.goto('/');
});

test('일정 겹침 경고 - 계속 진행 하기', async ({ page }) => {
  await page.getByLabel('제목').fill('겹침 이벤트');
  await page.getByLabel('날짜').fill('2025-10-10');
  await page.getByLabel('시작 시간').fill('10:00');
  await page.getByLabel('종료 시간').fill('15:00');
  await page.getByLabel('설명').fill('이것은 겹치는 이벤트');
  await page.getByLabel('위치').fill('위치 값');
  await page.getByRole('button', { name: /일정 추가/ }).click();

  const modal = await page.getByText('일정 겹침 경고');
  expect(modal).toBeInViewport();

  await page.getByRole('button', { name: '계속 진행' }).click();
  await expect(page.getByText('겹침 이벤트').first()).toBeVisible();
  await expect(await page.getByText('겹침 이벤트').count()).toBe(2);
});

test('일정 겹침 경고 - 취소 하기', async ({ page }) => {
  await page.getByLabel('제목').fill('겹치는 이벤트');
  await page.getByLabel('날짜').fill('2025-10-10');
  await page.getByLabel('시작 시간').fill('10:00');
  await page.getByLabel('종료 시간').fill('15:00');
  await page.getByLabel('설명').fill('겹치는 이벤트');
  await page.getByLabel('위치').fill('위치 값');
  await page.getByRole('button', { name: /일정 추가/ }).click();

  const modal = await page.getByText('일정 겹침 경고');
  expect(modal).toBeInViewport();

  await page.getByRole('button', { name: '취소' }).click();
  await expect(page.getByText('겹치는 이벤트').first()).not.toBeVisible();
  await expect(await page.getByText('겹치는 이벤트').count()).toBe(0);
});
