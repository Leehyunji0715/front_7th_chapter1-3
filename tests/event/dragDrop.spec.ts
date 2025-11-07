import { test, expect } from '@playwright/test';

import { resetE2EDatabase } from '../utils';

test.beforeEach(async ({ page }) => {
  await resetE2EDatabase([
    {
      id: '1',
      title: '점심 약속',
      date: '2025-10-20',
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
  expect(await page.getByText('일정 로딩 완료!').last()).toBeVisible();
});

test('10월 20일 이벤트를 10월 21일로 드래드앤드롭으로 옮긴다.', async ({ page }) => {
  const calendar = page.getByTestId('month-view');
  const oct20Cell = calendar.getByRole('cell', { name: '20' });
  const oct21Cell = calendar.getByRole('cell', { name: '21' });

  // 10월 20일에 존재, 21에는 없음.
  await expect(oct20Cell.getByText('점심 약속')).toBeVisible();
  await expect(oct21Cell.getByText('점심 약속')).not.toBeVisible();

  // 21일 셀에서 '점심 약속'을 정확히 찾기
  const eventInOct21 = await oct21Cell.getByText('점심 약속', { exact: true }).count();
  expect(eventInOct21).toBe(0);

  // 이벤트 요소를 클릭해서 선택 상태로 만들기
  const eventElement = oct20Cell.getByText('점심 약속');
  await eventElement.click();
  await eventElement.dragTo(oct21Cell);

  await page.waitForResponse(
    (response) => response.url().includes('/api/events') && response.status() === 200
  );

  await expect(oct20Cell.getByText('점심 약속')).not.toBeVisible();
  await expect(oct21Cell.getByText('점심 약속')).toBeVisible();
});
