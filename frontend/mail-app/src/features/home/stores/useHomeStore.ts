import { create } from 'zustand';
import { toast } from 'react-toastify';

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
  validateAndAdjustDateTime: () => void;
  
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
    // 상태 업데이트
    set((state) => ({
      schedule: { 
        ...state.schedule, 
        startDate
      }
    }));
    
    // 현재 종료일과 시작일 비교
    const { schedule } = get();
    if (schedule.endDate && schedule.endDate < startDate) {
      // 종료일이 시작일보다 빠른 경우 종료일을 시작일로 설정
      set(state => ({
        schedule: { ...state.schedule, endDate: startDate }
      }));

      setTimeout(() => {
        toast.info('종료일이 시작일 이후로 자동 조정되었습니다.');
      }, 0);
    }

    if (schedule.startTime && schedule.endDate && schedule.endTime) {
      get().validateAndAdjustDateTime();
    }
  },

  setScheduleEndDate: (endDate) => {
    const { schedule } = get();
    
    // 시작일과 시작시간이 모두 설정된 경우에만 종료일 설정 가능
    if (schedule.startDate && schedule.startTime) {
      set((state) => ({
        schedule: { 
          ...state.schedule, 
          endDate
        }
      }));
      
      // 종료일이 시작일보다 빠른 경우 검사
      if (endDate < schedule.startDate) {
        set(state => ({
          schedule: { ...state.schedule, endDate: schedule.startDate }
        }));
        
        setTimeout(() => {
          toast.info('종료일은 시작일 이후로 자동 조정되었습니다.');
        }, 0);
      }
      
      // 전체 시작/종료 시간 검증 및 조정 (종료시간이 있는 경우)
      if (schedule.endTime) {
        get().validateAndAdjustDateTime();
      }
    }
  },
  
  setScheduleStartTime: (startTime) => {
    // 상태 업데이트
    set((state) => ({
      schedule: { 
        ...state.schedule, 
        startTime
      }
    }));
    
    // 시간 비교 및 조정
    const { schedule } = get();
    if (schedule.startDate && startTime && schedule.endDate && schedule.endTime) {
      // 시작 시간과 종료 시간 비교
      const startDateTime = new Date(`${schedule.startDate}T${startTime}:00`);
      const endDateTime = new Date(`${schedule.endDate}T${schedule.endTime}:00`);
      
      if (endDateTime <= startDateTime) {
        // 종료 시간 조정
        get().validateAndAdjustDateTime();
      }
    }
  },
  
  setScheduleEndTime: (endTime) => {
    const { schedule } = get();
    
    // 시작일, 시작시간, 종료일이 모두 설정된 경우에만 종료시간 설정 가능
    if (schedule.startDate && schedule.startTime && schedule.endDate) {
      set((state) => ({
        schedule: { ...state.schedule, endTime }
      }));
      
      // 종료 시간이 시작 시간보다 빠른지 확인
      if (schedule.startDate === schedule.endDate) {
        const startDateTime = new Date(`${schedule.startDate}T${schedule.startTime}:00`);
        const endDateTime = new Date(`${schedule.endDate}T${endTime}:00`);
        
        if (endDateTime <= startDateTime) {
          // 종료 시간 조정
          get().validateAndAdjustDateTime();
        }
      }
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
  
  // 날짜/시간 검증 및 자동 조정
  validateAndAdjustDateTime: () => {
    const { schedule } = get();
    const { startDate, startTime, endDate, endTime } = schedule;
    
    // 시작 시간과 종료 시간이 모두 있는 경우에만 검증
    if (startDate && startTime && endDate && endTime) {
      // 시작 시간과 종료 시간 비교
      const startDateTime = new Date(`${startDate}T${startTime}:00`);
      const endDateTime = new Date(`${endDate}T${endTime}:00`);
      
      if (endDateTime <= startDateTime) {
        // 종료 시간을 시작 시간 + 1시간으로 자동 조정
        const newEndDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
        const newEndDate = newEndDateTime.toISOString().split('T')[0];
        const newEndTime = newEndDateTime.toTimeString().slice(0, 5);
        
        // 이전 상태와 다른 경우에만 업데이트 및 알림
        if (newEndDate !== endDate || newEndTime !== endTime) {
          set(state => ({
            schedule: { 
              ...state.schedule, 
              endDate: newEndDate,
              endTime: newEndTime
            }
          }));
          
          setTimeout(() => {
            toast.info('종료 시간이 시작 시간 이후로 자동 조정되었습니다.');
          }, 0);
        }
      }
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
        get().validateAndAdjustDateTime();
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