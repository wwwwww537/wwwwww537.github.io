import React, { useState, useMemo } from 'react';

const InteractiveCalendar = ({ lang, events, monthName }) => {
  const dayLabels = lang === 'zh' 
    ? ['日', '一', '二', '三', '四', '五', '六']
    : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentViewDate, setCurrentViewDate] = useState(new Date(2026, 3, 1)); 

  const calendarDays = useMemo(() => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentViewDate]);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `2026-04-${day.toString().padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const handlePrevMonth = () => setCurrentViewDate(new Date(currentViewDate.setMonth(currentViewDate.getMonth() - 1)));
  const handleNextMonth = () => setCurrentViewDate(new Date(currentViewDate.setMonth(currentViewDate.getMonth() + 1)));

  return (
    <div className="flex flex-col gap-4">
      {/* 头部：应用流光边框 */}
      <div className="jules-card data-stream-border flex justify-between items-center p-4">
        <div className="font-pixel text-xl uppercase">
          {lang === 'zh' ? `${currentViewDate.getFullYear()}年 ${currentViewDate.getMonth() + 1}月` : monthName}
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="jules-btn px-3 py-1 text-xs"> [ PREV ] </button>
          <button onClick={handleNextMonth} className="jules-btn px-3 py-1 text-xs"> [ NEXT ] </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* 左侧：日历网格 */}
        <div className="lg:col-span-5 jules-card p-4">
          <div className="grid grid-cols-7 mb-2">
            {dayLabels.map(label => (
              <div key={label} className="text-center py-2 opacity-50 text-xs font-mono">{label}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2 border-t-2 border-dashed border-[var(--border-color)] pt-4">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day === 20; // 你的测试逻辑：20号是今天
              const isSelected = selectedDate === day;

              return (
                <div 
                  key={idx}
                  onClick={() => day && setSelectedDate(day)}
                  // 移除冲突的自定义类，纯用 Tailwind 控制状态
                  className={`min-h-[80px] p-2 border-2 cursor-pointer transition-all flex flex-col items-start
                    ${!day ? 'opacity-0 pointer-events-none' : ''}
                    ${isToday ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)]' : 'border-transparent'}
                    ${isSelected && !isToday ? 'border-[var(--text-primary)] bg-[var(--text-primary)]/10' : ''}
                    ${!isToday && !isSelected ? 'hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/10' : ''}
                  `}
                >
                  <span className={`font-mono text-sm font-bold ${isToday ? 'text-[var(--bg-color)]' : 'text-[var(--text-secondary)]'}`}>
                    {day}
                  </span>
                  
                  {/* 事件小方块 */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {dayEvents.map((ev, i) => (
                      <span 
                        key={i} 
                        className={`w-2 h-2 rotate-45 border border-[var(--bg-color)] shadow-sm
                          ${ev.type === 'work' ? 'bg-[#ff3e00]' : 'bg-[var(--text-primary)]'}
                          ${isToday ? 'bg-[var(--bg-color)] border-transparent' : ''}
                        `} 
                        title={ev.title} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：解密详情面板 */}
        <div className="lg:col-span-2">
          <div className="jules-card p-5 h-full bg-[var(--text-primary)]/5">
            <h3 className="font-pixel text-sm mb-4 border-b-2 border-dashed border-[var(--border-color)] pb-3 flex items-center gap-2">
              <span className="text-[var(--accent-color)]">&gt;</span> {lang === 'zh' ? '任务解密' : 'DECRYPT_TASKS'}
            </h3>
            
            {selectedDate ? (
              <div className="space-y-5">
                <div className="inline-block px-2 py-1 bg-[var(--text-primary)] text-[var(--bg-color)] font-mono text-[10px]">
                  DATE: 2026-04-{selectedDate.toString().padStart(2, '0')}
                </div>
                
                <div className="space-y-4">
                  {getEventsForDay(selectedDate).length > 0 ? (
                    getEventsForDay(selectedDate).map((ev, i) => (
                      <div key={i} className="relative pl-4 border-l-2 border-[var(--accent-color)]">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rotate-45 bg-[var(--accent-color)]"></div>
                        <div className="font-bold text-sm font-pixel">{ev.title}</div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{ev.desc}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs opacity-50 font-mono italic animate-pulse pt-4">
                      [ NO_RECORDS_FOUND ]
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-xs opacity-40 animate-pulse font-mono border-2 border-dashed border-[var(--border-color)] mt-4">
                AWAITING_SELECTION...
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default InteractiveCalendar;