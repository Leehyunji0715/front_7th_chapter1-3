import type { Meta, StoryObj } from '@storybook/react-vite';

import { OverlappedEventDialog } from '../components/OverlappedEventDialog';
import { Event } from '../types';

const mockEvents: Event[] = [
  {
    id: '1',
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
];

const meta = {
  title: 'Dialog/OverlappedEventDialog',
  component: OverlappedEventDialog,
  argTypes: {
    open: {
      control: { type: 'select' },
      options: [true, false],
      description: '타입에 따른 캘린더 뷰 렌더링 - month or week view',
    },
    overlappingEvents: {
      control: { type: 'object' },
      description: '겹치는 일정 배열',
    },
  },
  args: {
    open: true,
    overlappingEvents: mockEvents,
    setOpen: () => {},
    onApply: () => {},
  },
} satisfies Meta<typeof OverlappedEventDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultView: Story = {
  args: {},
};
