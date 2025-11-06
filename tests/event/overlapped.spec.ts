import { test, expect } from '@playwright/test';

import { resetE2EDatabase } from '../utils';

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-10-01T00:00:00'));
  await page.goto('/');
  await page.getByText('일정 검색');
});

test.describe('반복 일정 Create', () => {
  test.beforeEach(async () => {
    await resetE2EDatabase();
  });

  test('반복 일정 Create => Update => Delete', async ({ page }) => {
    // STEP1: CREATE
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

    const eventList = page.getByTestId('event-list');
    const eventCount = await eventList.getByText('주간 회의').count();
    const repeatIconCount1 = await eventList.getByTestId('repeat-icon').count();
    expect(eventCount).toBe(2);
    expect(repeatIconCount1).toBe(2);

    const calendar = await page.getByTestId('month-view');
    const calendarEventCount = await calendar.getByText('주간 회의').count();
    const repeatIconCount2 = await eventList.getByTestId('repeat-icon').count();
    expect(calendarEventCount).toBe(2);
    expect(repeatIconCount2).toBe(2);

    // STEP2: UPDATE
    // await page.getByLabel(/Edit event/i).click();
    // await page.getByLabel('제목').fill('수정한 회의');
    // await page.getByLabel('날짜').fill('2025-10-02');
    // await page.getByRole('button', { name: /일정 수정/ }).click();
    // await expect(eventList.getByText('2025-10-02')).toBeVisible();
    // await expect(calendar.getByText('수정한 회의')).toBeVisible();

    // // STEP3: DELETE
    // await page.getByLabel(/Delete event/i).click();
    // await expect(page.getByText('일정이 삭제되었습니다')).toBeInViewport();
  });
});

test('반복 일정 수정 - 단일 일정 수정', () => {});
