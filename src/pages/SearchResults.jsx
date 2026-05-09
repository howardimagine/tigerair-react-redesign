import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import {
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import ExpandedPriceCalendar from '../components/ExpandedPriceCalendar';
import DateRangeCalendar from '../components/DateRangeCalendar';

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

const airportGroups = [
  {
    country: '台灣',
    airports: [
      { value: 'TPE', label: '台北桃園 TPE' },
      { value: 'KHH', label: '高雄 KHH' },
      { value: 'RMQ', label: '台中 RMQ' },
      { value: 'TSA', label: '台北松山 TSA' },
    ],
  },
  {
    country: '日本',
    airports: [
      { value: 'NRT', label: '東京成田 NRT' },
      { value: 'KIX', label: '大阪關西 KIX' },
      { value: 'OKA', label: '沖繩那霸 OKA' },
      { value: 'FUK', label: '福岡 FUK' },
    ],
  },
  {
    country: '南韓',
    airports: [
      { value: 'ICN', label: '首爾仁川 ICN' },
      { value: 'PUS', label: '釜山 PUS' },
      { value: 'CJU', label: '濟州 CJU' },
      { value: 'TAE', label: '大邱 TAE' },
    ],
  },
  {
    country: '泰國',
    airports: [
      { value: 'BKK', label: '曼谷 BKK' },
      { value: 'DMK', label: '曼谷廊曼 DMK' },
      { value: 'HKT', label: '普吉 HKT' },
      { value: 'CNX', label: '清邁 CNX' },
    ],
  },
  {
    country: '越南',
    airports: [
      { value: 'DAD', label: '峴港 DAD' },
      { value: 'SGN', label: '胡志明 SGN' },
      { value: 'HAN', label: '河內 HAN' },
      { value: 'CXR', label: '芽莊 CXR' },
    ],
  },
];

const AirportDropdown = ({ value, onChange, label, groups, Icon, roundedClass = 'rounded-lg' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedAirport = groups.flatMap((group) => group.airports).find((airport) => airport.value === value);
  const buttonRoundedClass = roundedClass.replace('-ml-px', '').trim();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`relative border border-gray-200 bg-white transition hover:z-10 hover:border-primary/60 hover:bg-orange-50/30 hover:shadow-sm focus-within:z-10 focus-within:ring-2 focus-within:ring-primary/30 ${roundedClass}`}>
      <label className="absolute left-9 top-1.5 text-xs text-gray-400">{label}</label>
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`mt-1 flex w-full items-center justify-between gap-2 border-0 bg-transparent pb-1.5 pl-9 pr-3 pt-5 text-left text-base font-medium focus:outline-none ${buttonRoundedClass}`}
      >
        <span className="truncate">{selectedAirport?.label || '請選擇'}</span>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-xl border border-gray-100 bg-white p-3 shadow-xl">
          {groups.map((group) => (
            <div key={group.country} className="mb-3 last:mb-0">
              <div className="mb-1 rounded bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500">{group.country}</div>
              <div className="space-y-1">
                {group.airports.map((airport) => (
                  <button
                    key={airport.value}
                    type="button"
                    onClick={() => {
                      onChange(airport.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-orange-50 hover:text-primary ${value === airport.value ? 'bg-orange-50 text-primary' : 'text-gray-700'}`}
                  >
                    <span>{airport.label}</span>
                    <span className="text-xs font-semibold text-gray-400">{airport.value}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);
  const [passengerCounts, setPassengerCounts] = useState({ adult: 2, child: 0, infant: 0 });
  const passengerDropdownRef = useRef(null);

  const selectedDate = form.depart;

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const handleDepartChange = (date) => {
    setForm((current) => ({ ...current, depart: date }));
  };

  const handleTripTypeChange = (value) => {
    setTripType(value);
    if (value === 'oneway') {
      setForm((current) => ({ ...current, returnDate: '' }));
    }
  };

  const passengerTotal = passengerCounts.adult + passengerCounts.child + passengerCounts.infant;
  const passengerSummary = `${passengerTotal} 位`;

  const updatePassengerCount = (type, delta) => {
    setPassengerCounts((current) => {
      const minValue = type === 'adult' ? 1 : 0;
      const nextValue = Math.max(minValue, current[type] + delta);
      const nextCounts = { ...current, [type]: nextValue };
      const nextTotal = nextCounts.adult + nextCounts.child + nextCounts.infant;
      setForm((currentForm) => ({ ...currentForm, passengers: nextTotal }));
      return nextCounts;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target)) {
        setIsPassengerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filtered = flights.filter((flight) => filter === 'all' || flight.period === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-3">
      <div className="mx-auto max-w-8xl px-4">
        <div className="mb-4 rounded-xl bg-white p-4 sm:p-6 md:px-8 md:py-5 shadow-lg shadow-gray-300/30">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-[0.8fr_1.7fr_1.7fr_0.8fr_0.9fr] lg:items-end">
              <div className="relative rounded-lg border border-gray-200 bg-white transition hover:border-primary/60 hover:bg-orange-50/30 hover:shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
                <label className="absolute left-9 top-1.5 text-xs text-gray-400">航程</label>
                <ArrowsRightLeftIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <div className="relative mt-1">
                  <select
                    value={tripType}
                    onChange={(event) => handleTripTypeChange(event.target.value)}
                    className="w-full rounded-lg border-0 bg-transparent pb-1.5 pl-9 pr-3 pt-5 text-base font-medium focus:outline-none"
                  >
                    <option value="roundtrip">來回</option>
                    <option value="oneway">單程</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0">
                <AirportDropdown
                  value={form.from}
                  onChange={value => setForm({...form, from: value})}
                  label="出發地 From"
                  groups={airportGroups}
                  Icon={MapPinIcon}
                  roundedClass="rounded-l-lg"
                />
                <AirportDropdown
                  value={form.to}
                  onChange={value => setForm({...form, to: value})}
                  label="目的地 To"
                  groups={airportGroups}
                  Icon={PaperAirplaneIcon}
                  roundedClass="-ml-px rounded-r-lg"
                />
              </div>

              <DateRangeCalendar
                depart={form.depart}
                returnDate={form.returnDate}
                onDepartChange={date => setForm((current) => ({ ...current, depart: date }))}
                onReturnChange={date => setForm((current) => ({ ...current, returnDate: date }))}
                tripType={tripType}
              />

              <div ref={passengerDropdownRef} className="relative rounded-lg border border-gray-200 bg-white transition hover:border-primary/60 hover:bg-orange-50/30 hover:shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
                <label className="absolute left-9 top-1.5 text-xs text-gray-400">旅客 Passengers</label>
                <UserGroupIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <div className="relative mt-1">
                  <button
                    type="button"
                    onClick={() => setIsPassengerOpen((current) => !current)}
                    className="w-full rounded-lg border-0 bg-transparent pb-1.5 pl-9 pr-3 pt-5 text-left text-base font-medium focus:outline-none"
                  >
                    {passengerSummary}
                  </button>
                </div>
                {isPassengerOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                    {[
                      { key: 'adult', label: '成人' },
                      { key: 'child', label: '兒童' },
                      { key: 'infant', label: '嬰兒' },
                    ].map((passenger) => (
                      <div key={passenger.key} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
                        <span className="text-sm font-medium text-gray-800">{passenger.label}</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updatePassengerCount(passenger.key, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-lg font-semibold text-gray-500 transition hover:border-primary hover:text-primary"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-sm font-bold text-gray-900">{passengerCounts[passenger.key]}</span>
                          <button
                            type="button"
                            onClick={() => updatePassengerCount(passenger.key, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-lg font-semibold text-gray-500 transition hover:border-primary hover:text-primary"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-stretch">
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-base font-bold text-white transition hover:bg-primary-dark">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  重新搜尋
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mb-6 animate-fade-in-delay-2 rounded-xl bg-white p-4 sm:p-6 md:px-8 md:py-3 shadow-sm">
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
