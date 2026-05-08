import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import {
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
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

  const filtered = flights.filter((flight) => filter === 'all' || flight.period === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.7fr_1.7fr_0.8fr_0.9fr] lg:items-end">
            <div>
              <label className="mb-1 block text-xs text-gray-500">航程 Trip</label>
              <div className="relative">
                <ArrowsRightLeftIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={tripType}
                  onChange={(event) => setTripType(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="roundtrip">來回</option>
                  <option value="oneway">單程</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0">
              <div>
                <label className="mb-1 block text-xs text-gray-500">出發地 From</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    value={form.from}
                    onChange={(event) => setForm({ ...form, from: event.target.value })}
                    className="w-full rounded-l-lg rounded-r-none border border-gray-200 py-2.5 pl-9 pr-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {airports.map((airport) => (
                      <option key={airport.value} value={airport.value}>{airport.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">目的地 To</label>
                <div className="relative -ml-px">
                  <PaperAirplaneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    value={form.to}
                    onChange={(event) => setForm({ ...form, to: event.target.value })}
                    className="w-full rounded-l-none rounded-r-lg border border-gray-200 py-2.5 pl-9 pr-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {destinations.map((destination) => (
                      <option key={destination.value} value={destination.value}>{destination.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0">
              <div>
                <label className="mb-1 block text-xs text-gray-500">去程 Depart</label>
                <div className="relative [&_input]:rounded-l-lg [&_input]:rounded-r-none [&_input]:pl-9 [&_input]:text-base [&_input]:font-bold">
                  <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <PriceCalendar value={form.depart} onChange={handleDepartChange} placeholder="選擇去程日期" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">回程 Return</label>
                <div className="relative -ml-px [&_input]:rounded-l-none [&_input]:rounded-r-lg [&_input]:pl-9 [&_input]:text-base [&_input]:font-bold">
                  <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <PriceCalendar
                    value={form.returnDate}
                    onChange={(date) => setForm({ ...form, returnDate: date })}
                    placeholder={tripType === 'oneway' ? '單程不需回程' : '選擇回程日期'}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">旅客 Passengers</label>
              <div className="relative">
                <UserGroupIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={form.passengers}
                  onChange={(event) => setForm({ ...form, passengers: Number(event.target.value) })}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <option key={count} value={count}>{count} 位</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-base font-bold text-white transition hover:bg-primary-dark">
                <MagnifyingGlassIcon className="h-4 w-4" />
                重新搜尋
              </button>
            </div>
          </form>
        </div>

        <div className="mb-6 animate-fade-in-delay-2 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 columns-2 ">
            <h3 className="text-lg font-bold text-gray-800">選擇出發日期 Select Departure Date</h3>
            <p className="mt-1 text-sm text-gray-400 text-right">每個日期皆顯示當日最低票價，可左右滑動查看更多月份。</p>
          </div>
          <ExpandedPriceCalendar value={selectedDate} onChange={handleDepartChange} monthCount={3} />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 animate-fade-in-delay-3">
          {filters.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === option.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-gray-600 shadow-sm hover:bg-orange-50 hover:text-primary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((flight, index) => (
            <div
              key={flight.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/flight/${flight.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') navigate(`/flight/${flight.id}`);
              }}
              className={`cursor-pointer rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6 ${
                index === 0 ? 'animate-fade-in-delay-3' :
                index === 1 ? 'animate-fade-in-delay-4' :
                'animate-fade-in-delay-5'
              }`}
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
