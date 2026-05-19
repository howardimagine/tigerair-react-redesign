import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, PlaneLanding, PlaneTakeoff, RefreshCw, Briefcase, UtensilsCrossed, Armchair, ShieldCheck, RefreshCcw, Check, X, Plus } from 'lucide-react';
import {
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
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
    tagline: '\u8f15\u4fbf\u8d77\u98db\uff0c\u6309\u9700\u52a0\u503c',
    priceOffset: 0,
    accent: 'border-gray-300',
    items: {
      carryOn: { included: true, label: '\u624b\u63d0\u884c\u674e 10kg' },
      checkedBag: { included: false, label: '\u8a17\u904b\u884c\u674e (\u52a0\u8cfc)' },
      seat: { included: false, label: '\u5ea7\u4f4d (\u96a8\u6a5f\u6307\u5b9a)' },
      meal: { included: false, label: '\u6a5f\u4e0a\u9910\u98df (\u52a0\u8cfc)' },
      change: { included: false, label: '\u4e00\u6b21\u514d\u8cbb\u8b8a\u66f4' },
      priority: { included: false, label: '\u512a\u5148\u767b\u6a5f' },
    },
  },
  {
    key: 'tigersmart',
    name: 'tigersmart',
    title: '\u8070\u660e\u9996\u9078',
    tagline: '\u71b1\u8ce3\u65b9\u6848\uff0c\u884c\u674e+\u5ea7\u4f4d\u5168\u5305',
    priceOffset: 900,
    accent: 'border-primary ring-2 ring-primary/30',
    recommended: true,
    items: {
      carryOn: { included: true, label: '\u624b\u63d0\u884c\u674e 10kg' },
      checkedBag: { included: true, label: '\u8a17\u904b\u884c\u674e 20kg' },
      seat: { included: true, label: '\u864e\u5ec4\u908a\u5ea7\u4f4d' },
      meal: { included: false, label: '\u6a5f\u4e0a\u9910\u98df (\u52a0\u8cfc)' },
      change: { included: false, label: '\u4e00\u6b21\u514d\u8cbb\u8b8a\u66f4' },
      priority: { included: false, label: '\u512a\u5148\u767b\u6a5f' },
    },
  },
  {
    key: 'tigerpro',
    name: 'tigerpro',
    title: '\u5f48\u6027\u5b8c\u6574',
    tagline: '\u884c\u674e\u3001\u9910\u98df\u3001\u8b8a\u66f4\u4e00\u6b21\u5230\u4f4d',
    priceOffset: 1800,
    accent: 'border-amber-400',
    items: {
      carryOn: { included: true, label: '\u624b\u63d0\u884c\u674e 10kg' },
      checkedBag: { included: true, label: '\u8a17\u904b\u884c\u674e 25kg' },
      seat: { included: true, label: '\u524d\u6392\u512a\u9078\u5ea7\u4f4d' },
      meal: { included: true, label: '\u6a5f\u4e0a\u71b1\u9910' },
      change: { included: true, label: '\u4e00\u6b21\u514d\u8cbb\u8b8a\u66f4' },
      priority: { included: true, label: '\u512a\u5148\u767b\u6a5f' },
    },
  },
];

