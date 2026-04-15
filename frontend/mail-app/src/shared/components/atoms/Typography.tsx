import { cn } from '@/shared/utils/cn';
import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'titleLarge' | 'titleMedium' | 'titleSmall' | 'body' | 'caption';
  bold?: boolean,
  color?: string;
  className?: string;
  as?: React.ElementType; // 새로운 prop 추가: 렌더링할 HTML 요소 지정
}

export const Typography = ({ 
  children, 
  variant = 'body', 
  bold, 
  color, 
  className,
  as: Component = 'p' // 기본값을 p로 유지
}: TypographyProps) => {
  const baseStyle = color ? 'font-pretendard' : 'text-gray-900 font-pretendard';
  
  const variantStyle = {
    titleLarge: 'text-[20px]',
    titleMedium: 'text-[17px]',
    titleSmall: 'text-[14px]',
    body: 'text-[12px]',
    caption: 'text-[13px] text-[#ADADAD]',
  }[variant];

  const fontWeightStyle = bold ? 'font-bold' : 'font-light';

  return (
    <Component className={cn(baseStyle, variantStyle, fontWeightStyle, color, className)}>
      {children}
    </Component>
  );
};