import React, { useState, useEffect } from 'react';
import { scheduleData } from './data'; // 방금 만든 데이터 파일 불러오기

export default function App() { // 이름을 App으로 변경
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

  // 아이콘 렌더링 함수
  const renderSpecialIcon = (note) => {
    if (!note) return null;

    if (note === "이스라엘 역사") {
      return (
        <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-full">
          <svg className="w-3 h-3 text-rose-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" />
          </svg>
          <span className="text-[10px] font-medium text-rose-700">역사</span>
        </div>
      );
    }

    if (note === "그리스도인 회중 발전") {
      return (
        <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-sky-50 border border-sky-100 rounded-full">
          <svg className="w-3 h-3 text-sky-500 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="text-[10px] font-medium text-sky-700">회중</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen font-sans pb-24 text-stone-800">
      {/* 헤더 섹션 */}
      <header className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200 px-6 py-4 mb-4">
        <div className="flex justify-between items-end mb-2">
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">성경 읽기</h1>
          <span className="text-xs font-medium text-stone-500 mb-1">
            {checkedCount} / {totalCount} 장
          </span>
        </div>
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
              {showCategoryHeader && (
                <div className="mt-8 mb-3 flex items-center">
                  <div className="h-px flex-1 bg-stone-300"></div>
                  <span className="px-3 text-sm font-serif font-bold text-stone-600 uppercase tracking-widest">
                    {item.category}
                  </span>
                  <div className="h-px flex-1 bg-stone-300"></div>
                </div>
              )}

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
                    {renderSpecialIcon(item.specialNote)}
                  </div>
                  <span className={`text-sm mt-0.5 font-medium ${isChecked ? 'text-stone-400' : 'text-stone-500'}`}>
                    {item.chapters}장
                  </span>
                </div>

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
}