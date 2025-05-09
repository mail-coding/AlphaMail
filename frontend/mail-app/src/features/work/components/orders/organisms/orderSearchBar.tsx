import React, { useRef } from 'react';

interface OrderSearchBarProps {
  onSearch: (params: any) => void;
}

const OrderSearchBar: React.FC<OrderSearchBarProps> = ({ onSearch }) => {
  const clientRef = useRef<HTMLInputElement>(null);
  const orderNoRef = useRef<HTMLInputElement>(null);
  const managerRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const params = {
      clientName: clientRef.current?.value,
      orderNo: orderNoRef.current?.value,
      userName: managerRef.current?.value,
      productName: itemRef.current?.value,
      startDate: startDateRef.current?.value,
      endDate: endDateRef.current?.value,
    };
    onSearch(params);
  };

  return (
    <div className="p-4 bg-white rounded shadow flex flex-wrap gap-2 items-end">
      {/* 거래처, 사업자등록번호, 발주번호, 담당자, 발주일자, 품목, 검색어 등 입력 */}
      <input ref={clientRef} className="border p-2 rounded" placeholder="거래처/사업자등록번호" />
      <input ref={orderNoRef} className="border p-2 rounded" placeholder="발주번호" />
      <input ref={managerRef} className="border p-2 rounded" placeholder="담당자" />
      <input ref={itemRef} className="border p-2 rounded" placeholder="품목" />
      <div className="flex items-center gap-2">
        <input 
          ref={startDateRef} 
          type="date" 
          className="border p-2 rounded" 
          placeholder="시작일"
        />
        <span>~</span>
        <input 
          ref={endDateRef} 
          type="date" 
          className="border p-2 rounded" 
          placeholder="종료일"
        />
      </div>
      <button
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSearch}
      >
        검색
      </button>
    </div>
  );
};

export default OrderSearchBar; 