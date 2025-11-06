import type { Meta, StoryObj } from '@storybook/react-vite';

import RecurringEventDialog from '../components/RecurringEventDialog';
import { Event } from '../types';

const mockRecurringEvent: Event = {
  id: '1',
  title: '매주 팀 회의',
  date: '2025-10-15',
  startTime: '14:00',
  endTime: '15:00',
  description: '주간 팀 미팅',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
  notificationTime: 15,
};

const meta: Meta<typeof RecurringEventDialog> = {
  title: 'Dialog/RecurringEventDialog',
  component: RecurringEventDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: '다이얼로그 열림/닫힘 상태',
    },
    mode: {
      control: { type: 'select' },
      options: ['edit', 'delete'],
      description: '반복 일정 수정 또는 삭제 모드',
    },
    event: {
      control: { type: 'object' },
      description: '반복 일정 이벤트 객체',
    },
  },
  args: {
    open: true,
    event: mockRecurringEvent,
    mode: 'edit',
    onClose: () => {},
    onConfirm: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 반복 일정 수정 다이얼로그
export const EditRecurringEvent: Story = {
  args: {
    mode: 'edit',
    event: mockRecurringEvent,
  },
};

// 반복 일정 삭제 다이얼로그
export const DeleteRecurringEvent: Story = {
  args: {
    mode: 'delete',
    event: mockRecurringEvent,
  },
};
