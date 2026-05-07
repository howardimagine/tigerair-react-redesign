import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ExpandedPriceCalendar = ({ value, onChange, monthCount = 3 }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 生成示例价格数据
  const getPriceForDate = (date) => {
    const day = date.getDate();
    const basePrice = 3999;
    const variation = (day * 123) % 2000;
    return basePrice + variation;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day, month) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + month, day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    onChange(formattedDate);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

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

  const renderCalendar = (monthData, monthOffset) => {
    const { month, days } = monthData;
    return (
      <div key={monthOffset} className="flex-1">
        <h4 className="font-bold text-gray-800 text-center mb-3">{getMonthName(month)}</h4>
        
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
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

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day, monthOffset)}
                disabled={isPast}
                className={`aspect-square rounded-lg p-2 text-xs font-medium transition flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg'
                    : isToday
                    ? 'border-2 border-primary text-primary'
                    : isPast
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                <span className="font-bold">{day}</span>
                <span className={`text-[9px] font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>
                  NT${Math.floor(price / 1000)}K
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
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h3 className="font-bold text-gray-800 text-lg flex-1 text-center">
          {getMonthName(new Date(currentMonth.getFullYear(), currentMonth.getMonth()))} 
          {monthCount > 1 && ` - ${getMonthName(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthCount - 1))}`}
        </h3>
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Multiple Months */}
      <div className={`grid gap-6 ${monthCount === 2 ? 'grid-cols-2' : monthCount === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {Array.from({ length: monthCount }).map((_, idx) => renderCalendar(generateMonth(idx), idx))}
      </div>
    </div>
  );
};

export default ExpandedPriceCalendar;
