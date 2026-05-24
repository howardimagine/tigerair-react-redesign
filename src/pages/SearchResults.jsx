import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, PlaneLanding, PlaneTakeoff, RefreshCw, Briefcase, UtensilsCrossed, Armchair, ShieldCheck, RefreshCcw, Check, X, Plus, BedDouble, Sliders, Wifi, Coffee, Sparkles, Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
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
    title: '輕裝出發',
    tagline: '輕便起飛，按需加值',
    priceOffset: 0,
    accent: 'border-gray-300',
    items: {
      carryOn: { included: true, label: '手提行李 10kg' },
      checkedBag: { included: false, label: '託運行李 (加購)' },
      seat: { included: false, label: '座位 (隨機指定)' },
      meal: { included: false, label: '機上餐食 (加購)' },
      change: { included: false, label: '一次免費變更' },
      priority: { included: false, label: '優先登機' },
    },
  },
  {
    key: 'tigersmart',
    name: 'tigersmart',
    title: '聰明首選',
    tagline: '熱賣方案，行李+座位全包',
    priceOffset: 900,
    accent: 'border-primary ring-2 ring-primary/30',
    recommended: true,
    items: {
      carryOn: { included: true, label: '手提行李 10kg' },
      checkedBag: { included: true, label: '託運行李 20kg' },
      seat: { included: true, label: '虎廄邊座位' },
      meal: { included: false, label: '機上餐食 (加購)' },
      change: { included: false, label: '一次免費變更' },
      priority: { included: false, label: '優先登機' },
    },
  },
  {
    key: 'tigerpro',
    name: 'tigerpro',
    title: '彈性完整',
    tagline: '行李、餐食、變更一次到位',
    priceOffset: 1800,
    accent: 'border-amber-400',
    items: {
      carryOn: { included: true, label: '手提行李 10kg' },
      checkedBag: { included: true, label: '託運行李 25kg' },
      seat: { included: true, label: '前排優選座位' },
      meal: { included: true, label: '機上熱餐' },
      change: { included: true, label: '一次免費變更' },
      priority: { included: true, label: '優先登機' },
    },
  },
];

const bundleFeatureRows = [
  { key: 'carryOn', label: '手提行李', Icon: Briefcase },
  { key: 'checkedBag', label: '託運行李', Icon: Briefcase },
  { key: 'seat', label: '指定座位', Icon: Armchair },
  { key: 'meal', label: '機上餐食', Icon: UtensilsCrossed },
  { key: 'change', label: '免費變更', Icon: RefreshCcw },
  { key: 'priority', label: '優先登機', Icon: ShieldCheck },
];


const airportDisplayNames = {
  TPE: '台北',
  KHH: '高雄',
  RMQ: '台中',
  TSA: '台北松山',
  NRT: '東京成田',
  KIX: '關西四國地區- 所有機場',
  OKA: '沖繩',
  FUK: '福岡',
  ICN: '首爾仁川',
  PUS: '釜山',
  CJU: '濟州',
  TAE: '大邱',
  BKK: '曼谷',
  DMK: '曼谷廊曼',
  HKT: '普吉',
  CNX: '清邁',
  DAD: '峴港',
  SGN: '胡志明市',
  HAN: '河內',
  CXR: '芽莊',
};

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
      { value: 'KIX', label: '關西四國地區- 所有機場 KIX' },
      { value: 'OKA', label: '沖繩 OKA' },
      { value: 'FUK', label: '福岡 FUK' },
    ],
  },
  {
    country: '韓國',
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
      { value: 'SGN', label: '胡志明市 SGN' },
      { value: 'HAN', label: '河內 HAN' },
      { value: 'CXR', label: '芽莊 CXR' },
    ],
  },
];



