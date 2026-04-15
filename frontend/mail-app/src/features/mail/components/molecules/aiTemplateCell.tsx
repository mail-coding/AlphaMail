import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';

interface AiTemplateCellProps {
  title: string;
  onClick: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const AiTemplateCell: React.FC<AiTemplateCellProps> = ({ 
    title, 
    onClick,
    onDelete,
    onEdit
  }) => {
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) onDelete();
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) onEdit();
    };
    
    return (
        <div 
        className="p-4 bg-[#E1F3FD] rounded-lg cursor-pointer relative flex flex-col justify-between"
        onClick={onClick}
        >
        <div className="flex justify-start mb-3">
            <svg 
            width="35" 
            height="35" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            >
            <path 
                d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" 
                stroke="url(#template-gradient)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <path 
                d="M7 7H17M7 12H17M7 17H13" 
                stroke="url(#template-gradient)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient id="template-gradient" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#62DDFF" />
                <stop offset="1" stopColor="#3098D1" />
                </linearGradient>
            </defs>
            </svg>
        </div>
        
        <div className="text-start">
            <Typography variant="body">
            {title}
            </Typography>
        </div>
        
            <div className="absolute top-2 right-2 flex">
                {onEdit && (
                    <button 
                    className="text-gray-500 hover:text-gray-700 mr-1"
                    onClick={handleEdit}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    </button>
                )}
                
                {onDelete && (
                    <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleDelete}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </button>
                )}
            </div>
        </div>
    );
};
  
export default AiTemplateCell;