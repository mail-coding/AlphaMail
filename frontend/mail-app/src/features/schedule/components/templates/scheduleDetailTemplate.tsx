import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Schedule } from '@/features/schedule/types/schedule';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '@/features/schedule/services/scheduleService';
import { useScheduleStore } from '@/features/schedule/stores/useScheduleStore';
import { toast } from 'react-toastify';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';

interface ValidationErrors {
  name?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
}

interface ScheduleDetailTemplateProps {
  onClose: () => void;
  isOpen: boolean;
  isAnimating: boolean;
}

export const ScheduleDetailTemplate: React.FC<ScheduleDetailTemplateProps> = ({
  onClose,
  isOpen,
  isAnimating,
}) => {
  const queryClient = useQueryClient();
  const { selectedSchedule, isEdit, setIsEdit } = useScheduleStore();
  const [schedule, setSchedule] = useState<Schedule>({
    id: '',
    name: '',
    start_time: new Date(),
    end_time: new Date(),
    description: '',
    is_done: false,
    created_at: new Date()
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const validateSchedule = (schedule: Schedule): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!schedule.name) {
      newErrors.name = '일정명을 입력해주세요.';
    } else if (schedule.name.length > 20) {
      newErrors.name = '일정명은 20자 이내로 입력해주세요.';
    }

    if (schedule.description && schedule.description.length > 50) {
      newErrors.description = '일정 메모는 50자 이내로 입력해주세요.';
    }

    if (!schedule.start_time) {
      newErrors.start_time = '시작 일시를 선택해주세요.';
    }

    if (!schedule.end_time) {
      newErrors.end_time = '종료 일시를 선택해주세요.';
    } else if (schedule.end_time < schedule.start_time) {
      newErrors.end_time = '종료 일시는 시작 일시보다 이후여야 합니다.';
    }

    return newErrors;
  };

  const createMutation = useMutation({
    mutationFn: scheduleService.createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['schedules'],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['calendarSchedules'],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['weeklySchedules'],
        refetchType: 'all'
      });
      setIsEdit(false);
      toast.success('일정이 성공적으로 등록되었습니다.');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '일정 등록 중 오류가 발생했습니다.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: scheduleService.updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['schedules'],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['calendarSchedules'],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['weeklySchedules'],
        refetchType: 'all'
      });
      setIsEdit(false);
      toast.success('일정이 성공적으로 수정되었습니다.');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '일정 수정 중 오류가 발생했습니다.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: scheduleService.deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['schedules'],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['calendarSchedules'],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['weeklySchedules'],
        refetchType: 'all'
      });
      setIsEdit(false);
      toast.success('일정이 성공적으로 삭제되었습니다.');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '일정 삭제 중 오류가 발생했습니다.');
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (selectedSchedule) {
        setSchedule(selectedSchedule);
      } else {
        setSchedule({
          id: '',
          name: '',
          start_time: new Date(),
          end_time: new Date(),
          description: '',
          is_done: false,
          created_at: new Date()
        });
      }
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [isOpen, selectedSchedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSchedule(schedule);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (isEdit) {
          await updateMutation.mutateAsync(schedule);
        } else {
          await createMutation.mutateAsync(schedule);
        }
      } catch (error) {
        console.error('일정 저장 중 오류 발생:', error);
      }
    } else {
      toast.error('입력한 내용을 확인해주세요.');
    }
  };

  const handleDelete = () => {
    if (schedule.id) {
      deleteMutation.mutate(schedule.id);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div 
          className={`fixed inset-0 bg-gray-500 transition-opacity duration-300 ${
            isAnimating ? 'opacity-75' : 'opacity-0'
          }`}
          onClick={onClose}
        ></div>

        {/* 모달 컨테이너 */}
        <div 
          className={`relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 transform transition-all duration-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEdit ? '일정 상세' : '일정 등록'}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Typography variant="body" bold className="mb-1">
                  일정명 <span className="text-red-500">*</span>
                </Typography>
                <Input
                  type="text"
                  value={schedule.name}
                  onChange={(e) => setSchedule({ ...schedule, name: e.target.value })}
                  size="medium"
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="일정명을 입력하세요"
                  maxLength={20}
                />
                {errors.name && (
                  <Typography variant="caption" color="text-red-500">{errors.name}</Typography>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Typography variant="body" bold className="mb-1">
                    시작 일시 <span className="text-red-500">*</span>
                  </Typography>
                  <Input
                    type="datetime-local"
                    value={format(new Date(schedule.start_time), "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) setSchedule({ ...schedule, start_time: new Date(value) });
                    }}
                    size="medium"
                    className={errors.start_time ? 'border-red-500' : ''}
                    required
                  />
                  {errors.start_time && (
                    <Typography variant="caption" color="text-red-500">{errors.start_time}</Typography>
                  )}
                </div>
                <div className="flex-1">
                  <Typography variant="body" bold className="mb-1">
                    종료 일시 <span className="text-red-500">*</span>
                  </Typography>
                  <Input
                    type="datetime-local"
                    value={format(new Date(schedule.end_time), "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) setSchedule({ ...schedule, end_time: new Date(value) });
                    }}
                    size="medium"
                    className={errors.end_time ? 'border-red-500' : ''}
                    required
                  />
                  {errors.end_time && (
                    <Typography variant="caption" color="text-red-500">{errors.end_time}</Typography>
                  )}
                </div>
              </div>

              <div>
                <Typography variant="body" bold className="mb-1">
                  설명
                </Typography>
                <textarea
                  value={schedule.description}
                  onChange={(e) => setSchedule({ ...schedule, description: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                  maxLength={50}
                  placeholder="설명을 입력하세요 (최대 50자)"
                />
                {errors.description && (
                  <Typography variant="caption" color="text-red-500">{errors.description}</Typography>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                {isEdit && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting}
                  >
                    삭제
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '처리중...' : (isEdit ? '수정' : '등록')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">일정 삭제</h3>
            <p className="text-gray-500 mb-6">정말로 이 일정을 삭제하시겠습니까?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
