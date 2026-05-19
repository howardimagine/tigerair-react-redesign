import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekdays = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d'];

const DateRangeCalendar = ({ depart, returnDate, onDepartChange, onReturnChange, tripType, readOnly = false, openTrigger = 0, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (onOpenChange) onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);
  const [activeField, setActiveField] = useState('depart');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const calendarRef = useRef(null);
  const isOneWay = tripType === 'oneway';

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (openTrigger > 0 && !readOnly) {
      setIsOpen(true);
      setActiveField('depart');
    }
  }, [openTrigger, readOnly]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    let lockTimer = null;
    let raf1 = null;
    let raf2 = null;
    const previousOverflow = document.body.style.overflow;

    const centerDropdown = () => {
      if (cancelled) return;
      const node = dropdownRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const dropdownCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const delta = dropdownCenter - viewportCenter;
      if (Math.abs(delta) > 4) {
        window.scrollBy({ top: delta, behavior: 'smooth' });
      }
      lockTimer = window.setTimeout(() => {
        if (!cancelled) document.body.style.overflow = 'hidden';
      }, 500);
    };

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(centerDropdown);
    });

    return () => {
      cancelled = true;
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
      if (lockTimer) window.clearTimeout(lockTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (value, placeholder) => (
    value ? new Date(value).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }) : placeholder
  );

  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const parseDateValue = (value) => {
    if (!value) return null;
    return normalizeDate(new Date(value));
  };

  const isDateLocked = (date, today) => {
    const normalizedDate = normalizeDate(date);
    const departDate = parseDateValue(depart);
    const selectedReturnDate = parseDateValue(returnDate);

    if (normalizedDate < today) return true;

    if (activeField === 'return' && departDate && normalizedDate <= departDate) {
      return true;
    }

    if (activeField === 'depart' && selectedReturnDate && normalizedDate >= selectedReturnDate) {
      return true;
    }

    return false;
  };

  const isLowestPriceDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const seed = (year + month * 13) % 7;
    return [3 + seed, 10 + (seed % 5), 18 + (seed % 4), 25 + (seed % 3)].includes(day);
  };

  const getPriceForDate = (date) => {
    if (isLowestPriceDate(date)) {
      return 1999 + ((date.getMonth() + date.getDate()) % 4) * 200;
    }

    const day = date.getDate();
    return 3999 + (day * 123) % 2000;
  };

  const getMonthName = (date) => date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateMonth = (monthOffset) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset);
    const days = Array.from({ length: getFirstDayOfMonth(month) }, () => null);

    for (let day = 1; day <= getDaysInMonth(month); day += 1) {
      days.push(day);
    }

    return { month, days };
  };

  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isDateLocked(date, today)) return;

    const formattedDate = formatDate(date);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    if (activeField === 'depart') {
      onDepartChange(formattedDate);
      if (!isOneWay) {
        if (isMobile) {
          // Mobile: explicit two-step — close after depart, user taps 回程日 to continue
          setActiveField('return');
          setIsOpen(false);
          return;
        }
        setActiveField('return');
        return;
      }
    } else {
      onReturnChange(formattedDate);
    }

    setIsOpen(false);
  };

  const openCalendar = (field) => {
    if (readOnly) return;
    if (field === 'return' && isOneWay) return;
    setActiveField(field);
    setIsOpen(true);
  };

  const clearDates = (event) => {
    event.stopPropagation();
    if (readOnly) return;
    onDepartChange('');
    onReturnChange('');
    setIsOpen(false);
    setActiveField('depart');
  };

  const renderMonth = (monthData, monthOffset) => {
    const { month, days } = monthData;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div key={monthOffset} className="flex-1">
        <h4 className="mb-3 text-center text-sm font-bold text-gray-800">{getMonthName(month)}</h4>
        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekdays.map((day) => (
            <div key={day} className="py-1 text-center text-xs font-semibold text-gray-500">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const formattedDate = formatDate(date);
            const isLocked = isDateLocked(date, today);
            const isSelected = formattedDate === depart || formattedDate === returnDate;
            const isLowest = isLowestPriceDate(date);
            const price = getPriceForDate(date);

            return (
              <button
                key={formattedDate}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={isLocked}
                className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg p-1 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : isLocked
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : isLowest
                    ? 'border border-primary/70 bg-orange-50 text-gray-900 ring-1 ring-primary/20 hover:bg-orange-100'
                    : 'bg-gray-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {isLowest && !isLocked && (
                  <span className={`text-[8px] font-bold leading-none ${isSelected ? 'text-white' : 'text-primary'}`}>
                    {'\u6700\u4f4e\u50f9'}
                  </span>
                )}
                <span className="text-[11px]">{day}</span>
                {!isLocked && (
                  <span className={`text-[9px] font-bold ${isSelected ? 'text-white' : isLowest ? 'text-primary' : 'text-gray-600'}`}>
                    {Math.floor(price / 1000)}K
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendarBody = () => (
    <>
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="rounded p-1 transition hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex gap-2 rounded-full bg-gray-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveField('depart')}
            className={`rounded-full px-3 py-1 ${activeField === 'depart' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
          >
            {'去程'}
          </button>
          {!isOneWay && (
            <button
              type="button"
              onClick={() => setActiveField('return')}
              className={`rounded-full px-3 py-1 ${activeField === 'return' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
            >
              {'回程'}
            </button>
          )}
        </div>
        <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="rounded p-1 transition hover:bg-gray-100">
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((index) => renderMonth(generateMonth(index), index))}
      </div>
    </>
  );

  return (
    <div ref={calendarRef} className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-0">
      <div
        className={`group relative rounded-lg sm:rounded-r-none border border-gray-200 bg-white/70 backdrop-blur-sm transition focus-within:z-10 focus-within:ring-2 focus-within:ring-primary/30 ${readOnly ? 'cursor-not-allowed bg-gray-50 opacity-50' : 'hover:z-10 hover:border-primary/60 hover:bg-orange-50/40 hover:shadow-sm'}`}
        title={readOnly ? '請使用下方月曆選擇日期' : undefined}
      >
        <label className="absolute left-9 top-1.5 z-10 text-xs font-semibold text-gray-600">{'\u51fa\u767c\u65e5'}</label>
        <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-primary" />
        <button
          type="button"
          onClick={() => openCalendar('depart')}
          disabled={readOnly}
          className="mt-1 w-full truncate rounded-lg sm:rounded-r-none border-0 bg-transparent pb-1.5 pl-9 pr-2 pt-5 text-left text-sm font-medium focus:outline-none disabled:cursor-not-allowed sm:text-base"
        >
          {formatDisplayDate(depart, '\u9078\u65e5\u671f')}
        </button>
        {readOnly && (
          <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:block group-hover:opacity-100">
            請使用下方月曆選擇日期
          </div>
        )}
      </div>

      <div
        className={`group relative rounded-lg sm:-ml-px sm:rounded-l-none border border-gray-200 bg-white/70 backdrop-blur-sm transition focus-within:z-10 focus-within:ring-2 focus-within:ring-primary/30 ${isOneWay || readOnly ? 'opacity-50' : 'hover:z-10 hover:border-primary/60 hover:bg-orange-50/40 hover:shadow-sm'}`}
        title={readOnly ? '請使用下方月曆選擇日期' : undefined}
      >
        <label className="absolute left-9 top-1.5 z-10 text-xs font-semibold text-gray-600">{'\u56de\u7a0b\u65e5'}</label>
        <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-primary" />
        <button
          type="button"
          onClick={() => openCalendar('return')}
          disabled={isOneWay || readOnly}
          className="mt-1 w-full truncate rounded-r-lg border-0 bg-transparent pb-1.5 pl-9 pr-7 pt-5 text-left text-sm font-medium focus:outline-none disabled:cursor-not-allowed sm:text-base"
        >
          {isOneWay ? '\u55ae\u7a0b' : formatDisplayDate(returnDate, '\u9078\u65e5\u671f')}
        </button>
        {readOnly && !isOneWay && (
          <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:block group-hover:opacity-100">
            請使用下方月曆選擇日期
          </div>
        )}
        {!readOnly && (depart || returnDate) && (
          <button
            type="button"
            onClick={clearDates}
            className="absolute right-2 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Clear dates"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && isMobile && typeof document !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div ref={dropdownRef} className="fixed left-1/2 top-1/2 z-[110] max-h-[85vh] w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
            {renderCalendarBody()}
          </div>
        </>,
        document.body
      )}

      {isOpen && !isMobile && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 z-[60] bg-black/30"
            style={{ top: calendarRef.current ? `${calendarRef.current.getBoundingClientRect().bottom + 12}px` : '50%' }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        <div ref={dropdownRef} className="absolute left-[calc(-100%-0.5rem)] top-full z-[70] mt-2 w-[calc(200%+0.5rem)] rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5">
          {renderCalendarBody()}
        </div>
        </>
      )}
    </div>
  );
};

export default DateRangeCalendar;
