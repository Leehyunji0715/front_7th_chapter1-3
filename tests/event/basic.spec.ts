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
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);
  await page.clock.setFixedTime(new Date('2025-10-01T00:00:00'));
  await page.goto('/');
  await page.getByText('일정 로딩 완료!');
});

test('일정 Read', async ({ page }) => {
  const eventList = page.getByTestId('event-list');
  await expect(eventList.getByText('점심 약속')).toBeVisible();

  const calendar = page.getByTestId('month-view');
  await expect(calendar.getByText('점심 약속')).toBeVisible();
});

test('일정 Create => Update => Delete', async ({ page }) => {
  await resetE2EDatabase();

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
  await expect(eventList.getByText('2025-10-01')).toBeVisible();
  await expect(eventList.getByText('기타')).toBeVisible();

  const calendar = page.getByTestId('month-view');
  await expect(calendar.getByText('새 회의')).toBeVisible();

  // STEP2: UPDATE
  await page.getByLabel(/Edit event/i).click();
  await page.getByLabel('제목').fill('수정한 회의');
  await page.getByLabel('날짜').fill('2025-10-02');
  await page.getByRole('button', { name: /일정 수정/ }).click();
  await expect(eventList.getByText('2025-10-02')).toBeVisible();
  await expect(calendar.getByText('수정한 회의')).toBeVisible();

  // STEP3: DELETE
  await page.getByLabel(/Delete event/i).click();
  await expect(page.getByText('일정이 삭제되었습니다')).toBeInViewport();
});
