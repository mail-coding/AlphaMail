import { create } from 'zustand';

interface Schedule {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface ValidationErrors {
  title?: string;
  date?: string;
  description?: string;
}

interface HomeState {
  // 일정 관련 상태
  schedule: Schedule;
  scheduleErrors: ValidationErrors;
  
  // 일정 액션
  setScheduleTitle: (title: string) => void;
  setScheduleStartDate: (date: string) => void;
  setScheduleEndDate: (date: string) => void;
  setScheduleStartTime: (time: string) => void;
  setScheduleEndTime: (time: string) => void;
  setScheduleDescription: (description: string) => void;
  validateSchedule: () => boolean;
  resetSchedule: () => void;
  
  // AI 어시스턴트 관련 상태
  activeRowId: string | null;
  activeRowType: string | null;
  setActiveRow: (id: string | null, type: string | null) => void;
  setActiveRowId: (id: string | null) => void;
}

export const useHomeStore = create<HomeState>((set, get) => ({
  // 일정 초기 상태
  schedule: {
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    description: ''
  },
  scheduleErrors: {},
  
  // 일정 액션
  setScheduleTitle: (title) => {
    // 50자 제한 적용
    if (title.length <= 50) {
      set((state) => ({
        schedule: { ...state.schedule, title }
      }));
    }
  },
  
  setScheduleStartDate: (startDate) => {
    set((state) => {
      // 시작일이 변경되면 종료일과 종료시간 초기화 (유효성 검사를 위해)
      return {
        schedule: { 
          ...state.schedule, 
          startDate,
          endDate: '', // 종료일 초기화
          endTime: ''  // 종료시간 초기화
        }
      };
    });
  },
  
  setScheduleEndDate: (endDate) => {
    const { schedule } = get();
    
    // 시작일과 시작시간이 모두 설정된 경우에만 종료일 설정 가능
    if (schedule.startDate && schedule.startTime) {
      set((state) => ({
        schedule: { 
          ...state.schedule, 
          endDate,
          // 종료일이 변경되면 종료시간 초기화
          endTime: '' 
        }
      }));
    }
  },
  
  setScheduleStartTime: (startTime) => {
    set((state) => {
      // 시작시간이 변경되면 종료일과 종료시간 초기화 (유효성 검사를 위해)
      return {
        schedule: { 
          ...state.schedule, 
          startTime,
          endDate: '', // 종료일 초기화
          endTime: ''  // 종료시간 초기화
        }
      };
    });
  },
  
  setScheduleEndTime: (endTime) => {
    const { schedule } = get();
    
    // 시작일, 시작시간, 종료일이 모두 설정된 경우에만 종료시간 설정 가능
    if (schedule.startDate && schedule.startTime && schedule.endDate) {
      set((state) => ({
        schedule: { ...state.schedule, endTime }
      }));
    }
  },
  
  setScheduleDescription: (description) => {
    // 100자 제한 적용
    if (description.length <= 100) {
      set((state) => ({
        schedule: { ...state.schedule, description }
      }));
    }
  },
  
  validateSchedule: () => {
    const { schedule } = get();
    const errors: ValidationErrors = {};
    
    // 일정명 검사
    if (!schedule.title) {
      errors.title = '일정명을 입력해주세요.';
    }
    
    // 일시 검사
    if (!schedule.startDate || !schedule.endDate || !schedule.startTime || !schedule.endTime) {
      errors.date = '시작 및 종료 일시를 모두 입력해주세요.';
    } else {
      // 시작 일시와 종료 일시 비교
      const startDateTime = new Date(`${schedule.startDate}T${schedule.startTime}`);
      const endDateTime = new Date(`${schedule.endDate}T${schedule.endTime}`);
      
      if (endDateTime <= startDateTime) {
        errors.date = '종료 일시는 시작 일시보다 이후여야 합니다.';
      }
    }
    
    set({ scheduleErrors: errors });
    
    // 에러가 없으면 true 반환
    return Object.keys(errors).length === 0;
  },
  
  resetSchedule: () => set({
    schedule: {
      title: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      description: ''
    },
    scheduleErrors: {}
  }),
  
  // AI 어시스턴트 관련 상태
  activeRowId: null,
  activeRowType: null,
  setActiveRow: (id, type) => set({ activeRowId: id, activeRowType: type }),
  setActiveRowId: (id) => set({ activeRowId: id })
}));