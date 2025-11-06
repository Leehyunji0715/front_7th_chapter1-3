import type { Meta, StoryObj } from '@storybook/react-vite';

import { CalendarCell } from '../components/CalendarCell';
import { Event } from '../types';

const mockupEvents: Event[] = [
  {
    id: '1',
    title: '아침 회의',
    date: '2025-10-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '일일 스탠드업',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 약속',
    date: '2025-10-15',
    startTime: '12:00',
    endTime: '13:00',
    description: '동료와 점심',
    location: '레스토랑',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 15,
  },
  {
    id: '3',
    title: '저녁 운동 - 아주아주아주 긴 텍스트 헬스장에서 웨이트 트레이닝 및 유산소~~~~~',
    date: '2025-10-15',
    startTime: '19:00',
    endTime: '21:00',
    description: '주 3회 운동 계획',
    location: '피트니스 센터',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 60,
  },
];

const meta: Meta<typeof CalendarCell> = {
  title: 'Calendar/CalendarCell - Text Length Tests',
  component: CalendarCell,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '캘린더 테이블에서 다양한 텍스트 길이에 따른 UI 처리를 테스트하는 스토리',
      },
    },
  },
  // 스토리북 전용 CSS를 적용하기 위한 방법
  decorators: [
    (Story, context) => {
      const containerStyle = {
        width: '200px',
        border: '1px solid #e0e0e0',
      };

      const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
      } as const;

      return (
        <div style={containerStyle}>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <Story {...context} />
              </tr>
            </tbody>
          </table>
        </div>
      );
    },
  ],
  argTypes: {
    day: {
      control: { type: 'number', min: 1, max: 31 },
      description: '날짜',
    },
    holiday: {
      control: { type: 'text' },
      description: '공휴일명',
    },
  },
  args: {
    day: 15,
    dateString: '2025-10-15',
    holiday: '',
    events: mockupEvents,
    notifiedEventIds: [],
    setDate: () => {},
    setDraggedEvent: () => {},
    onDrop: async () => {},
  },
};

export default meta;
type Story = StoryObj<typeof CalendarCell>;

export const ShortEventTitles: Story = {
  name: '짧은 텍스트 이벤트 제목',
  args: {
    events: [mockupEvents[0], mockupEvents[1]],
    notifiedEventIds: ['2'],
  },
};

export const LongTextOverflow: Story = {
  name: '이벤트 긴 텍스트 오버플로우 처리',
  args: {
    events: [
      {
        ...mockupEvents[0],
        title:
          '매우 긴 제목의 이벤트입니다 - 이 제목이 셀 크기를 넘어서는 경우 어떻게 표시되는지 확인하는 테스트',
      },
      {
        ...mockupEvents[1],
        title:
          '2025년 4분기 전체 직원 회의 및 성과 발표회 그리고 내년도 사업계획 수립을 위한 워크샵',
      },
    ],
    notifiedEventIds: ['2'],
  },
};

// 7. 공휴일과 긴 텍스트 조합
export const HolidayWithLongText: Story = {
  name: '공휴일까지 있을 때 테이블 셀',
  args: {
    holiday: '크리스마스',
    events: [
      {
        ...mockupEvents[0],
        title: '크리스마스 특별 이벤트 및 가족 모임 준비를 위한 상세 계획 수립',
      },
      {
        ...mockupEvents[1],
        title: '연말 정리 작업',
      },
      mockupEvents[2],
    ],
    notifiedEventIds: ['1'],
  },
};
