/**
 * HTML 콘텐츠의 바이트 크기를 계산합니다 (UTF-8 인코딩 기준)
 * @param htmlContent HTML 콘텐츠
 * @returns 바이트 크기
 */
export const calculateContentSize = (htmlContent: string): number => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(htmlContent);
    return bytes.length;
  };