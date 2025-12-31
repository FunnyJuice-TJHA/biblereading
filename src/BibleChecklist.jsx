import React, { useState, useEffect } from 'react';
import { scheduleData } from './data';

const BibleChecklist = () => {
  // 로컬 스토리지 초기화
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('bibleProgress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('bibleProgress', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 진행률 계산
  const totalCount = scheduleData.length;
  const checkedCount = Object.keys(checkedItems).filter(key => checkedItems[key]).length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100);

  // 아이콘 렌더링 함수 (요청하신 마름모/동그라미 구현)
  const renderSpecialIcon = (note) => {
    if (!note) return null;

    // 이스라엘 역사: 빨간 마름모
    if (note === "이스라엘 역사") {
      return (
        <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-full">
          <svg className="w-3 h-3 text-rose-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" /> {/* 마름모 모양 */}
          </svg>
          <span className="text-[10px] font-medium text-rose-700">역사</span>
        </div>
      );
    }

    // 그리스도인 회중 발전: 파란 동그라미
    if (note === "그리스도인 회중 발전") {
      return (
        <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-sky-50 border border-sky-100 rounded-full">
          <svg className="w-3 h-3 text-sky-500 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /> {/* 동그라미 모양 */}
          </svg>
          <span className="text-[10px] font-medium text-sky-700">회중</span>
        </div>
      );
    }
    return null;
  };

  return (
    // 전체 배경: 따뜻한 베이지 톤 (stone-50)
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen font-sans pb-24 text-stone-800">
      
      {/* 헤더 섹션 */}
      <header className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200 px-6 py-4 mb-4">
        <div className="flex justify-between items-end mb-2">
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">성경 읽기</h1>
          <span className="text-xs font-medium text-stone-500 mb-1">
            {checkedCount} / {totalCount} 장
          </span>
        </div>

        {/* 진행률 바: 따뜻한 톤에 어울리는 부드러운 녹색 */}
        <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </header>

      {/* 리스트 섹션 */}
      <div className="px-4 space-y-3">
        {scheduleData.map((item, index) => {
          const showCategoryHeader =
            index === 0 || item.category !== scheduleData[index - 1].category;

          const isChecked = !!checkedItems[item.id];

          return (
            <React.Fragment key={item.id}>
              {/* 카테고리 헤더: 종이 느낌의 배경 */}
              {showCategoryHeader && (
                <div className="mt-8 mb-3 flex items-center">
                  <div className="h-px flex-1 bg-stone-300"></div>
                  <span className="px-3 text-sm font-serif font-bold text-stone-600 uppercase tracking-widest">
                    {item.category}
                  </span>
                  <div className="h-px flex-1 bg-stone-300"></div>
                </div>
              )}

              {/* 리스트 아이템 카드 */}
              <div
                onClick={() => toggleCheck(item.id)}
                className={`
                  relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group
                  ${isChecked 
                    ? 'bg-stone-100 border-stone-200 shadow-none' 
                    : 'bg-white border-stone-200 shadow-sm hover:border-stone-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center flex-wrap">
                    <span className={`text-lg font-bold transition-colors ${isChecked ? 'text-stone-400 line-through decoration-stone-300' : 'text-stone-800'}`}>
                      {item.bibleBook}
                    </span>
                    {/* 아이콘 표시 */}
                    {renderSpecialIcon(item.specialNote)}
                  </div>
                  <span className={`text-sm mt-0.5 font-medium ${isChecked ? 'text-stone-400' : 'text-stone-500'}`}>
                    {item.chapters}장
                  </span>
                </div>

                {/* 체크박스 UI */}
                <div className={`
                  shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ml-3
                  ${isChecked 
                    ? 'bg-emerald-500 border-emerald-500 scale-100' 
                    : 'border-stone-300 bg-stone-50 group-hover:border-stone-400'
                  }
                `}>
                  {isChecked && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BibleChecklist;