import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Search, Users } from 'lucide-react';
import ExpandedPriceCalendar from '../components/ExpandedPriceCalendar';
import PriceCalendar from '../components/PriceCalendar';

const flights = [
  { id: 'IT210', from: 'TPE', to: 'NRT', depart: '08:30', arrive: '12:45', duration: '3h 15m', price: 5999, type: 'Direct', period: 'morning' },
  { id: 'IT212', from: 'TPE', to: 'NRT', depart: '11:20', arrive: '15:35', duration: '3h 15m', price: 6499, type: 'Direct', period: 'morning' },
  { id: 'IT214', from: 'TPE', to: 'NRT', depart: '14:50', arrive: '19:05', duration: '3h 15m', price: 5499, type: 'Direct', period: 'afternoon' },
  { id: 'IT216', from: 'TPE', to: 'NRT', depart: '18:30', arrive: '22:45', duration: '3h 15m', price: 4999, type: 'Direct', period: 'evening' },
  { id: 'IT218', from: 'TPE', to: 'NRT', depart: '21:00', arrive: '01:15+1', duration: '3h 15m', price: 4499, type: 'Direct', period: 'evening' },
];

const filters = [
  { key: 'all', label: '全部 All' },
  { key: 'morning', label: '早上 Morning' },
  { key: 'afternoon', label: '下午 Afternoon' },
  { key: 'evening', label: '晚上 Evening' },
];

const airports = [
  { value: 'TPE', label: '台北桃園 TPE' },
  { value: 'KHH', label: '高雄 KHH' },
];

const destinations = [
  { value: 'NRT', label: '東京成田 NRT' },
  { value: 'KIX', label: '大阪關西 KIX' },
  { value: 'ICN', label: '首爾仁川 ICN' },
  { value: 'BKK', label: '曼谷 BKK' },
  { value: 'SIN', label: '新加坡 SIN' },
  { value: 'MFM', label: '澳門 MFM' },
];

const SearchResults = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [tripType, setTripType] = useState('roundtrip');
  const [form, setForm] = useState({
    from: 'TPE',
    to: 'NRT',
    depart: '2026-06-15',
    returnDate: '',
    passengers: 1,
  });

  const selectedDate = form.depart;

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const handleDepartChange = (date) => {
    setForm((current) => ({ ...current, depart: date }));
  };

  const filtered = flights
    .filter((flight) => filter === 'all' || flight.period === filter)
    .sort((a, b) => (sortBy === 'price' ? a.price - b.price : a.depart.localeCompare(b.depart)));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
            <div>
              <label className="mb-1 block text-xs text-gray-500">航程 Trip</label>
              <select
                value={tripType}
                onChange={(event) => setTripType(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="roundtrip">來回 Round Trip</option>
                <option value="oneway">單程 One Way</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">出發地 From</label>
              <select
                value={form.from}
                onChange={(event) => setForm({ ...form, from: event.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {airports.map((airport) => (
                  <option key={airport.value} value={airport.value}>{airport.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">目的地 To</label>
              <select
                value={form.to}
                onChange={(event) => setForm({ ...form, to: event.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {destinations.map((destination) => (
                  <option key={destination.value} value={destination.value}>{destination.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">去程 Depart</label>
              <PriceCalendar value={form.depart} onChange={handleDepartChange} placeholder="選擇去程日期" />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">回程 Return</label>
              <PriceCalendar
                value={form.returnDate}
                onChange={(date) => setForm({ ...form, returnDate: date })}
                placeholder={tripType === 'oneway' ? '單程不需回程' : '選擇回程日期'}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">旅客 Passengers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={form.passengers}
                  onChange={(event) => setForm({ ...form, passengers: Number(event.target.value) })}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <option key={count} value={count}>{count} 位</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-medium text-white transition hover:bg-primary-dark">
                <Search className="h-4 w-4" />
                搜尋航班
              </button>
            </div>
          </form>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-800">選擇出發日期 Select Departure Date</h3>
            <p className="mt-1 text-sm text-gray-500">每個日期皆顯示當日最低票價，可左右滑動查看更多月份。</p>
          </div>
          <ExpandedPriceCalendar value={selectedDate} onChange={handleDepartChange} monthCount={3} />
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filter === item.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-xs text-gray-500">排序</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm">
              <option value="price">價格由低到高</option>
              <option value="time">時間由早到晚</option>
            </select>
            <span className="ml-2 text-sm text-gray-500">共 {filtered.length} 班</span>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((flight) => (
            <div
              key={flight.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/flight/${flight.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') navigate(`/flight/${flight.id}`);
              }}
              className="cursor-pointer rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Plane className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-gray-600">{flight.id} {flight.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold sm:text-2xl">{flight.depart}</div>
                      <div className="text-xs text-gray-500">{form.from}</div>
                    </div>
                    <div className="flex flex-1 flex-col items-center">
                      <div className="mb-1 text-xs text-gray-400">{flight.duration}</div>
                      <div className="relative h-px w-full bg-gray-200">
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center">
                          <Plane className="h-3 w-3 bg-white text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold sm:text-2xl">{flight.arrive}</div>
                      <div className="text-xs text-gray-500">{form.to}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:flex-col md:items-end md:border-l md:pl-6">
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary sm:text-2xl">NT$ {flight.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">單程 / 每人</div>
                  </div>
                  <button type="button" className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
                    選擇 Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <Plane className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">找不到符合條件的航班</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
