import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

const ExpandedPriceCalendar = ({ value, onChange, monthCount = 3 }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const scrollRef = useRef(null);

  const getPriceForDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const basePrice = 2999;
    const variation = ((day * 173) + (month * 311)) % 4200;
    return basePrice + variation;
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (day, monthOffset) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    onChange(formatDate(selectedDate));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const generateMonth = (monthOffset) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const days = Array.from({ length: getFirstDayOfMonth(month) }, () => null);

    for (let day = 1; day <= getDaysInMonth(month); day += 1) {
      days.push(day);
    }

    return { month, days };
  };

  const getMonthName = (date) => date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });

  const renderCalendar = (monthData, monthOffset) => {
    const { month, days } = monthData;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div key={`${month.getFullYear()}-${month.getMonth()}`} className="min-w-[320px] flex-1 snap-start rounded-lg border border-gray-100 bg-white p-4">
        <h4 className="mb-4 text-center text-base font-bold text-gray-900">{getMonthName(month)}</h4>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekdays.map((weekday) => (
            <div key={weekday} className="py-1 text-center text-xs font-semibold text-gray-500">
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-16" />;
            }

            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const formattedDate = formatDate(date);
            const isSelected = formattedDate === value;
            const isToday = today.toDateString() === date.toDateString();
            const isPast = date < today;
            const price = getPriceForDate(date);

            return (
              <button
                key={formattedDate}
                type="button"
                onClick={() => handleDateClick(day, monthOffset)}
                disabled={isPast}
                className={`min-h-16 rounded-lg border p-1.5 text-center transition ${
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-md'
                    : isToday
                    ? 'border-primary bg-white text-gray-900'
                    : isPast
                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-primary/40 hover:bg-orange-50'
                }`}
              >
                <span className="block text-sm font-bold">{day}</span>
                <span className={`mt-1 block text-[10px] font-semibold ${isSelected ? 'text-white' : isPast ? 'text-gray-300' : 'text-primary'}`}>
                  {price.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button type="button" onClick={handlePrevMonth} className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="flex-1 text-center text-base font-bold text-gray-900 sm:text-lg">
          {getMonthName(currentMonth)} - {getMonthName(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthCount - 1))}
        </h3>
        <button type="button" onClick={handleNextMonth} className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex snap-x gap-4 overflow-x-auto pb-2">
        {Array.from({ length: monthCount }).map((_, index) => renderCalendar(generateMonth(index), index))}
      </div>
    </div>
  );
};

export default ExpandedPriceCalendar;
