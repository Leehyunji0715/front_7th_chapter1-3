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
    {
      id: '2',
      title: '저녁 약속',
      date: '2025-10-11',
      startTime: '17:00',
      endTime: '19:30',
      description: '친구랑',
      location: '선릉역 근처',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);
  await page.clock.setFixedTime(new Date('2025-10-01T00:00:00'));
  await page.goto('/');
  expect(await page.getByText('일정 로딩 완료!').last()).toBeVisible();
});

test('READ - "저녁 약속" 검색 시, "점심 약속"이 안 보인다.', async ({ page }) => {
  const eventList = page.getByTestId('event-list');
  await expect(eventList.getByText('점심 약속')).toBeVisible();

  const calendar = page.getByTestId('month-view');
  await expect(calendar.getByText('점심 약속')).toBeVisible();

  await page.getByLabel('일정 검색').fill('저녁 약속');

  await expect(calendar.getByText('점심 약속')).not.toBeVisible();
  await expect(eventList.getByText('점심 약속')).not.toBeVisible();
  await expect(calendar.getByText('저녁 약속')).toBeVisible();
  await expect(eventList.getByText('저녁 약속')).toBeVisible();
});

test('CREATE - "회의" 라고 검색/필터링 후 "회의" 일정 추가하기', async ({ page }) => {
  await page.getByLabel('일정 검색').fill('회의');

  await page.getByLabel('제목').fill('회의');
  await page.getByLabel('날짜').fill('2025-10-01');
  await page.getByLabel('시작 시간').fill('11:00');
  await page.getByLabel('종료 시간').fill('15:00');
  await page.getByLabel('설명').fill('Event 설명');
  await page.getByLabel('위치').fill('Event 위치 값');
  await page.getByRole('button', { name: /일정 추가/ }).click();

  const eventList = page.getByTestId('event-list');
  const calendar = page.getByTestId('month-view');
  await expect(eventList.getByText('회의')).toBeVisible();
  await expect(eventList.getByText('11:00 - 15:00')).toBeVisible();

  await expect(calendar.getByText('회의')).toBeVisible();
  await expect(calendar.getByText('점심 약속')).not.toBeVisible();

  await expect(eventList.getByText('회의')).toBeVisible();
  await expect(eventList.getByText('점심 약속')).not.toBeVisible();
});

test('UPDATE - "점심 약속" 을 "아침 약속" 이라고 수정 후, "아침 약속"으로 필터링하기', async ({
  page,
}) => {
  await page.getByLabel('일정 검색').fill('점심 약속');
  await expect(page.getByText('점심 약속').last()).toBeVisible();
  await expect(page.getByText('아침 약속')).not.toBeVisible();

  const eventList = page.getByTestId('event-list');
  await expect(eventList.getByText('점심 약속')).toBeVisible();
  await page
    .getByLabel(/Edit event/i)
    .last()
    .click();
  await page.getByLabel('제목').fill('아침 약속');
  await page.getByRole('button', { name: /일정 수정/ }).click();
  expect(await page.getByText('일정이 수정되었습니다')).toBeVisible();

  // 점심 약속은 안 보인다. 이제 수정한 아침 약속만 보인다.
  await expect(eventList.getByText('점심 약속')).not.toBeVisible();

  await page.getByLabel('일정 검색').fill('아침 약속');
  await expect(page.getByText('점심 약속')).not.toBeVisible();
  await expect(eventList.getByText('아침 약속')).toBeVisible();
});

test('DELETE - "점심 약속" 검색해서 확인 후, 삭제 후 안보이게 된다.', async ({ page }) => {
  await page.getByLabel('일정 검색').fill('점심 약속');
  await expect(page.getByText('점심 약속').last()).toBeVisible();

  await page
    .getByLabel(/Delete event/i)
    .last()
    .click();
  expect(await page.getByText('일정이 삭제되었습니다')).toBeVisible();

  const eventList = page.getByTestId('event-list');
  await expect(eventList.getByText('점심 약속')).not.toBeVisible();
});
