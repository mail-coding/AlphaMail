import React from 'react';
import { ScheduleDetailTemplate } from '../templates/scheduleDetailTemplate';
import { useModal } from '@/hooks/useModal';
import { Schedule } from '@/features/schedule/types/schedule';
import { useScheduleStore } from '@/features/schedule/stores/useScheduleStore';

interface SearchListRowProps {
  schedule: Schedule;
}

export const SearchListRow: React.FC<SearchListRowProps> = ({ schedule }) => {
  const { isOpen, isAnimating, openModal, closeModal } = useModal();
  const { setSelectedSchedule, setIsEdit } = useScheduleStore();

  const handleTitleClick = () => {
    setSelectedSchedule(schedule);
    setIsEdit(true);
    openModal();
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {schedule.start_time.toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {schedule.end_time.toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={handleTitleClick}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {schedule.name}
          </button>
        </td>
      </tr>

      <ScheduleDetailTemplate
        onClose={closeModal}
        isOpen={isOpen}
        isAnimating={isAnimating}
      />
    </>
  );
};
