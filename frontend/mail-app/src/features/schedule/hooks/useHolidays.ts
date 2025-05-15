import { useQuery } from '@tanstack/react-query';

export function useHolidays(year: number, month?: number) {
  return useQuery({
    queryKey: ['holidays', year, month],
    queryFn: async () => {
      console.log('queryFn 호출됨');
      const url = import.meta.env.VITE_PUBLIC_HOLIDAY_API_URL;
      const serviceKey = import.meta.env.VITE_PUBLIC_SERVICE_KEY;
      console.log('url: ', url);
      console.log('serviceKey: ', serviceKey);
      const params = new URLSearchParams({
        serviceKey: serviceKey as string,
        solYear: String(year),
        numOfRows: '50',
        pageNo: '1',
      });
      if (month) {
        params.append('solMonth', String(month).padStart(2, '0'));
      }
      const res = await fetch(`${url}?${params}`);
      const text = await res.text();
      const parser = new window.DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      const items = xmlDoc.getElementsByTagName('item');
      const holidayMap: Record<string, string> = {};
      for (let i = 0; i < items.length; i++) {
        const locdate = items[i].getElementsByTagName('locdate')[0]?.textContent;
        const dateName = items[i].getElementsByTagName('dateName')[0]?.textContent;
        console.log('locdate: ', locdate);
        console.log('dateName: ', dateName);
        if (locdate && dateName) {
          const y = locdate.slice(0, 4);
          const m = locdate.slice(4, 6);
          const d = locdate.slice(6, 8);
          holidayMap[`${y}-${m}-${d}`] = dateName;
        }
      }
      console.log('holidayMap: ', holidayMap);
      return holidayMap;
    },
    staleTime: 0,
    enabled: typeof year === 'number' && !isNaN(year),
    placeholderData: {},
  });
} 