import type { Meta, StoryObj } from '@storybook/react-vite';

import { CalendarTable } from '../components/CalendarTable';
import { Event } from '../types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '팀 미팅',
    date: '2025-10-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 약속',
    date: '2025-10-10',
    startTime: '12:00',
    endTime: '13:00',
    description: '친구와 점심',
    location: '레스토랑',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 15,
  },
  {
    id: '3',
    title: '반복 운동',
    date: '2025-10-18',
    startTime: '18:00',
    endTime: '19:00',
    description: '헬스장 운동',
    location: '헬스장',
    category: '개인',
    repeat: { id: 'repeat-1', type: 'weekly', interval: 1, endDate: '2025-12-01' },
    notificationTime: 30,
  },
  {
    id: '4',
    title: '반복 운동',
    date: '2025-10-25',
    startTime: '18:00',
    endTime: '19:00',
    description: '헬스장 운동',
    location: '헬스장',
    category: '개인',
    repeat: { id: 'repeat-1', type: 'weekly', interval: 1, endDate: '2025-12-01' },
    notificationTime: 30,
  },
];

const mockHolidays = {
  '2025-10-03': '개천절',
  '2025-10-05': '추석',
  '2025-10-06': '추석',
  '2025-10-07': '추석',
  '2025-10-09': '한글날',
};

const meta = {
  title: 'Calendar/CalendarTable',
  component: CalendarTable,
  tags: ['autodocs'],
  argTypes: {
    viewType: {
      control: { type: 'select' },
      options: ['month', 'week'],
      description: '타입에 따른 캘린더 뷰 렌더링 - month or week view',
    },
    currentDate: {
      control: { type: 'date' },
      description: 'Current date to display in calendar',
    },
    events: {
      control: { type: 'object' },
      description: 'Array of events to display',
    },
    holidays: {
      control: { type: 'object' },
      description: 'Holiday information keyed by date',
    },
    notifiedEventIds: {
      control: { type: 'object' },
      description: 'Array of event IDs that have notifications',
    },
  },
  args: {
    viewType: 'month',
    currentDate: new Date('2025-10-05'),
    events: mockEvents,
    holidays: mockHolidays,
    notifiedEventIds: [],
    setDate: () => {},
    saveEvent: async () => {},
    deleteEvent: async () => {},
  },
} satisfies Meta<typeof CalendarTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthView: Story = {
  args: {
    viewType: 'month',
    currentDate: new Date('2025-10-05'),
    notifiedEventIds: [],
  },
};

export const WeekView: Story = {
  args: {
    viewType: 'week',
    currentDate: new Date('2025-10-05'),
    notifiedEventIds: [],
  },
};

export const WithNotifications: Story = {
  args: {
    viewType: 'month',
    notifiedEventIds: ['1'],
  },
};

export const WithRepeatedEvents: Story = {
  args: {
    viewType: 'month',
    currentDate: new Date('2025-10-05'),
    events: [
      {
        id: '1',
        title: '반복 운동',
        date: '2025-10-9',
        startTime: '18:00',
        endTime: '19:00',
        description: '헬스장 운동',
        location: '헬스장',
        category: '개인',
        repeat: { id: 'repeat-1', type: 'weekly', interval: 2, endDate: '2025-11-01' },
        notificationTime: 30,
      },
      {
        id: '2',
        title: '반복 운동',
        date: '2025-10-23',
        startTime: '18:00',
        endTime: '19:00',
        description: '헬스장 운동',
        location: '헬스장',
        category: '개인',
        repeat: { id: 'repeat-1', type: 'weekly', interval: 2, endDate: '2025-11-01' },
        notificationTime: 30,
      },
    ],
    notifiedEventIds: [],
  },
};
