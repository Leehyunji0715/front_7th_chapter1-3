import type { Meta, StoryObj } from '@storybook/react-vite';

import { EventBasicForm } from '../components/EventBasicForm';

const meta: Meta<typeof EventBasicForm> = {
  title: 'Form/EventBasicForm',
  component: EventBasicForm,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    title: { control: { type: 'text' }, description: '이벤트 제목' },
    date: { control: { type: 'date' }, description: '이벤트 날짜' },
    startTime: { control: { type: 'text' }, description: '시작 시간' },
    endTime: { control: { type: 'text' }, description: '종료 시간' },
    description: { control: { type: 'text' }, description: '이벤트 설명' },
    location: { control: { type: 'text' }, description: '이벤트 위치' },
    category: {
      control: { type: 'select' },
      options: ['업무', '개인', '가족', '기타'],
      description: '이벤트 카테고리',
    },
    startTimeError: { control: { type: 'text' }, description: '시작 시간 에러 메시지' },
    endTimeError: { control: { type: 'text' }, description: '종료 시간 에러 메시지' },
  },
  args: {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: '업무',
    startTimeError: null,
    endTimeError: null,

    // Mock handlers
    setTitle: () => {},
    setDate: () => {},
    setStartTime: () => {},
    setEndTime: () => {},
    setDescription: () => {},
    setCategory: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyForm: Story = {
  name: '빈 폼 상태',
  args: {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: '업무',
  },
};

export const FilledForm: Story = {
  name: '입력된 폼 상태',
  args: {
    title: '팀 미팅',
    date: '2025-11-15',
    startTime: '14:00',
    endTime: '15:00',
    description: '주간 팀 미팅입니다',
    location: '회의실 A',
    category: '업무',
  },
};

export const WithTimeErrors: Story = {
  name: '시간 에러 상태',
  args: {
    title: '잘못된 시간 설정',
    date: '2025-11-15',
    startTime: '15:00',
    endTime: '14:00', // 시작 시간보다 이른 종료 시간
    startTimeError: '시작 시간이 종료 시간보다 늦을 수 없습니다',
    endTimeError: '종료 시간이 시작 시간보다 빨라야 합니다',
  },
};
