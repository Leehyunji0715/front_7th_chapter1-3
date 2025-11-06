import { test, expect } from '@playwright/test';

import { resetE2EDatabase } from '../utils';

// test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await resetE2EDatabase([
    {
      id: '2c27d1ee-b028-4536-85cf-ed2ec618311b',
      title: '고기',
      date: '2025-10-02',
      startTime: '11:00',
      endTime: '15:00',
      description: '이것은 Event 설명 테스트.',
      location: 'Event 위치 값',
      category: '업무',
      repeat: {
        type: 'weekly',
        interval: 3,
        endDate: '2025-11-01',
        id: '7cd8f26e-2254-4e65-80cb-3f66651f6e09',
      },
      notificationTime: 10,
    },
    {
      id: 'f0ac12e6-1361-4c63-8d9e-cdf100c90af0',
      title: '고기',
      date: '2025-10-23',
      startTime: '11:00',
      endTime: '15:00',
      description: '이것은 Event 설명 테스트.',
      location: 'Event 위치 값',
      category: '업무',
      repeat: {
        type: 'weekly',
        interval: 3,
        endDate: '2025-11-01',
        id: '7cd8f26e-2254-4e65-80cb-3f66651f6e09',
      },
      notificationTime: 10,
    },
  ]);
  await page.clock.setFixedTime(new Date('2025-10-01T00:00:00'));
  await page.goto('/');
  expect(await page.getByText('일정 검색')).toBeVisible();
});

test('반복 일정 Read', async ({ page }) => {
  const eventList = page.getByTestId('event-list');
  const eventCount = await eventList.getByText('고기').count();
  const repeatIconCount1 = await eventList.getByTestId('repeat-icon').count();
  expect(eventCount).toBe(2);
  expect(repeatIconCount1).toBe(2);

  const calendar = await page.getByTestId('month-view');
  const calendarEventCount = await calendar.getByText('고기').count();
  const repeatIconCount2 = await eventList.getByTestId('repeat-icon').count();
  expect(calendarEventCount).toBe(2);
  expect(repeatIconCount2).toBe(2);
});

test('반복 일정 Create', async ({ page }) => {
  await page.getByLabel('제목').fill('주간 회의');
  await page.getByLabel('날짜').fill('2025-10-01');
  await page.getByLabel('시작 시간').fill('11:00');
  await page.getByLabel('종료 시간').fill('15:00');
  await page.getByLabel('설명').fill('이것은 Event 설명 테스트.');
  await page.getByLabel('위치').fill('Event 위치 값');

  await page.getByLabel('반복 일정').click();
  await page.getByLabel('반복 간격').fill('3');
  await page.getByLabel('반복 종료일').fill('2025-11-01');
  await page.getByLabel('반복 유형').click();
  await page.getByRole('option', { name: `weekly-option` }).click();
  await page.getByRole('button', { name: /일정 추가/ }).click();

  // 이게 있어야 테스트가 통과가 된다.
  await expect(page.getByText('주간 회의').first()).toBeVisible();

  const eventList = await page.getByTestId('event-list');
  const eventCount = await eventList.getByText('주간 회의').count();

  const repeatIconCount1 = await eventList.getByTestId('repeat-icon').count();

  expect(eventCount).toBe(2);
  expect(repeatIconCount1).toBe(2 + 2);

  const calendar = await page.getByTestId('month-view');
  const calendarEventCount = await calendar.getByText('주간 회의').count();
  const repeatIconCount2 = await calendar.getByTestId('repeat-icon').count();

  expect(calendarEventCount).toBe(2);
  expect(repeatIconCount2).toBe(2 + 2);
});

test('반복 일정 수정 - 단일 일정', async ({ page }) => {
  await page
    .getByLabel(/Edit event/i)
    .first()
    .click();

  const modal = await page.getByText('해당 일정만 수정하시겠어요?');
  expect(modal).toBeInViewport();

  await page.getByRole('button', { name: '예' }).click();

  await page.getByLabel('제목').fill('일정 단일 수정');
  await page.getByRole('button', { name: /일정 수정/ }).click();

  await expect(page.getByText('일정 단일 수정').first()).toBeVisible();
  await expect(await page.getByText('일정 단일 수정').count()).toBe(2);
});

test('반복 일정 수정 - 전체 일정', async ({ page }) => {
  await page
    .getByLabel(/Edit event/i)
    .first()
    .click();

  const modal = await page.getByText('해당 일정만 수정하시겠어요?');
  expect(modal).toBeInViewport();

  await page.getByRole('button', { name: '아니오' }).click();

  await page.getByLabel('제목').fill('일정 모두 수정');
  await page.getByRole('button', { name: /일정 수정/ }).click();

  await expect(page.getByText('일정 모두 수정').first()).toBeVisible();
  await expect(await page.getByText('일정 모두 수정').count()).toBe(4);
});

test('반복 일정 삭제 - 단일 일정', async ({ page }) => {
  await page
    .getByLabel(/Delete event/i)
    .first()
    .click();

  const modal = await page.getByText('해당 일정만 삭제하시겠어요?');
  expect(modal).toBeInViewport();

  await page.getByRole('button', { name: '예' }).click();
  await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();

  await expect(await page.getByText('고기').count()).toBe(2);
});

test('반복 일정 삭제 - 단일 일정', async ({ page }) => {
  await page
    .getByLabel(/Delete event/i)
    .first()
    .click();

  const modal = await page.getByText('해당 일정만 삭제하시겠어요?');
  expect(modal).toBeInViewport();

  await page.getByRole('button', { name: '예' }).click();
  await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();

  await expect(await page.getByText('고기').count()).toBe(0);
});
