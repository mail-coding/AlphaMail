
import { Input } from '@/shared/components/atoms/input';

interface FileUploadInputProps {
  value: string;
  onChange: (file: File | null) => void;
  className?: string;
  placeholder?: string;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  value,

  className,
  placeholder = '파일을 선택하세요'
}) => {

  return (
    <div className="flex w-full">
      <Input
        type="text"
        value={value}
        readOnly
        placeholder={placeholder}
        className={`flex-grow bg-gray-100 pointer-events-none ${className}`}
    
      />


    </div>
  );
};