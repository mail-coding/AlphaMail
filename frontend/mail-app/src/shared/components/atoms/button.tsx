import { cn } from '@/shared/utils/cn';
import React from 'react';

type Size = 'small' | 'large';
type Variant = 'primary' | 'secondary' | 'ghost' | 'text' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export const Button = ({
  size = 'small',
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) => {
  // 공통 스타일
  const base = 'font-pretendard font-light flex items-center justify-center transition-colors';

  // 크기별 스타일
  const sizeMap: Record<Size, string> = {
    small: 'text-[12px] w-[80px] h-[30px] rounded-sm',
    large: 'text-[12px] w-[180px] h-[35px] rounded-sm',
  };

  // variant별 스타일
  const variantMap: Record<Variant, string> = {
    primary: 'bg-[#518EF9] text-white hover:bg-[#6FACFF] border-none',
    secondary: 'bg-[#AFAFAF] text-white hover:bg-opacity-90 border-none',
    ghost: 'bg-white border border-[#3E99C6] text-[#3E99C6] hover:bg-[#3E99C6]/10 border-none',
    text: 'bg-white text-[#3D3D3D] border hover:bg-[#ECECEC]',
    danger: 'bg-[#F05650] text-white hover:bg-[#c84139] border-none', // danger 추가
  };

  return (
    <button
      className={cn(base, sizeMap[size], variantMap[variant], className)}
      style={{ boxShadow: 'none' }}
      {...props}
    >
      {children}
    </button>
  );
};