import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PriceCalendar = ({ value, onChange, placeholder = "選擇日期", monthCount = 2 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 生成示例价格数据（实际项目中应从 API 获取）
  const getPriceForDate = (date) => {
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

  const month1 = generateMonth(0);
  const month2 = generateMonth(1);

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
                    : 'bg-gray-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                <span className="text-[11px]">{day}</span>
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
    <div className="relative">
      {/* Input Field */}
      <input
        type="text"
        readOnly
        value={selectedDate}
        onClick={() => setIsOpen(!isOpen)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer bg-white"
      />

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-50 ${monthCount === 2 ? 'w-full sm:w-[520px]' : monthCount === 3 ? 'w-full sm:w-[780px]' : 'w-full sm:w-[1040px]'}`}>
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

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            完成
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceCalendar;
