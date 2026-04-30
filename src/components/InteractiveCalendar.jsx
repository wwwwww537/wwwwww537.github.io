import React, { useState, useMemo, useEffect } from 'react';

const InteractiveCalendar = ({ key, lang, events }) => {
  const dayLabels = lang === 'zh' 
    ? ['日', '一', '二', '三', '四', '五', '六']
    : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [selectedDateStr, setSelectedDateStr] = useState("2026-04-15");
  const [currentViewDate, setCurrentViewDate] = useState(new Date(2026, 3, 1)); 

  // 用于输入框的双向绑定状态
  const [inputYear, setInputYear] = useState("2026");
  const [inputMonth, setInputMonth] = useState("04");

  // 当日历视图改变时，同步更新输入框的显示值
  useEffect(() => {
    setInputYear(currentViewDate.getFullYear().toString());
    setInputMonth((currentViewDate.getMonth() + 1).toString().padStart(2, '0'));
  }, [currentViewDate]);

  // --- 新增：处理手动输入日期的逻辑 ---
  const handleYearChange = (e) => {
    // 过滤非数字，限制 4 位
    setInputYear(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  const handleMonthChange = (e) => {
    // 过滤非数字，限制 2 位
    setInputMonth(e.target.value.replace(/\D/g, '').slice(0, 2));
  };

  const applyDateChange = () => {
    let y = parseInt(inputYear, 10);
    let m = parseInt(inputMonth, 10);

    // 校验年份
    if (isNaN(y) || y < 1900 || y > 2100) y = currentViewDate.getFullYear();
    // 校验月份 (限制 1-12)
    if (isNaN(m) || m < 1 || m > 12) m = currentViewDate.getMonth() + 1;

    // 重新格式化并设置状态
    setInputYear(y.toString());
    setInputMonth(m.toString().padStart(2, '0'));
    setCurrentViewDate(new Date(y, m - 1, 1));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur(); // 回车时触发 blur 从而调用 applyDateChange
    }
  };
  // ------------------------------------

  useEffect(() => {
    const handleCalendarJump = (event) => {
      const targetDateStr = event.detail.date;
      if (targetDateStr) {
        setSelectedDateStr(targetDateStr);
        const [year, month] = targetDateStr.split('-');
        if (year && month) {
          setCurrentViewDate(new Date(parseInt(year), parseInt(month) - 1, 1));
        }
      }
    };

    window.addEventListener('calendar-jump', handleCalendarJump);
    return () => window.removeEventListener('calendar-jump', handleCalendarJump);
  }, []);

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

  const getEventsForDateStr = (dateStr) => {
    if (!dateStr) return [];
    return events.filter(e => e.date === dateStr);
  };

  const handlePrevMonth = () => setCurrentViewDate(new Date(currentViewDate.setMonth(currentViewDate.getMonth() - 1)));
  const handleNextMonth = () => setCurrentViewDate(new Date(currentViewDate.setMonth(currentViewDate.getMonth() + 1)));

  const handleToday = () => {
    const today = new Date();
    setCurrentViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const year = today.getFullYear();
    const monthStr = (today.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = today.getDate().toString().padStart(2, '0');
    setSelectedDateStr(`${year}-${monthStr}-${dayStr}`);
  };

  const todayDate = new Date();
  const todayYear = todayDate.getFullYear();
  const todayMonth = todayDate.getMonth();
  const todayDay = todayDate.getDate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-[#d97777] shadow-[0_0_4px_rgba(217,119,119,0.5)]'; 
      case 'high': return 'bg-[#dcb97a]'; 
      case 'normal': return 'bg-[var(--accent-color)] opacity-90'; 
      default: return 'bg-[var(--text-primary)] opacity-40';
    }
  };

  const BoldCheckIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`inline-block ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  return (
    <div className="flex flex-col gap-4 font-mono w-full">
      <style>{`
        @keyframes cornerTL { 0% { top: -10px; left: -10px; opacity: 0; } 100% { top: -5px; left: -5px; opacity: 1; } }
        @keyframes cornerTR { 0% { top: -10px; right: -10px; opacity: 0; } 100% { top: -5px; right: -5px; opacity: 1; } }
        @keyframes cornerBL { 0% { bottom: -10px; left: -10px; opacity: 0; } 100% { bottom: -5px; left: -5px; opacity: 1; } }
        @keyframes cornerBR { 0% { bottom: -10px; right: -10px; opacity: 0; } 100% { bottom: -5px; right: -5px; opacity: 1; } }
        
        /* 隐藏输入框自带的清除按钮等 */
        .date-input::-webkit-clear-button,
        .date-input::-webkit-inner-spin-button { display: none; }
      `}</style>

      {/* --- 修改头部导航区域 --- */}
      <div className="jules-card flex flex-wrap md:flex-nowrap justify-between items-center p-4 border-b-2 border-t-2 border-[var(--border-color)] bg-[var(--text-primary)]/5 relative overflow-hidden flex-shrink-0 gap-4">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-50"></div>
        
        {/* 左侧：可直接编辑的日期输入区 */}
        <div className="font-pixel text-xl lg:text-2xl tracking-wider text-[var(--text-primary)] drop-shadow-md flex items-end gap-1">
          <input 
            type="text" 
            value={inputYear}
            onChange={handleYearChange}
            onBlur={applyDateChange}
            onKeyDown={handleInputKeyDown}
            className="date-input w-[65px] bg-transparent border-b-2 border-dashed border-[var(--text-primary)]/50 hover:border-[var(--accent-color)] focus:border-[var(--accent-color)] focus:bg-[var(--text-primary)]/10 focus:outline-none text-center transition-all py-0 px-1"
            title={lang === 'zh' ? '编辑年份 (1900-2100)' : 'Edit Year'}
          />
          <span className="text-sm pb-1 opacity-70">{lang === 'zh' ? '年' : '/'}</span>
          
          <input 
            type="text" 
            value={inputMonth}
            onChange={handleMonthChange}
            onBlur={applyDateChange}
            onKeyDown={handleInputKeyDown}
            className="date-input w-[40px] ml-1 bg-transparent border-b-2 border-dashed border-[var(--text-primary)]/50 hover:border-[var(--accent-color)] focus:border-[var(--accent-color)] focus:bg-[var(--text-primary)]/10 focus:outline-none text-center transition-all py-0 px-1"
            title={lang === 'zh' ? '编辑月份 (1-12)' : 'Edit Month'}
          />
          <span className="text-sm pb-1 opacity-70">{lang === 'zh' ? '月' : ''}</span>
        </div>

        {/* 右侧：按钮区域 */}
        <div className="flex gap-2 lg:gap-3 items-center ml-auto">
          {/* 优化后的战术“回到今天”按钮 */}
          <button 
            onClick={handleToday} 
            className="group flex items-center gap-1.5 px-3 py-1 text-xs lg:text-sm font-pixel font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/50 hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] shadow-[0_0_8px_rgba(var(--accent-color-rgb),0.1)] hover:shadow-[0_0_12px_rgba(var(--accent-color-rgb),0.5)] transition-all"
            title={lang === 'zh' ? '返回今天' : 'Jump to Today'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover:animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 2v5"></path>
              <path d="M12 17v5"></path>
              <path d="M2 12h5"></path>
              <path d="M17 12h5"></path>
            </svg>
            {lang === 'zh' ? '定位当下' : 'SYNC_NOW'}
          </button>

          <div className="w-[1px] h-4 bg-[var(--border-color)] mx-1 hidden sm:block"></div>

          <button onClick={handlePrevMonth} className="px-2 lg:px-3 py-1 text-sm font-mono text-[var(--text-primary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 border border-transparent hover:border-[var(--accent-color)] transition-all">
            {lang === 'zh' ? '< 上一月' : '< PREV'}
          </button>
          <button onClick={handleNextMonth} className="px-2 lg:px-3 py-1 text-sm font-mono text-[var(--text-primary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 border border-transparent hover:border-[var(--accent-color)] transition-all">
            {lang === 'zh' ? '下一月 >' : 'NEXT >'}
          </button>
        </div>
      </div>
      {/* ------------------------ */}

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-2 flex-1">
        
        {/* 左侧：日历区 */}
        <div className="lg:col-span-4 xl:col-span-5 relative jules-card bg-[var(--bg-color)] p-4.5 border border-[var(--border-color)] shadow-2xl">
          <div className="grid grid-cols-7 gap-1.5 lg:gap-2.5">
            {dayLabels.map((label, idx) => (
              <div key={`header-${idx}`} className={`text-center pb-3 text-sm lg:text-base font-bold font-pixel tracking-widest border-b-[3px] border-double border-[var(--border-color)] mb-2
                ${idx === 0 || idx === 6 ? 'text-[var(--accent-color)]' : 'text-[var(--text-primary)]'}`}>
                {label}
              </div>
            ))}
            
            {calendarDays.map((day, idx) => {
              const year = currentViewDate.getFullYear();
              const monthStr = (currentViewDate.getMonth() + 1).toString().padStart(2, '0');
              const dayStr = day ? day.toString().padStart(2, '0') : '';
              const fullDateStr = day ? `${year}-${monthStr}-${dayStr}` : null;

              const dayEvents = getEventsForDateStr(fullDateStr);
              const isToday = day === todayDay && currentViewDate.getMonth() === todayMonth && currentViewDate.getFullYear() === todayYear;
              const isSelected = selectedDateStr === fullDateStr;

              return (
                <div 
                  key={`day-${idx}`}
                  onClick={() => day && setSelectedDateStr(fullDateStr)}
                  className={`min-h-[90px] cursor-pointer transition-colors duration-200 flex flex-col items-start relative group overflow-visible bg-[var(--bg-color)]
                    ${!day ? 'opacity-0 pointer-events-none' : 'hover:bg-[var(--text-primary)]/5'}
                    ${isSelected ? 'data-stream-border p-[11px] border-0' : 'border border-[var(--border-color)] p-2.5'} 
                    ${isToday ? '!border-dashed !border-[var(--accent-color)]/70 animate-[pulse_3s_ease-in-out_infinite]' : ''}
                  `}
                >
                  {isSelected && (
                    <>
                      <div className="absolute z-20 w-2.5 h-2.5 border-t-[3px] border-l-[3px] border-[var(--text-primary)]" style={{ animation: 'cornerTL 0.2s ease-out forwards' }}></div>
                      <div className="absolute z-20 w-2.5 h-2.5 border-t-[3px] border-r-[3px] border-[var(--text-primary)]" style={{ animation: 'cornerTR 0.2s ease-out forwards' }}></div>
                      <div className="absolute z-20 w-2.5 h-2.5 border-b-[3px] border-l-[3px] border-[var(--text-primary)]" style={{ animation: 'cornerBL 0.2s ease-out forwards' }}></div>
                      <div className="absolute z-20 w-2.5 h-2.5 border-b-[3px] border-r-[3px] border-[var(--text-primary)]" style={{ animation: 'cornerBR 0.2s ease-out forwards' }}></div>
                    </>
                  )}

                  {day && isToday && (
                    <>
                      <div className="absolute inset-0 z-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,_var(--accent-color)_1px,_transparent_1px)] bg-[size:4px_4px]"></div>
                      <div className="absolute top-1.5 right-1.5 z-20 px-1.5 py-0.5 font-pixel text-[10px] text-[var(--accent-color)] border border-[var(--accent-color)] bg-[var(--bg-color)] shadow-[0_0_4px_var(--accent-color)] rotate-[15deg]">
                        [TD]
                      </div>
                    </>
                  )}

                  {isToday ? (
                    <div className="flex items-center gap-1 z-10 text-[var(--accent-color)] font-bold font-pixel drop-shadow-[0_0_8px_rgba(var(--accent-color-rgb),0.7)] text-3xl">
                      <span>[</span><span>{day}</span><span>]</span>
                    </div>
                  ) : (
                    <span className={`font-pixel text-xl lg:text-2xl z-10 ${isSelected ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-primary)]'}`}>
                      {day}
                    </span>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-2 z-10 items-center">
                    {dayEvents.map((ev) => {
                      if (ev.status === 'completed') {
                        return <BoldCheckIcon key={ev.id} className="text-[#6b9e78] w-4 h-4 drop-shadow-[0_0_2px_rgba(107,158,120,0.5)]" />;
                      }
                      if (ev.status === 'deleted') {
                        return <span key={ev.id} className="text-[var(--text-primary)] opacity-40 text-base font-pixel leading-none font-black">×</span>;
                      }
                      return (
                        <span 
                          key={ev.id} 
                          className={`w-2.5 h-2.5 border border-[var(--bg-color)] ${getPriorityColor(ev.priority)} ${isToday ? 'border-[var(--accent-color)]' : ''}`} 
                          title={ev.title} 
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：高级任务解码面板 */}
        <div className="lg:col-span-3 xl:col-span-2 relative mt-6 lg:mt-0">
          <div className="lg:absolute lg:inset-0 h-[400px] lg:h-full bg-gradient-to-b from-[var(--text-primary)]/5 to-transparent border border-[var(--border-color)] flex flex-col jules-card min-h-0">
            
            <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-color)] flex-shrink-0">
              <h3 className="font-pixel text-sm flex items-center gap-2 text-[var(--accent-color)]">
                <span className="animate-pulse w-2 h-4 bg-[var(--accent-color)] inline-block"></span> 
                {lang === 'zh' ? '协议解析中...' : 'PARSING_PROTOCOL...'}
              </h3>
              <div className="text-[10px] opacity-50 font-mono border border-[var(--border-color)] px-1">PORT: 8080</div>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto bg-[var(--bg-color)] custom-scrollbar min-h-0">
              {selectedDateStr ? (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">
                  
                  <div className="flex items-center gap-2 mb-4 border-b border-dashed border-[var(--border-color)] pb-2">
                    <span className="px-2 py-0.5 bg-[var(--text-primary)] text-[var(--bg-color)] font-pixel text-xs font-bold">DATE_QUERY</span>
                    <span className="text-[var(--text-primary)] font-bold text-sm tracking-widest">{selectedDateStr}</span>
                  </div>
                  
                  <div className="space-y-5">
                    {getEventsForDateStr(selectedDateStr).length > 0 ? (
                      getEventsForDateStr(selectedDateStr).map((ev) => {
                        const isCompleted = ev.status === 'completed';
                        const isDeleted = ev.status === 'deleted';
                        let borderColor = 'border-[var(--accent-color)]';

                        return (
                          <div key={ev.id} className={`relative pl-4 border-l-2 transition-all ${borderColor}`}>
                            <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rotate-45 
                              ${isCompleted ? 'bg-[#6b9e78]' : (isDeleted ? 'bg-[var(--text-primary)]' : (ev.priority === 'critical' ? 'bg-[#d97777]' : (ev.priority === 'high' ? 'bg-[#dcb97a]' : 'bg-[var(--accent-color)]')))}
                            `}></div>
                            
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <div className={`font-bold text-sm font-pixel flex items-center gap-2 
                                ${isDeleted ? 'line-through decoration-2 text-[var(--text-primary)] opacity-50' : (isCompleted ? 'text-[#6b9e78]' : 'text-[var(--text-primary)]')}
                              `}>
                                {isCompleted && <BoldCheckIcon className="w-[18px] h-[18px] mr-1" />}
                                {isDeleted && <span className="text-sm font-black mr-1 opacity-70">[×]</span>}
                                <span className='flex-1'>{ev.title}</span>
                              </div>
                              {ev.time && <span className="text-xs text-[var(--accent-color)] font-mono ml-2 border border-[var(--accent-color)]/30 px-1 whitespace-nowrap">{ev.time}</span>}
                            </div>

                            {ev.tags && ev.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
                                {ev.tags.map(tag => (
                                  <span key={tag} className="inline-block text-xs font-pixel px-2 py-1 bg-[var(--text-primary)]/10 text-[var(--text-primary)] border border-[var(--text-primary)]/30 uppercase tracking-wider">#{tag}</span>
                                ))}
                              </div>
                            )}
                            
                            <div className={`text-xs leading-relaxed font-mono ${isDeleted ? 'text-[var(--text-primary)] opacity-40' : 'text-[var(--text-primary)] opacity-80'}`}>
                              {ev.desc}
                            </div>

                            {ev.link && !isDeleted && (
                              <div className="mt-3">
                                {ev.link.type === 'external' ? (
                                  <a href={ev.link.url} target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-pixel px-2 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] border border-[var(--accent-color)] transition-all">
                                    [&gt;] {ev.link.label || 'EXECUTE_LINK'}
                                  </a>
                                ) : (
                                  <button onClick={() => window.location.href = ev.link.url} className="inline-block text-xs font-pixel px-2 py-1 bg-[var(--text-primary)]/10 text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-color)] border border-[var(--text-primary)]/50 hover:border-[var(--text-primary)] transition-all">
                                    [~] {ev.link.label || 'INTERNAL_ROUTE'}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-[var(--text-primary)] opacity-60 font-mono animate-pulse mt-8 flex flex-col items-center bg-[var(--bg-color)] p-4 border border-dashed border-[var(--text-primary)]/30">
                        <span className="text-2xl mb-2 block opacity-30">⚡</span>
                        [ ZERO_PROCESSES_FOUND ]
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-xs text-[var(--text-primary)] font-mono opacity-50 bg-[var(--bg-color)]">
                  <div className="w-12 h-12 border-2 border-dashed border-[var(--text-primary)]/30 animate-[spin_4s_linear_infinite] rounded-full flex items-center justify-center mb-4">
                    <div className="w-4 h-4 bg-[var(--text-primary)]/50 rounded-full"></div>
                  </div>
                  SYSTEM_STANDBY...
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default InteractiveCalendar;