// Mock hotels at the destination — used by the "also search hotels" 機加酒 feature.
const hotelsByCity = {
  NRT: [
    {
      id: 'h-marriott',
      name: '東京萬豪酒店',
      nameEn: 'Tokyo Marriott Hotel',
      area: '品川 · 御殿山',
      stars: 5,
      rating: 4.7,
      reviews: 1284,
      pricePerNight: 4280,
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=640&h=400&fit=crop',
      amenities: ['Wifi', 'Breakfast', 'Spa'],
      tags: ['免費早餐', '近車站'],
    },
    {
      id: 'h-gracery',
      name: 'Hotel Gracery 新宿',
      nameEn: 'Hotel Gracery Shinjuku',
      area: '新宿 · 歌舞伎町',
      stars: 4,
      rating: 4.5,
      reviews: 3120,
      pricePerNight: 3180,
      img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=640&h=400&fit=crop',
      amenities: ['Wifi', 'Breakfast'],
      tags: ['鬧區精選', '哥吉拉景'],
    },
    {
      id: 'h-park',
      name: '東京汐留 Park Hotel',
      nameEn: 'Park Hotel Tokyo',
      area: '汐留 · 海景樓層',
      stars: 4,
      rating: 4.6,
      reviews: 982,
      pricePerNight: 3680,
      img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=640&h=400&fit=crop',
      amenities: ['Wifi', 'Spa'],
      tags: ['藝術飯店', '高樓層'],
    },
    {
      id: 'h-asakusa',
      name: '淺草雷門精品酒店',
      nameEn: 'Asakusa Tokyo Boutique',
      area: '淺草 · 雷門 3 分鐘',
      stars: 3,
      rating: 4.4,
      reviews: 1567,
      pricePerNight: 2280,
      img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=640&h=400&fit=crop',
      amenities: ['Wifi', 'Breakfast'],
      tags: ['超值首選', '日式風格'],
    },
  ],
};

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

  // === Hotel (機加酒) ===
  const [hotelEnabled, setHotelEnabled] = useState(false);
  const [resultTab, setResultTab] = useState('flights'); // 'flights' | 'hotels'
  const [hotelSegments, setHotelSegments] = useState([
    {
      checkIn: '2026-06-15',
      checkOut: '2026-06-18',
      rooms: 1,
      adults: 2,
      children: 0,
      area: '',
      stars: 0, // 0 means no filter
    },
  ]);
  const [activeSegment, setActiveSegment] = useState(0);
  const [advancedSegment, setAdvancedSegment] = useState(null); // index or null
  const [selectedHotels, setSelectedHotels] = useState({}); // { [segmentIdx]: hotelId }

  const segmentNights = (seg) => {
    if (!seg?.checkIn || !seg?.checkOut) return 0;
    const ms = new Date(seg.checkOut).getTime() - new Date(seg.checkIn).getTime();
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
  };
  const hotelList = hotelsByCity[form.to] || hotelsByCity.NRT;

  const hotelTotal = hotelEnabled
    ? hotelSegments.reduce((sum, seg, idx) => {
        const id = selectedHotels[idx];
        if (!id) return sum;
        const hotel = hotelList.find((h) => h.id === id);
        if (!hotel) return sum;
        return sum + hotel.pricePerNight * segmentNights(seg) * seg.rooms;
      }, 0)
    : 0;

  const addHotelSegment = () => {
    setHotelSegments((current) => {
      const last = current[current.length - 1];
      const nextStart = last?.checkOut || form.depart || '2026-06-18';
      const startDate = new Date(nextStart);
      const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);
      const fmt = (d) => d.toISOString().slice(0, 10);
      return [
        ...current,
        { checkIn: fmt(startDate), checkOut: fmt(endDate), rooms: 1, adults: 2, children: 0, area: '', stars: 0 },
      ];
    });
    setActiveSegment(hotelSegments.length);
  };
  const removeHotelSegment = (idx) => {
    setHotelSegments((current) => current.filter((_, i) => i !== idx));
    setSelectedHotels((current) => {
      const next = {};
      Object.entries(current).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki < idx) next[ki] = v;
        else if (ki > idx) next[ki - 1] = v;
      });
      return next;
    });
    setActiveSegment((current) => Math.max(0, current >= idx ? current - 1 : current));
  };
  const updateSegment = (idx, patch) => {
    setHotelSegments((current) => current.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };
  const toggleHotelEnabled = () => {
    setHotelEnabled((current) => {
      const next = !current;
      if (!next) {
        setResultTab('flights');
        setSelectedHotels({});
        setAdvancedSegment(null);
      }
      return next;
    });
  };
  const selectHotel = (segIdx, hotelId) => {
    setSelectedHotels((current) => ({ ...current, [segIdx]: hotelId }));
  };

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
  const passengerSummary = `${passengerTotal} 位旅客`;

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
  const flightTotal = (selectedFlights.outbound?.totalPrice || 0) + ((tripType === 'oneway' ? 0 : selectedFlights.return?.totalPrice) || 0);
  const selectedTotalPrice = flightTotal + hotelTotal;
  const hotelCount = Object.keys(selectedHotels).length;

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
        <span>{isReturn ? '回程' : '去程'}</span>
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
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{fromName} → {toName}</h1>
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

      {/* Also-search-hotels checkbox (below the criteria card) */}
      <div className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={toggleHotelEnabled}
          aria-pressed={hotelEnabled}
          className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition sm:px-5 ${
            hotelEnabled
              ? 'border-primary/40 bg-orange-50 ring-1 ring-primary/20'
              : 'border-dashed border-gray-300 bg-white hover:border-primary/50 hover:bg-orange-50/40'
          }`}
        >
          {/* Checkbox */}
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
              hotelEnabled ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-transparent'
            }`}
            aria-hidden
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>

          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${hotelEnabled ? 'bg-primary text-white' : 'bg-orange-50 text-primary'}`}>
            <BedDouble className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1 leading-tight">
            <p className="flex items-center gap-1.5 text-sm font-bold text-gray-900 sm:text-base">
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-wide ${hotelEnabled ? 'bg-primary text-white' : 'bg-gray-900 text-white'}`}>虎加酒</span>
              <span>同時搜尋飯店</span>
            </p>
            <p className="mt-0.5 truncate text-[11px] text-gray-500 sm:text-xs">
              機+酒一次搞定，加購最高折 NT$ 600
            </p>
          </div>
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tab strip — appears when hotel is enabled */}
        {hotelEnabled && (
          <div className="mt-4 flex gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
            {[
              { key: 'flights', label: '機票', count: tripType === 'roundtrip' ? 2 : 1, done: isFlightSelectionComplete },
              { key: 'hotels', label: '飯店', count: hotelSegments.length, done: hotelCount === hotelSegments.length },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setResultTab(tab.key)}
                className={`group flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                  resultTab === tab.key ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.key === 'flights' ? <Plane className="h-4 w-4" /> : <BedDouble className="h-4 w-4" />}
                <span>{tab.label}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${resultTab === tab.key ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.done ? '✓' : tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Flights tab content */}
        {filtered.length > 0 && (!hotelEnabled || resultTab === 'flights') && (
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

        {/* Hotels tab content */}
        {hotelEnabled && resultTab === 'hotels' && (
          <div className="mt-4 space-y-3">
            {/* Hotel criteria — only visible inside the hotels tab */}
            <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-primary" />
                  <p className="text-sm font-bold text-gray-900">飯店搜尋條件</p>
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {hotelSegments.length} 段
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addHotelSegment}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-orange-50 px-3 py-1 text-[11px] font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" /> 加入分段
                </button>
              </div>

              {hotelSegments.length > 1 && (
                <div className="-mx-1 mb-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex gap-1.5">
                    {hotelSegments.map((seg, i) => {
                      const isActive = i === activeSegment;
                      const picked = Boolean(selectedHotels[i]);
                      const dateText = seg.checkIn && seg.checkOut
                        ? `${seg.checkIn.slice(5)} → ${seg.checkOut.slice(5)}`
                        : '尚未設定';
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveSegment(i)}
                          className={`group flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                            isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${isActive ? 'bg-white text-gray-900' : 'bg-white/80 text-gray-700'}`}>{i + 1}</span>
                          <span>{dateText}</span>
                          {picked && <Check className={`h-3 w-3 ${isActive ? 'text-emerald-300' : 'text-emerald-500'}`} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="-mx-3 overflow-x-auto px-3 sm:-mx-4 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex snap-x snap-mandatory gap-3">
                  {hotelSegments.map((seg, i) => {
                    const isAdvanced = advancedSegment === i;
                    const nights = segmentNights(seg);
                    return (
                      <div
                        key={i}
                        className={`relative snap-start shrink-0 rounded-xl border p-3 transition w-[88vw] max-w-[480px] sm:w-[460px] ${
                          i === activeSegment ? 'border-primary/40 bg-orange-50/40 ring-1 ring-primary/20' : 'border-gray-200 bg-white'
                        }`}
                        onClick={() => setActiveSegment(i)}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-900">分段 {i + 1}{nights > 0 && ` · ${nights} 晚`}</p>
                          {hotelSegments.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeHotelSegment(i); }}
                              className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                              aria-label="移除分段"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label className="block">
                            <span className="text-[10px] font-semibold text-gray-500">入住</span>
                            <input
                              type="date"
                              value={seg.checkIn}
                              onChange={(e) => updateSegment(i, { checkIn: e.target.value })}
                              className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-900 focus:border-primary focus:outline-none"
                            />
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-semibold text-gray-500">退房</span>
                            <input
                              type="date"
                              value={seg.checkOut}
                              onChange={(e) => updateSegment(i, { checkOut: e.target.value })}
                              className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-900 focus:border-primary focus:outline-none"
                            />
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-semibold text-gray-500">房數</span>
                            <select
                              value={seg.rooms}
                              onChange={(e) => updateSegment(i, { rooms: Number(e.target.value) })}
                              className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-900 focus:border-primary focus:outline-none"
                            >
                              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} 間</option>)}
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-semibold text-gray-500">大人</span>
                            <select
                              value={seg.adults}
                              onChange={(e) => updateSegment(i, { adults: Number(e.target.value) })}
                              className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-900 focus:border-primary focus:outline-none"
                            >
                              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} 人</option>)}
                            </select>
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setAdvancedSegment(isAdvanced ? null : i); }}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary"
                        >
                          <Sliders className="h-3 w-3" /> {isAdvanced ? '收合進階條件' : '進階條件'}
                        </button>

                        {isAdvanced && (
                          <div className="mt-2 space-y-2 rounded-lg bg-white p-2 ring-1 ring-gray-100">
                            <label className="block">
                              <span className="text-[10px] font-semibold text-gray-500">區域偏好</span>
                              <select
                                value={seg.area}
                                onChange={(e) => updateSegment(i, { area: e.target.value })}
                                className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-900 focus:border-primary focus:outline-none"
                              >
                                <option value="">不限</option>
                                <option value="新宿">新宿 · 鬧區</option>
                                <option value="淺草">淺草 · 觀光</option>
                                <option value="品川">品川 · 商務</option>
                                <option value="汐留">汐留 · 高樓</option>
                              </select>
                            </label>
                            <div>
                              <span className="text-[10px] font-semibold text-gray-500">最低星等</span>
                              <div className="mt-0.5 flex gap-1">
                                {[0, 3, 4, 5].map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => updateSegment(i, { stars: s })}
                                    className={`flex-1 rounded-md px-2 py-1 text-[11px] font-bold transition ${
                                      seg.stars === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    {s === 0 ? '不限' : `${s}★+`}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                <BedDouble className="h-4 w-4 text-primary" />
                <span>分段 {activeSegment + 1} · 為這段選擇飯店</span>
                {segmentNights(hotelSegments[activeSegment]) > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                    {segmentNights(hotelSegments[activeSegment])} 晚
                  </span>
                )}
              </h3>
              {hotelSegments.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveSegment((c) => Math.max(0, c - 1))}
                    disabled={activeSegment === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSegment((c) => Math.min(hotelSegments.length - 1, c + 1))}
                    disabled={activeSegment === hotelSegments.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {hotelList
                .filter((h) => {
                  const seg = hotelSegments[activeSegment];
                  return seg.stars === 0 || h.stars >= seg.stars;
                })
                .filter((h) => {
                  const seg = hotelSegments[activeSegment];
                  return !seg.area || h.area.includes(seg.area);
                })
                .map((hotel) => {
                  const isSelected = selectedHotels[activeSegment] === hotel.id;
                  const seg = hotelSegments[activeSegment];
                  const nights = segmentNights(seg);
                  const subtotal = hotel.pricePerNight * nights * seg.rooms;
                  return (
                    <button
                      key={hotel.id}
                      type="button"
                      onClick={() => selectHotel(activeSegment, hotel.id)}
                      className={`group relative overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 transition hover:shadow-md ${
                        isSelected ? 'ring-2 ring-primary' : 'ring-gray-100 hover:ring-gray-200'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                          <Check className="h-3 w-3" /> 已選擇
                        </span>
                      )}
                      <div className="relative h-32 w-full overflow-hidden sm:h-36">
                        <img src={hotel.img} alt={hotel.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                        <div className="absolute left-2 top-2 flex gap-1">
                          {hotel.tags.slice(0, 1).map((t) => (
                            <span key={t} className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-gray-900">{hotel.name}</p>
                            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{hotel.area}</span>
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-0.5">
                            {Array.from({ length: hotel.stars }).map((_, i) => (
                              <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 flex items-end justify-between gap-2">
                          <div className="flex items-center gap-1 text-[11px] text-gray-600">
                            <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700">{hotel.rating.toFixed(1)}</span>
                            <span className="text-gray-400">({hotel.reviews})</span>
                          </div>
                          <div className="text-right leading-tight">
                            <p className="text-[10px] text-gray-400">每晚起</p>
                            <p className="text-base font-black text-primary">
                              <span className="text-[10px] font-bold">TWD</span> {hotel.pricePerNight.toLocaleString()}
                            </p>
                            {nights > 0 && (
                              <p className="text-[10px] text-gray-500">小計 {subtotal.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pt-2.5 pb-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur sm:px-6 sm:pt-3 sm:pb-4 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-2">
              <div className="min-w-0 leading-tight">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-gray-500">
                  <span>{hotelEnabled && hotelTotal > 0 ? '機+酒總計' : '總計'}</span>
                  {hotelEnabled && hotelTotal > 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-orange-50 px-1 py-0.5 text-[9px] font-bold text-primary">
                      <Sparkles className="h-2.5 w-2.5" /> 折 NT$ 600
                    </span>
                  )}
                </p>
                <p className="whitespace-nowrap text-lg font-black text-gray-900 sm:text-xl">
                  <span className="mr-1 text-[10px] font-bold">TWD</span>
                  {selectedTotalPrice.toLocaleString()}
                </p>
                {hotelEnabled && hotelTotal > 0 && (
                  <p className="whitespace-nowrap text-[10px] text-gray-500">
                    機票 {flightTotal.toLocaleString()} · 飯店 {hotelTotal.toLocaleString()}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isFlightSelectionComplete}
                className="shrink-0 whitespace-nowrap rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-6 sm:py-3"
              >
                {hotelEnabled && hotelTotal > 0 ? '下一步 機加酒' : '下一步'}
              </button>
            </div>
          </div>
        )}


        {filtered.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <Plane className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">{'找不到符合條件的航班'}</p>
          </div>
        )}
      </div>

      {bundleModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">
                  {bundleModal.direction === 'return' ? '回程' : '去程'} · 航班 {bundleModal.flight.id} · {bundleModal.flight.depart} → {bundleModal.flight.arrive}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">{'選擇票價方案'}</h2>
                <p className="mt-1 text-sm text-gray-500">{'挑一個最適合你旅程的票價組合 — 行李、座位、餐食、彈性一次看清楚'}</p>
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
                        {'★ 熱賣推薦'}
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
                      <p className="text-xs font-semibold text-primary">{'+ NT$ '}{bundle.priceOffset.toLocaleString()}{' 加值'}</p>
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
                      {'選擇 '}{bundle.title}
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