const bundleFeatureRows = [
  { key: 'carryOn', label: '\u624b\u63d0\u884c\u674e', Icon: Briefcase },
  { key: 'checkedBag', label: '\u8a17\u904b\u884c\u674e', Icon: Briefcase },
  { key: 'seat', label: '\u6307\u5b9a\u5ea7\u4f4d', Icon: Armchair },
  { key: 'meal', label: '\u6a5f\u4e0a\u9910\u98df', Icon: UtensilsCrossed },
  { key: 'change', label: '\u514d\u8cbb\u8b8a\u66f4', Icon: RefreshCcw },
  { key: 'priority', label: '\u512a\u5148\u767b\u6a5f', Icon: ShieldCheck },
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
  const [passengerCounts, setPassengerCounts] = useState({ adult: 2, child: 0, infant: 1 });
  const defaultBundle = fareBundles.find((b) => b.recommended) || fareBundles[1] || fareBundles[0];
  const buildDefaultSelection = (flight) => ({
    flight,
    bundle: defaultBundle,
    totalPrice: flight.price + defaultBundle.priceOffset,
  });

  const [selectedFlights, setSelectedFlights] = useState(() => ({
    outbound: buildDefaultSelection(flights[0]),
    return: buildDefaultSelection(flights[3] || flights[0]),
  }));
  const [bundleModal, setBundleModal] = useState(null);
  const [step, setStep] = useState('outbound');
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
  const selectedTotalPrice = (selectedFlights.outbound?.totalPrice || 0) + ((tripType === 'oneway' ? 0 : selectedFlights.return?.totalPrice) || 0);

  const selectFlight = (flight, direction) => {
    setSelectedFlights((current) => {
      const existing = current[direction];
      const bundle = existing?.bundle || defaultBundle;
      return {
        ...current,
        [direction]: { flight, bundle, totalPrice: flight.price + bundle.priceOffset },
      };
    });
  };

  const openBundleModal = (flight, direction, event) => {
    if (event) event.stopPropagation();
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
    navigate('/passengers', {
      state: {
        selectedFlights,
        tripType,
        passengerCounts,
        form,
      },
    });
  };

  const getAirportDisplayName = (code) => airportDisplayNames[code] || code;
  const renderDirectionHeading = (direction) => {
    const isReturn = direction === 'return';
    const origin = getAirportDisplayName(isReturn ? form.to : form.from);
    const destination = getAirportDisplayName(isReturn ? form.from : form.to);

    return (
      <h3 className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold text-gray-900 sm:text-base">
        <PlaneTakeoff className={isReturn ? 'h-4 w-4 -scale-x-100 text-primary sm:h-5 sm:w-5' : 'h-4 w-4 text-primary sm:h-5 sm:w-5'} />
        <span>{isReturn ? '\u56de\u7a0b' : '\u53bb\u7a0b'}</span>
        <span className="truncate">{origin}</span>
        <span className="text-gray-400">-</span>
        <span className="truncate">{destination}</span>
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
        onClick={() => selectFlight(flight, direction)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') selectFlight(flight, direction);
        }}
        className={`relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 transition hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary' : 'ring-gray-100 hover:ring-gray-200'
        } ${animationClass}`}
      >
        {isSelected && (
          <div className="absolute right-0 top-0 z-10 flex items-center gap-1.5 rounded-bl-lg bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            <Check className="h-3 w-3" />
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

          <div className="flex flex-col items-center justify-center gap-2 border-l border-dashed border-gray-200 p-2 md:p-3">
            <div className={`flex flex-col items-center leading-tight text-base font-bold sm:text-xl ${accentTextClass}`}>
              <span className="text-[10px] font-bold sm:text-xs">TWD</span>
              <span>{((isSelected ? selectedFlight.totalPrice : flight.price + defaultBundle.priceOffset)).toLocaleString()}</span>
              <span className="text-[10px] font-medium text-gray-400">起</span>
            </div>
            <button
              type="button"
              onClick={(event) => openBundleModal(flight, direction, event)}
              className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-primary transition hover:bg-primary hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              方案
            </button>
          </div>
        </div>
      </div>
    );
  };

  const fromName = getAirportDisplayName(form.from);
  const toName = getAirportDisplayName(form.to);
  const stepLabels = [
    { key: 'flights', label: '機票' },
    { key: 'passengers', label: '旅客資料' },
    { key: 'seat', label: '座位' },
    { key: 'addons', label: '加購' },
  ];
  const currentStepIndex = 0;
  const tripLabel = tripType === 'oneway' ? '單程' : '來回';
  const dateLabel = (() => {
    if (!form.depart) return '尚未選日期';
    if (tripType === 'oneway') return form.depart;
    return `${form.depart}  →  ${form.returnDate || '--'}`;
  })();

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Dark compact header */}
      <div className="relative -mt-14 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 pt-14 md:-mt-16 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(250,168,54,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-5 sm:px-6 lg:px-8">
          <div className="space-y-1 text-white">
            <p className="text-xs font-semibold text-primary">{'Step 1 / 4'}</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{fromName} → {toName}</h1>
            <p className="text-xs text-white/60">{'選擇航班'}</p>
          </div>
          <div className="mt-3 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max items-center gap-2 whitespace-nowrap">
              {stepLabels.map((s, idx) => (
                <div key={s.key} className="flex shrink-0 items-center gap-2">
                  <span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-bold transition ${
                    idx === currentStepIndex ? 'bg-white text-gray-900' : 'bg-white/15 text-white/70'
                  }`}>{idx + 1}</span>
                  <span className={`text-[11px] font-semibold sm:text-xs ${idx === currentStepIndex ? 'text-white' : 'text-white/60'}`}>{s.label}</span>
                  {idx < stepLabels.length - 1 && <span className="mx-0.5 h-px w-5 bg-white/20 sm:w-8" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compact locked summary bar */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm sm:px-5">
          <div className="flex items-center gap-1.5">
            <ArrowsRightLeftIcon className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-gray-900">{tripLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PlaneTakeoff className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-gray-700">{fromName} <span className="text-gray-400">({form.from})</span></span>
            <span className="text-gray-300">→</span>
            <PlaneLanding className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-gray-700">{toName} <span className="text-gray-400">({form.to})</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{'日期'}</span>
            <span className="text-xs font-semibold text-gray-700">{dateLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UserGroupIcon className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-gray-700">{passengerSummary}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-700 transition hover:border-primary hover:text-primary"
          >
            <RefreshCw className="h-3.5 w-3.5" /> {'重新搜尋'}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Legacy form removed \u2014 using compact summary bar above */}

        {filtered.length > 0 && (
          <div className={`mt-4 grid gap-4 ${tripType === 'roundtrip' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            <section>
              {renderDirectionHeading('outbound')}
              <div className="space-y-3">
                {filtered.map((flight, index) => renderFlightCard(flight, index, 'outbound'))}
              </div>
            </section>
            {tripType === 'roundtrip' && (
              <section>
                {renderDirectionHeading('return')}
                <div className="space-y-3">
                  {filtered.map((flight, index) => renderFlightCard(flight, index, 'return'))}
                </div>
              </section>
            )}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pt-2.5 pb-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur sm:px-6 sm:pt-3 sm:pb-4 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-2">
              <div className="min-w-0 leading-tight">
                <p className="text-[10px] font-semibold text-gray-500">{'總計'}</p>
                <p className="whitespace-nowrap text-lg font-black text-gray-900 sm:text-xl">
                  <span className="mr-1 text-[10px] font-bold">TWD</span>
                  {selectedTotalPrice.toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isFlightSelectionComplete}
                className="shrink-0 whitespace-nowrap rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-6 sm:py-3"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">
                  {bundleModal.direction === 'return' ? '\u56de\u7a0b' : '\u53bb\u7a0b'} \u00b7 \u822a\u73ed {bundleModal.flight.id} \u00b7 {bundleModal.flight.depart} \u2192 {bundleModal.flight.arrive}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">{'\u9078\u64c7\u7968\u50f9\u65b9\u6848'}</h2>
                <p className="mt-1 text-sm text-gray-500">{'\u6311\u4e00\u500b\u6700\u9069\u5408\u4f60\u65c5\u7a0b\u7684\u7968\u50f9\u7d44\u5408 \u2014 \u884c\u674e\u3001\u5ea7\u4f4d\u3001\u9910\u98df\u3001\u5f48\u6027\u4e00\u6b21\u770b\u6e05\u695a'}</p>
              </div>
              <button
                type="button"
                onClick={() => setBundleModal(null)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close fare bundle modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {fareBundles.map((bundle) => {
                const totalPrice = bundleModal.flight.price + bundle.priceOffset;
                return (
                  <div
                    key={bundle.key}
                    className={`relative flex flex-col rounded-2xl border-2 bg-white p-5 transition ${bundle.accent} hover:shadow-xl`}
                  >
                    {bundle.recommended && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                        {'\u2605 \u71b1\u8ce3\u63a8\u85a6'}
                      </span>
                    )}
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">{bundle.name}</p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900">{bundle.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">{bundle.tagline}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-xs font-bold text-gray-500">TWD</span>
                      <span className="text-3xl font-black text-gray-900">{totalPrice.toLocaleString()}</span>
                    </div>
                    {bundle.priceOffset > 0 && (
                      <p className="text-xs font-semibold text-primary">{'+ NT$ '}{bundle.priceOffset.toLocaleString()}{' \u52a0\u503c'}</p>
                    )}

                    <ul className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
                      {bundleFeatureRows.map(({ key, label, Icon }) => {
                        const item = bundle.items[key];
                        const included = item?.included;
                        return (
                          <li key={key} className={`flex items-start gap-2.5 ${included ? 'text-gray-800' : 'text-gray-400'}`}>
                            <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${included ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                              {included ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-medium">
                              <Icon className="h-3.5 w-3.5 opacity-70" />
                              {item?.label || label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleBundleSelect(bundle)}
                      className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                        bundle.recommended
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'border border-gray-200 bg-white text-gray-800 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {'\u9078\u64c7 '}{bundle.title}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

