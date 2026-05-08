import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PriceCalendar = ({ value, onChange, placeholder = "選擇日期", monthCount = 2, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

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

  // 生成示例价格数据（实际项目中应从 API 获取）
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
    const basePrice = 3999;
    const variation = (day * 123) % 2000; // 伪随机但一致的价格变化
    return basePrice + variation;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day, month) => {
    if (disabled) return;
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + month, day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // 生成两个月的日历
  const generateMonth = (monthOffset) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset);
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return { month, days };
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
  };

  const selectedDate = value ? new Date(value).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }) : placeholder;

  const renderCalendar = (monthData, monthOffset) => {
    const { month, days } = monthData;
    return (
      <div key={monthOffset} className="flex-1">
        <h4 className="font-bold text-gray-800 text-center mb-3 text-sm">{getMonthName(month)}</h4>
        
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square"></div>;
            }

            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const formattedDate = date.toISOString().split('T')[0];
            const isSelected = formattedDate === value;
            const price = getPriceForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();
            const isPast = date < new Date();
            const isLowest = isLowestPriceDate(date);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day, monthOffset)}
                disabled={isPast}
                className={`aspect-square rounded-lg p-1 text-xs font-medium transition flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : isToday
                    ? 'border-2 border-primary text-primary'
                    : isPast
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isLowest
                    ? 'border border-primary/70 bg-orange-50 text-gray-900 ring-1 ring-primary/20 hover:bg-orange-100'
                    : 'bg-gray-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {isLowest && !isPast && (
                  <span className={`text-[8px] font-bold leading-none ${isSelected ? 'text-white' : 'text-primary'}`}>
                    最低價
                  </span>
                )}
                <span className="text-[11px]">{day}</span>
                {!isPast && (
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
    <div ref={calendarRef} className="relative">
      {/* Input Field */}
      <input
        type="text"
        readOnly
        value={selectedDate}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        placeholder={placeholder}
        className={`mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-base font-bold ${disabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}
      />

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-50 ${monthCount === 2 ? 'w-full sm:w-[700px]' : monthCount === 3 ? 'w-full sm:w-[780px]' : 'w-full sm:w-[1040px]'}`}>
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded transition">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="font-bold text-gray-800 flex-1 text-center">
              {getMonthName(new Date(currentMonth.getFullYear(), currentMonth.getMonth()))} 
              {monthCount > 1 && ` - ${getMonthName(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthCount - 1))}`}
            </h3>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded transition">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Multiple Months Side by Side */}
          <div className={`grid gap-4 mb-4 ${monthCount === 2 ? 'grid-cols-2' : monthCount === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {Array.from({ length: monthCount }).map((_, idx) => renderCalendar(generateMonth(idx), idx))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCalendar;
