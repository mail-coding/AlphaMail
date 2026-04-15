import React from "react";

interface WarningModalProps {
  open: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions: React.ReactNode;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  open,
  onClose,
  icon,
  title,
  description,
  actions,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-100 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center">
          {icon && <div className="bg-blue-50 p-2 rounded-full mr-3">{icon}</div>}
          <div>{title}</div>
        </div>
        {description && <div className="mb-6 text-gray-600">{description}</div>}
        <div className="flex justify-end gap-3">{actions}</div>
      </div>
    </div>
  );
};
