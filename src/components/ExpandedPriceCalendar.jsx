import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

const ExpandedPriceCalendar = ({ value, returnValue = '', tripType = 'oneway', onChange, monthCount = 3, readOnly = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const scrollRef = useRef(null);
  const departDate = value ? new Date(value) : null;
  const returnDate = returnValue ? new Date(returnValue) : null;
  departDate?.setHours(0, 0, 0, 0);
  returnDate?.setHours(0, 0, 0, 0);

  const isLowestPriceDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const seed = (year + month * 17) % 9;
    return [4 + seed, 11 + (seed % 4), 18 + (seed % 5), 25 + (seed % 3)].includes(day);
  };

  const getPriceForDate = (date) => {
    if (isLowestPriceDate(date)) {
      return 1999 + ((date.getMonth() + date.getDate()) % 4) * 200;
    }

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
    if (readOnly) return;

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
    const responsiveVisibility = monthOffset === 0 ? '' : monthOffset === 1 ? 'hidden sm:block' : 'hidden lg:block';

    return (
      <div key={`${month.getFullYear()}-${month.getMonth()}`} className={`min-w-[320px] flex-1 snap-start rounded-lg border border-gray-100 bg-white p-3 ${responsiveVisibility}`}>
        <h4 className="mb-4 text-center text-base font-bold text-gray-900">{getMonthName(month)}</h4>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekdays.map((weekday) => (
            <div key={weekday} className="py-1 text-center text-xs font-semibold text-gray-500">
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[72px]" />;
            }

            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const formattedDate = formatDate(date);
            const isDepartSelected = formattedDate === value;
            const isReturnSelected = tripType === 'roundtrip' && formattedDate === returnValue;
            const isSelected = isDepartSelected || isReturnSelected;
            const isInSelectedRange = tripType === 'roundtrip' && departDate && returnDate && date > departDate && date < returnDate;
            const isHighlighted = isSelected || isInSelectedRange;
            const isPendingRoundtripDepart = tripType === 'roundtrip' && isDepartSelected && !returnValue;
            const isToday = today.toDateString() === date.toDateString();
            const isPast = date < today;
            const isLowest = isLowestPriceDate(date);
            const price = getPriceForDate(date);
            const selectedRadiusClass = !isHighlighted
              ? 'rounded-lg'
              : isPendingRoundtripDepart
              ? 'rounded-2xl'
              : tripType === 'oneway'
              ? 'rounded-2xl'
              : isDepartSelected
              ? 'rounded-l-2xl'
              : isReturnSelected
              ? 'rounded-r-2xl'
              : 'rounded-none';

            return (
              <button
                key={formattedDate}
                type="button"
                onClick={() => handleDateClick(day, monthOffset)}
                disabled={isPast || readOnly}
                className={`relative flex min-h-[72px] flex-col items-center justify-center border px-1.5 pb-0.5 pt-3.5 text-center transition ${selectedRadiusClass} ${
                  isPendingRoundtripDepart
                    ? 'border-transparent bg-primary text-white'
                    : isInSelectedRange
                    ? 'border-transparent bg-primary text-white'
                    : isHighlighted
                    ? 'border-transparent bg-primary text-white'
                    : readOnly
                    ? 'border-transparent bg-white text-gray-700'
                    : isPast
                    ? 'border-transparent bg-gray-50 text-gray-300 cursor-not-allowed'
                    : isLowest
                    ? 'border-transparent bg-white text-gray-900 hover:bg-orange-50'
                    : isToday
                    ? 'border-transparent bg-white text-gray-900'
                    : 'border-transparent bg-white text-gray-700 hover:bg-orange-50'
                }`}
              >
                {isLowest && !isPast && (
                  <span className={`absolute top-2 inline-block rounded-full px-1.5 py-0.5 text-[8px] font-bold leading-none sm:text-[9px] ${isHighlighted ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                    最低價
                  </span>
                )}
                <span className="block text-sm font-bold">{day}</span>
                {!isPast && (
                  <span className={`block text-[10px] font-semibold sm:text-xs ${isHighlighted ? 'text-white' : isLowest ? 'text-primary' : 'text-gray-600'}`}>
                    {price.toLocaleString()}
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
    <div className="relative w-full">
      <button
        type="button"
        onClick={handlePrevMonth}
        className="absolute left-0 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-md transition hover:border-primary hover:text-primary"
        aria-label="上一個月"
      >
          <ChevronLeft className="h-5 w-5" />
      </button>

      <div ref={scrollRef} className="flex snap-x gap-4 overflow-x-auto">
        {Array.from({ length: monthCount }).map((_, index) => renderCalendar(generateMonth(index), index))}
      </div>

      <button
        type="button"
        onClick={handleNextMonth}
        className="absolute right-0 top-1/2 z-20 translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-md transition hover:border-primary hover:text-primary"
        aria-label="下一個月"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ExpandedPriceCalendar;
