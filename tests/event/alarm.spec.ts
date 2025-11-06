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
  await page.clock.setFixedTime(new Date('2025-10-10T11:49:59'));
  await page.goto('/');
});

test('알림이 울리는 경우', async ({ page }) => {
  await expect(page.getByText('점심 약속').first()).toBeVisible();
  await expect(page.getByText('10분 후 점심 약속 일정이 시작됩니다.')).not.toBeVisible();

  page.clock.setFixedTime(new Date('2025-10-10T11:50'));
  await expect(page.getByText('10분 후 점심 약속 일정이 시작됩니다.')).toBeVisible();
});
