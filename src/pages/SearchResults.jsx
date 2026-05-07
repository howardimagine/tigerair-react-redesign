import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowRight } from 'lucide-react';
import PriceCalendar from '../components/PriceCalendar';

const SearchResults = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [selectedDate, setSelectedDate] = useState('2026-06-15');

  const flights = [
    { id: 'IT210', from: 'TPE', to: 'NRT', depart: '08:30', arrive: '12:45', duration: '3h 15m', price: 5999, type: '直飛 Direct', period: 'morning' },
    { id: 'IT212', from: 'TPE', to: 'NRT', depart: '11:20', arrive: '15:35', duration: '3h 15m', price: 6499, type: '直飛 Direct', period: 'morning' },
    { id: 'IT214', from: 'TPE', to: 'NRT', depart: '14:50', arrive: '19:05', duration: '3h 15m', price: 5499, type: '直飛 Direct', period: 'afternoon' },
    { id: 'IT216', from: 'TPE', to: 'NRT', depart: '18:30', arrive: '22:45', duration: '3h 15m', price: 4999, type: '直飛 Direct', period: 'evening' },
    { id: 'IT218', from: 'TPE', to: 'NRT', depart: '21:00', arrive: '01:15+1', duration: '3h 15m', price: 4499, type: '直飛 Direct', period: 'evening' },
  ];

  const filtered = flights
    .filter(f => filter === 'all' || f.period === filter)
    .sort((a, b) => sortBy === 'price' ? a.price - b.price : a.depart.localeCompare(b.depart));

  const filters = [
    { key: 'all', label: '全部 All' },
    { key: 'morning', label: '早班 Morning' },
    { key: 'afternoon', label: '午班 Afternoon' },
    { key: 'evening', label: '晚班 Evening' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Price Calendar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">選擇出發日期 Select Departure Date</h3>
          <PriceCalendar 
            value={selectedDate} 
            onChange={setSelectedDate} 
            placeholder="選擇出發日期"
            monthCount={3}
          />
        </div>

        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">TPE</span>
            <ArrowRight className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">NRT</span>
            <span className="text-sm text-gray-500 ml-3">{selectedDate} | 1 位旅客</span>
          </div>
          <button onClick={() => navigate('/')} className="text-sm text-primary font-medium hover:underline">修改搜尋 Edit</button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === f.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500">排序：</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1">
              <option value="price">價格低→高</option>
              <option value="time">時間早→晚</option>
            </select>
            <span className="text-sm text-gray-500 ml-2">共 {filtered.length} 個航班</span>
          </div>
        </div>

        {/* Flight Cards */}
        <div className="space-y-4">
          {filtered.map(f => (
            <div key={f.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition cursor-pointer group" onClick={() => navigate(`/flight/${f.id}`)}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Plane className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-gray-600">{f.id} — {f.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold">{f.depart}</div>
                      <div className="text-xs text-gray-500">{f.from}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-400 mb-1">{f.duration}</div>
                      <div className="w-full h-px bg-gray-200 relative">
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center">
                          <Plane className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold">{f.arrive}</div>
                      <div className="text-xs text-gray-500">{f.to}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:flex-col md:items-end md:border-l md:pl-6">
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-primary">NT$ {f.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">單程 / 含稅</div>
                  </div>
                  <button className="mt-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                    選擇 Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">此時段無可用航班</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
