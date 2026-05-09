import { useEffect, useRef, useState } from 'react';
import { CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

const DateRangeCalendar = ({ depart, returnDate, onDepartChange, onReturnChange, tripType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeField, setActiveField] = useState('depart');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);
  const isOneWay = tripType === 'oneway';

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

    if (activeField === 'depart') {
      onDepartChange(formattedDate);
      if (!isOneWay) {
        setActiveField('return');
        return;
      }
    } else {
      onReturnChange(formattedDate);
    }

    setIsOpen(false);
  };

  const openCalendar = (field) => {
    if (field === 'return' && isOneWay) return;
    setActiveField(field);
    setIsOpen(true);
  };

  const clearDates = (event) => {
    event.stopPropagation();
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
                    最低價
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

  return (
    <div ref={calendarRef} className="relative grid grid-cols-2 gap-0">
      <div className="relative rounded-l-lg border border-gray-200 bg-white transition hover:z-10 hover:border-primary/60 hover:bg-orange-50/30 hover:shadow-sm focus-within:z-10 focus-within:ring-2 focus-within:ring-primary/30">
        <label className="absolute left-9 top-1.5 z-10 text-xs text-gray-400">去程</label>
        <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <button
          type="button"
          onClick={() => openCalendar('depart')}
          className="mt-1 w-full rounded-l-lg border-0 bg-transparent pb-1.5 pl-9 pr-3 pt-5 text-left text-base font-medium focus:outline-none"
        >
          {formatDisplayDate(depart, '選擇出發日期')}
        </button>
      </div>

      <div className={`relative -ml-px rounded-r-lg border border-gray-200 bg-white transition focus-within:z-10 focus-within:ring-2 focus-within:ring-primary/30 ${isOneWay ? 'opacity-50' : 'hover:z-10 hover:border-primary/60 hover:bg-orange-50/30 hover:shadow-sm'}`}>
        <label className="absolute left-9 top-1.5 z-10 text-xs text-gray-400">回程</label>
        <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <button
          type="button"
          onClick={() => openCalendar('return')}
          disabled={isOneWay}
          className="mt-1 w-full rounded-r-lg border-0 bg-transparent pb-1.5 pl-9 pr-9 pt-5 text-left text-base font-medium focus:outline-none disabled:cursor-not-allowed"
        >
          {isOneWay ? '單程不需回程' : formatDisplayDate(returnDate, '選擇回程日期')}
        </button>
        {(depart || returnDate) && (
          <button
            type="button"
            onClick={clearDates}
            className="absolute right-2 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="清空去程與回程"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-lg bg-white p-4 shadow-xl sm:w-[700px]">
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
                去程
              </button>
              {!isOneWay && (
                <button
                  type="button"
                  onClick={() => setActiveField('return')}
                  className={`rounded-full px-3 py-1 ${activeField === 'return' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                >
                  回程
                </button>
              )}
            </div>
            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="rounded p-1 transition hover:bg-gray-100">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1].map((index) => renderMonth(generateMonth(index), index))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeCalendar;
