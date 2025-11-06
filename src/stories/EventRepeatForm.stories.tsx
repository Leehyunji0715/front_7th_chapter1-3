import type { Meta, StoryObj } from '@storybook/react-vite';

import { EventRepeatForm } from '../components/RepeatInputForm';
import { Event } from '../types';

const mockRecurringEvent: Event = {
  id: '1',
  title: '매주 팀 회의',
  date: '2025-10-01',
  startTime: '14:00',
  endTime: '15:00',
  description: '주간 팀 미팅',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'weekly', interval: 1, endDate: '2025-11-01' },
  notificationTime: 10,
};

const meta: Meta<typeof EventRepeatForm> = {
  title: 'Form/EventRepeatForm',
  component: EventRepeatForm,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    editingEvent: { control: { type: 'object' }, description: '이벤트' },
    isRepeating: { control: { type: 'boolean' }, description: 'isRepeating 여부' },
    repeatType: {
      control: { type: 'select' },
      options: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      description: '이벤트 카테고리',
    },
    repeatInterval: { control: { type: 'number' }, description: '반복 간격' },
    repeatEndDate: { control: { type: 'date' }, description: '반복 종료 날짜' },
  },
  args: {
    editingEvent: null,
    isRepeating: true,
    repeatType: undefined,
    repeatInterval: 1,
    repeatEndDate: '2025-11-01',
    setIsRepeating: () => {},
    setRepeatType: () => {},
    setRepeatInterval: () => {},
    setRepeatEndDate: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultForm: Story = {
  name: '기본 반복 X 상태',
  args: {
    isRepeating: false,
  },
};

export const IsRepeatingCheckedForm: Story = {
  name: '기본 반복 O 상태',
  args: {
    isRepeating: true,
  },
};

export const FilledForm: Story = {
  name: '입력된 폼 상태',
  args: {
    isRepeating: true,
    repeatType: 'weekly',
    repeatInterval: 2,
    repeatEndDate: '2025-12-31',
  },
};

export const NotShownWhenEditingForm: Story = {
  name: 'Editing Event일 때는 보이지 않는 상태',
  args: {
    isRepeating: true,
    repeatType: 'weekly',
    editingEvent: mockRecurringEvent,
  },
};
