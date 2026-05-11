import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, PlaneLanding, PlaneTakeoff, RefreshCw } from 'lucide-react';
import {
  ArrowsRightLeftIcon,
  ChevronDownIcon,
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

const fareBundles = [
  {
    key: 'tigerlight',
    name: 'tigerlight',
    title: '\u8f15\u88dd\u51fa\u767c',
    priceOffset: 0,
    features: ['\u624b\u63d0\u884c\u674e', '\u5ea7\u4f4d\u52a0\u8cfc', '\u6258\u904b\u884c\u674e\u52a0\u8cfc'],
  },
  {
    key: 'tigersmart',
    name: 'tigersmart',
    title: '\u8070\u660e\u9996\u9078',
    priceOffset: 900,
    features: ['\u624b\u63d0\u884c\u674e', '20kg \u6258\u904b\u884c\u674e', '\u864e\u539d\u908a\u5ea7\u4f4d'],
  },
  {
    key: 'tigerpro',
    name: 'tigerpro',
    title: '\u5f48\u6027\u5b8c\u6574',
    priceOffset: 1800,
    features: ['\u624b\u63d0\u884c\u674e', '20kg \u6258\u904b\u884c\u674e', '\u9910\u9ede', '\u514d\u8cbb\u8b8a\u66f4\u4e00\u6b21'],
  },
];


const airportDisplayNames = {
  TPE: '\u53f0\u5317',
  KHH: '\u9ad8\u96c4',
  RMQ: '\u53f0\u4e2d',
  TSA: '\u53f0\u5317\u677e\u5c71',
  NRT: '\u6771\u4eac\u6210\u7530',
  KIX: '\u95dc\u897f\u56db\u570b\u5730\u5340- \u6240\u6709\u6a5f\u5834',
  OKA: '\u6c96\u7e69',
  FUK: '\u798f\u5ca1',
  ICN: '\u9996\u723e\u4ec1\u5ddd',
  PUS: '\u91dc\u5c71',
  CJU: '\u6fdf\u5dde',
  TAE: '\u5927\u90b1',
  BKK: '\u66fc\u8c37',
  DMK: '\u66fc\u8c37\u5eca\u66fc',
  HKT: '\u666e\u5409',
  CNX: '\u6e05\u9081',
  DAD: '\u5cf4\u6e2f',
  SGN: '\u80e1\u5fd7\u660e\u5e02',
  HAN: '\u6cb3\u5167',
  CXR: '\u82bd\u838a',
};

const airportGroups = [
  {
    country: '\u53f0\u7063',
    airports: [
      { value: 'TPE', label: '\u53f0\u5317\u6843\u5712 TPE' },
      { value: 'KHH', label: '\u9ad8\u96c4 KHH' },
      { value: 'RMQ', label: '\u53f0\u4e2d RMQ' },
      { value: 'TSA', label: '\u53f0\u5317\u677e\u5c71 TSA' },
    ],
  },
  {
    country: '\u65e5\u672c',
    airports: [
      { value: 'NRT', label: '\u6771\u4eac\u6210\u7530 NRT' },
      { value: 'KIX', label: '\u95dc\u897f\u56db\u570b\u5730\u5340- \u6240\u6709\u6a5f\u5834 KIX' },
      { value: 'OKA', label: '\u6c96\u7e69 OKA' },
      { value: 'FUK', label: '\u798f\u5ca1 FUK' },
    ],
  },
  {
    country: '\u97d3\u570b',
    airports: [
      { value: 'ICN', label: '\u9996\u723e\u4ec1\u5ddd ICN' },
      { value: 'PUS', label: '\u91dc\u5c71 PUS' },
      { value: 'CJU', label: '\u6fdf\u5dde CJU' },
      { value: 'TAE', label: '\u5927\u90b1 TAE' },
    ],
  },
  {
    country: '\u6cf0\u570b',
    airports: [
      { value: 'BKK', label: '\u66fc\u8c37 BKK' },
      { value: 'DMK', label: '\u66fc\u8c37\u5eca\u66fc DMK' },
      { value: 'HKT', label: '\u666e\u5409 HKT' },
      { value: 'CNX', label: '\u6e05\u9081 CNX' },
    ],
  },
  {
    country: '\u8d8a\u5357',
    airports: [
      { value: 'DAD', label: '\u5cf4\u6e2f DAD' },
      { value: 'SGN', label: '\u80e1\u5fd7\u660e\u5e02 SGN' },
      { value: 'HAN', label: '\u6cb3\u5167 HAN' },
      { value: 'CXR', label: '\u82bd\u838a CXR' },
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
        <span className="truncate">{selectedAirport?.label || 'Select'}</span>
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
  const [selectedFlights, setSelectedFlights] = useState({ outbound: null, return: null });
  const [bundleModal, setBundleModal] = useState(null);
  const passengerDropdownRef = useRef(null);

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const handleCalendarDateChange = (date) => {
    setForm((current) => {
      if (tripType === 'oneway') {
        return { ...current, depart: date, returnDate: '' };
      }

      if (!current.depart || current.returnDate || new Date(date) <= new Date(current.depart)) {
        return { ...current, depart: date, returnDate: '' };
      }

      return { ...current, returnDate: date };
    });
  };

  const handleTripTypeChange = (value) => {
    setTripType(value);
    if (value === 'oneway') {
      setForm((current) => ({ ...current, returnDate: '' }));
    }
  };

  const passengerTotal = passengerCounts.adult + passengerCounts.child + passengerCounts.infant;
  const passengerSummary = `${passengerTotal} \u4f4d\u65c5\u5ba2`;

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

  const filtered = flights;
  const isFlightSelectionComplete = Boolean(selectedFlights.outbound) && (tripType === 'oneway' || Boolean(selectedFlights.return));
  const selectedTotalPrice = (selectedFlights.outbound?.totalPrice || 0) + (selectedFlights.return?.totalPrice || 0);

  const openBundleModal = (flight, direction) => {
    setBundleModal({ flight, direction });
  };

  const handleBundleSelect = (bundle) => {
    if (!bundleModal) return;
    setSelectedFlights((current) => ({
      ...current,
      [bundleModal.direction]: {
        flight: bundleModal.flight,
        bundle,
        totalPrice: bundleModal.flight.price + bundle.priceOffset,
      },
    }));
    setBundleModal(null);
  };

  const handleNextStep = () => {
    if (!isFlightSelectionComplete) return;
    navigate(`/flight/${selectedFlights.outbound.flight.id}`);
  };

  const getAirportDisplayName = (code) => airportDisplayNames[code] || code;
  const renderDirectionHeading = (direction) => {
    const isReturn = direction === 'return';
    const origin = getAirportDisplayName(isReturn ? form.to : form.from);
    const destination = getAirportDisplayName(isReturn ? form.from : form.to);

    return (
      <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
        <PlaneTakeoff className={isReturn ? 'h-5 w-5 -scale-x-100 text-primary' : 'h-5 w-5 text-primary'} />
        <span>{isReturn ? '\u56de\u7a0b' : '\u53bb\u7a0b'}</span>
        <span>{origin}</span>
        <span className="text-gray-400">-</span>
        <span>{destination}</span>
      </h3>
    );
  };


  const renderFlightCard = (flight, index, direction = 'outbound') => {
    const isReturn = direction === 'return';
    const origin = isReturn ? form.to : form.from;
    const destination = isReturn ? form.from : form.to;
    const selectedFlight = selectedFlights[direction];
    const isSelected = selectedFlight?.flight.id === flight.id;
    const isDimmed = Boolean(selectedFlight) && !isSelected;
    const mainTextClass = isDimmed ? 'text-gray-500/80' : 'text-gray-900';
    const mutedTextClass = isDimmed ? 'text-gray-500/80' : 'text-gray-400';
    const accentTextClass = isDimmed ? 'text-gray-500/80' : 'text-primary';
    const accentBgClass = isDimmed ? 'bg-gray-400/80' : 'bg-primary';
    const pathLineClass = isDimmed ? 'bg-gray-300' : 'bg-gray-200';
    const animationClass =
      index === 0 ? 'animate-fade-in-delay-3' :
      index === 1 ? 'animate-fade-in-delay-4' :
      'animate-fade-in-delay-5';

    return (
      <div
        key={`${direction}-${flight.id}`}
        role="button"
        tabIndex={0}
        onClick={() => openBundleModal(flight, direction)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') openBundleModal(flight, direction);
        }}
        className={`relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 transition hover:shadow-md ${
          isSelected ? 'ring-2  ring-primary' : 'ring-gray-100'
        } ${animationClass}`}
      >
        {isSelected && (
          <div className="absolute right-0 top-0 z-10 rounded-bl-lg bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {selectedFlight.bundle.name}
          </div>
        )}
        <div className="absolute bottom-0 right-32 top-0 hidden border-l border-dashed border-gray-200 md:block" />
        <div className="absolute right-32 top-0 hidden h-5 w-5 -translate-y-1/2 translate-x-1/2 rounded-full bg-gray-50 md:block" />
        <div className="absolute bottom-0 right-32 hidden h-5 w-5 translate-x-1/2 translate-y-1/2 rounded-full bg-gray-50 md:block" />

        <div className="grid grid-cols-[1fr_5rem] md:grid-cols-[1fr_8rem]">
          <div className="p-3 sm:p-5">
            <div className="flex items-end gap-2 sm:gap-3">
              <div className="min-w-0">
                <p className={`truncate text-xs font-semibold sm:text-sm ${mainTextClass}`}>{getAirportDisplayName(origin)}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={`text-xs font-bold sm:text-sm ${mainTextClass}`}>{origin}</span>
                  <span className={`text-lg font-bold sm:text-2xl ${mainTextClass}`}>{flight.depart}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center pb-1">
                <span className={`mb-0.5 text-[10px] font-semibold sm:mb-1 sm:text-xs ${mainTextClass}`}>{flight.id}</span>
                <span className={`mb-0.5 text-[10px] font-medium sm:mb-1 sm:text-xs ${mutedTextClass}`}>{flight.duration}</span>
                <div className="flex w-full items-center gap-1 sm:gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accentBgClass}`} />
                  <span className={`h-px flex-1 ${pathLineClass}`} />
                  <Plane className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${accentTextClass}`} />
                  <span className={`h-px flex-1 ${pathLineClass}`} />
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accentBgClass}`} />
                </div>
              </div>

              <div className="min-w-0 text-right">
                <p className={`truncate text-xs font-semibold sm:text-sm ${mainTextClass}`}>{getAirportDisplayName(destination)}</p>
                <div className="mt-1 flex items-baseline justify-end gap-2">
                  <span className={`text-xs font-bold sm:text-sm ${mainTextClass}`}>{destination}</span>
                  <span className={`text-lg font-bold sm:text-2xl ${mainTextClass}`}>{flight.arrive}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center border-l border-dashed border-gray-200 p-2 md:flex-col md:items-center md:justify-center md:p-4">
            <div className="text-center">
              <div className={`mt-1 flex flex-col items-center leading-tight text-base font-bold sm:text-xl ${accentTextClass}`}>
                <span className="text-[10px] font-bold sm:text-xs">TWD</span>
                <span>{flight.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-3 pb-10">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="m-1 mb-2 rounded-xl bg-white p-2 sm:p-6 md:px-8 md:py-5 shadow-lg shadow-gray-300/30">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-[2fr_3fr] gap-2 lg:grid-cols-[0.8fr_1.7fr_1.7fr_0.8fr_0.6fr] lg:items-end">
              <div className="relative order-1 col-span-1 rounded-lg border border-gray-200 bg-white transition hover:border-primary/60 hover:bg-orange-50/30 hover:shadow-sm focus-within:ring-2 focus-within:ring-primary/30 lg:order-1 lg:col-span-1">
                <label className="absolute left-9 top-1.5 text-xs text-gray-400">{'\u65c5\u7a0b'}</label>
                <ArrowsRightLeftIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <div className="relative mt-1">
                  <select
                    value={tripType}
                    onChange={(event) => handleTripTypeChange(event.target.value)}
                    className="w-full rounded-lg border-0 bg-transparent pb-1.5 pl-9 pr-3 pt-5 text-base font-medium focus:outline-none"
                  >
                    <option value="roundtrip">{'\u4f86\u56de'}</option>
                    <option value="oneway">{'\u55ae\u7a0b'}</option>
                  </select>
                </div>
              </div>

              <div className="order-3 col-span-2 grid grid-cols-2 gap-0 lg:order-2 lg:col-span-1">
                <AirportDropdown
                  value={form.from}
                  onChange={value => setForm({...form, from: value})}
                  label={'\u51fa\u767c\u5730 From'}
                  groups={airportGroups}
                  Icon={PlaneTakeoff}
                  roundedClass="rounded-l-lg"
                />
                <AirportDropdown
                  value={form.to}
                  onChange={value => setForm({...form, to: value})}
                  label={'\u76ee\u7684\u5730 To'}
                  groups={airportGroups}
                  Icon={PlaneLanding}
                  roundedClass="-ml-px rounded-r-lg"
                />
              </div>

              <div className="order-4 col-span-2 lg:order-3 lg:col-span-1">
                <DateRangeCalendar
                  depart={form.depart}
                  returnDate={form.returnDate}
                  onDepartChange={date => setForm((current) => ({ ...current, depart: date }))}
                  onReturnChange={date => setForm((current) => ({ ...current, returnDate: date }))}
                  tripType={tripType}
                  readOnly
                />
              </div>

              <div ref={passengerDropdownRef} className="relative order-2 col-span-1 rounded-lg border border-gray-200 bg-white transition hover:border-primary/60 hover:bg-orange-50/30 hover:shadow-sm focus-within:ring-2 focus-within:ring-primary/30 lg:order-4">
                <label className="absolute left-9 top-1.5 text-xs text-gray-400">{'\u65c5\u5ba2 Passengers'}</label>
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
                      { key: 'adult', label: '\u6210\u4eba' },
                      { key: 'child', label: '\u5152\u7ae5' },
                      { key: 'infant', label: '\u5b30\u5152' },
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

              <div className="order-5 col-span-2 flex items-stretch lg:order-5 lg:col-span-1">
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-orange-50 px-4 py-4 text-sm font-bold text-primary transition hover:border-primary hover:bg-primary hover:text-white">
                  <RefreshCw className="h-4 w-4" />
                  {'重新搜尋'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="m-1 mb-6 animate-fade-in-delay-2 rounded-xl bg-white p-2 sm:p-6 md:px-8 md:py-3 shadow-sm">
          <ExpandedPriceCalendar
            value={form.depart}
            returnValue={form.returnDate}
            tripType={tripType}
            onChange={handleCalendarDateChange}
            monthCount={3}
          />
        </div>

        {filtered.length > 0 && (
          <div className={`grid p-1 gap-8 ${tripType === 'roundtrip' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            <section>
              {renderDirectionHeading('outbound')}
              <div className="space-y-4">
                {filtered.slice(0, 3).map((flight, index) => renderFlightCard(flight, index, 'outbound'))}
              </div>
            </section>

            {tripType === 'roundtrip' && (
              <section>
                {renderDirectionHeading('return')}
                <div className="space-y-4">
                  {filtered.slice(0, 2).map((flight, index) => renderFlightCard(flight, index, 'return'))}
                </div>
              </section>
            )}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="sticky bottom-0 z-30 mt-6 border-t border-gray-200 bg-gray-50/95 pt-3 pb-4 backdrop-blur">
            <div className="flex gap-3 flex-row items-center justify-between">
              <div>
                <p className="text-xl font-black text-gray-900">
                  <span className="mr-1 text-xs font-bold">TWD</span>
                  {selectedTotalPrice.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">欲參考機隊資料請按此</p>
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isFlightSelectionComplete}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {'下一步'}
              </button>
            </div>
          </div>
        )}


        {filtered.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <Plane className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">{'\u627e\u4e0d\u5230\u7b26\u5408\u689d\u4ef6\u7684\u822a\u73ed'}</p>
          </div>
        )}
      </div>

      {bundleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">{bundleModal.direction === 'return' ? '\u56de\u7a0b' : '\u53bb\u7a0b'} {bundleModal.flight.id}</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">{'\u9078\u64c7\u7968\u50f9\u65b9\u6848'}</h2>
              </div>
              <button
                type="button"
                onClick={() => setBundleModal(null)}
                className="rounded-full px-3 py-1 text-xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close fare bundle modal"
              >
                x
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {fareBundles.map((bundle) => (
                <button
                  key={bundle.key}
                  type="button"
                  onClick={() => handleBundleSelect(bundle)}
                  className="rounded-xl border border-gray-200 p-4 text-left transition hover:border-primary hover:bg-orange-50/40"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">{bundle.name}</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{bundle.title}</h3>
                  <p className="mt-3 text-xl font-bold text-gray-900">
                    TWD {(bundleModal.flight.price + bundle.priceOffset).toLocaleString()}
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-medium text-gray-600">
                    {bundle.features.map((feature) => (
                      <li key={feature}>- {feature}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

