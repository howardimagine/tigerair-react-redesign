import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { PlaneLanding, PlaneTakeoff } from 'lucide-react';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  TagIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  SignalIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/solid';
import DateRangeCalendar from '../components/DateRangeCalendar';
import FlipBoard from '../components/FlipBoard';
import { latestNews } from '../data/news';

const heroSlides = [
  {
    place: 'Tokyo',
    name: '東京',
    code: 'NRT',
    fare: '4,999',
    subtitle: '現在就預訂春季賞櫻機票',
    img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&h=900&fit=crop',
  },
  {
    place: 'Osaka',
    name: '大阪',
    code: 'KIX',
    fare: '5,499',
    subtitle: '搶先卡位秋季賞楓秘境，感受滿山紅葉的浪漫',
    img: 'https://images.unsplash.com/photo-1604834733992-8453fdf4ba68?w=1920&h=900&fit=crop',
  },
  {
    place: 'Okinawa',
    name: '沖繩',
    code: 'OKA',
    fare: '3,999',
    subtitle: '擁抱盛夏湛藍海島，立馬預訂你的陽光沙灘假期',
    img: 'https://images.unsplash.com/photo-1610971250019-f677bc1300be?w=1920&h=900&fit=crop',
  },
  {
    place: 'Seoul',
    name: '首爾',
    code: 'ICN',
    fare: '4,499',
    subtitle: '預約冬季浪漫初雪，享受道地美食與滑雪樂趣',
    img: 'https://images.unsplash.com/photo-1637073758540-f2aaec39e9c3?w=1920&h=900&fit=crop',
  },
  {
    place: 'Phuket',
    name: '普吉島',
    code: 'HKT',
    fare: '4,299',
    subtitle: '逃離寒冬擁抱暖陽，享受安達曼海的熱帶島嶼假期',
    img: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1920&h=900&fit=crop',
  },
];

const destinationAirportGroups = [
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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
};

const AirportDropdown = ({ value, onChange, label, groups, Icon, roundedClass = 'rounded-lg' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedAirport = groups.flatMap((group) => group.airports).find((airport) => airport.value === value);
  const buttonRoundedClass = roundedClass.replace('-ml-px', '').trim();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return undefined;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);

  const list = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">{label}</h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="關閉"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
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
    </>
  );

  return (
    <div ref={dropdownRef} className={`relative border border-gray-200 bg-white/70 backdrop-blur-sm transition hover:z-10 hover:border-primary/60 hover:bg-orange-50/40 hover:shadow-sm focus-within:z-10 focus-within:ring-2 focus-within:ring-primary/30 ${roundedClass}`}>
      <label className="absolute left-9 top-1.5 text-xs font-semibold text-gray-600">{label}</label>
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`mt-1 flex w-full items-center justify-between gap-2 border-0 bg-transparent pb-1.5 pl-9 pr-3 pt-5 text-left text-sm font-medium focus:outline-none sm:text-base ${buttonRoundedClass}`}
      >
        <span className="truncate">{selectedAirport?.label || '請選擇'}</span>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 text-gray-600 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !isMobile && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-xl border border-gray-100 bg-white p-3 shadow-xl">
          {list}
        </div>
      )}

      {isOpen && isMobile && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[100] bg-black/40" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="fixed left-1/2 top-1/2 z-[110] max-h-[85vh] w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
            {list}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [form, setForm] = useState({ from: 'TPE', to: 'NRT', depart: '', returnDate: '', passengers: 1 });
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);
  const [passengerCounts, setPassengerCounts] = useState({ adult: 2, child: 0, infant: 1 });
  const passengerDropdownRef = useRef(null);
  const isMobile = useIsMobile();
  const [calendarOpenTrigger, setCalendarOpenTrigger] = useState(0);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isOpeningMap, setIsOpeningMap] = useState(false);
  const searchFormRef = useRef(null);
  const parallaxRef = useRef(null);

  const handleOpenMap = () => {
    if (isOpeningMap) return;
    setIsOpeningMap(true);
    window.setTimeout(() => navigate('/fare-map'), 500);
  };

  useEffect(() => {
    let frameId = null;
    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        if (parallaxRef.current) {
          const offset = Math.min(window.scrollY, 600) * 0.35;
          parallaxRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
        frameId = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search');
  };

  const handleApplyPromoCode = (e) => {
    e.preventDefault();
    setAppliedPromoCode(promoCode.trim());
    setIsPromoOpen(false);
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

  const features = [
    { icon: TagIcon, title: '超值票價', sub: 'Low Fares', desc: '最優惠的機票價格' },
    { icon: GlobeAltIcon, title: '多元航線', sub: 'Routes', desc: '飛往亞洲各大城市' },
    { icon: ShieldCheckIcon, title: '安全保障', sub: 'Safety', desc: '嚴格的安全標準' },
    { icon: PaperAirplaneIcon, title: '準點起飛', sub: 'On-time', desc: '高準點率保證' },
  ];

  const promoSquares = [
    {
      tag: 'SALE',
      tagClass: 'bg-red-500',
      title: 'Fly More, Save More',
      subtitle: '精選亞洲航線限時優惠，下一趟旅程現在出發',
      img: 'https://strapi-assets.tigerairtw.com/HRBN_team_Tiger_2880x600_3758637ac4.jpg',
      path: '/search',
    },
    {
      tag: 'JAPAN',
      tagClass: 'bg-pink-500',
      title: 'Japan City Break',
      subtitle: '東京、大阪熱門航點，輕鬆安排週末小旅行',
      img: 'https://strapi-assets.tigerairtw.com/W26_HERO_Banner_2880_X600_431aaa59d7.jpg',
      path: '/search',
    },
    {
      tag: 'BEACH',
      tagClass: 'bg-sky-500',
      title: 'Beach & City Escape',
      subtitle: '曼谷、越南、新加坡，城市和海島一次收藏',
      img: 'https://strapi-assets.tigerairtw.com/banner_2880x600_e31ff8f824.gif',
      path: '/search',
    },
    {
      tag: 'EARLY',
      tagClass: 'bg-primary',
      title: 'Early Bird 早鳥優惠',
      subtitle: '日本、韓國熱門航線限時開搶',
      img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&h=900&fit=crop',
      path: '/search',
    },
    {
      tag: 'WEEKEND',
      tagClass: 'bg-emerald-500',
      title: 'Weekend Getaway',
      subtitle: '亞洲城市短航線，說走就走',
      img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&h=900&fit=crop',
      path: '/search',
    },
  ];

  const quickActions = [
    { icon: ClipboardDocumentListIcon, label: '管理訂單', path: '/orders' },
    { icon: PaperAirplaneIcon, label: '自助報到', path: '/checkin' },
    { icon: CalendarDaysIcon, label: '航班動態', path: '/flight-status' },
    { icon: EnvelopeIcon, label: '免稅品購買', path: '/articles' },
    { icon: QuestionMarkCircleIcon, label: '常見問題', path: '/support' },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;
    const handleClickOutside = (event) => {
      if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target)) {
        setIsPassengerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);

  const activeHeroRoute = heroSlides[activeHeroSlide];

  const handleHeroNav = (direction) => {
    setActiveHeroSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  const handleHeroBook = () => {
    setForm((current) => ({ ...current, from: 'TPE', to: activeHeroRoute.code }));
    setTripType('roundtrip');
    setCalendarOpenTrigger((current) => current + 1);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative -mt-14 bg-gray-900 pb-8 pt-14 sm:pb-12 md:-mt-16 md:pt-16 lg:pb-80">
        <div className="absolute inset-0 overflow-hidden">
          <div ref={parallaxRef} className="absolute inset-x-0 -top-12 bottom-0 will-change-transform">
            {heroSlides.map((slide, index) => (
              <img
                key={slide.place}
                src={slide.img}
                alt={`${slide.place} travel scene`}
                className={`absolute inset-0 h-full w-full scale-110 object-cover transition-opacity duration-1000 ease-in-out ${
                  activeHeroSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65"></div>
        </div>

        {/* Side arrows */}
        <button
          type="button"
          onClick={() => handleHeroNav(-1)}
          aria-label="上一個航點"
          className="absolute left-2 top-[160px] z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:left-6 sm:top-[220px] sm:h-14 sm:w-14"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => handleHeroNav(1)}
          aria-label="下一個航點"
          className="absolute right-2 top-[160px] z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:right-6 sm:top-[220px] sm:h-14 sm:w-14"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        <div className={`relative mx-auto max-w-7xl px-12 pt-16 transition-all duration-500 sm:px-20 sm:pt-20 ${isOpeningMap ? 'pointer-events-none -translate-y-4 opacity-0' : ''}`}>
          <div key={activeHeroSlide} className="hero-slide-enter text-white">
            <h1 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">
              <span>跟虎航一起探索</span>
              <MapPinIcon className="h-7 w-7 text-primary sm:h-10 sm:w-10" />
              <span className="text-primary">
                <FlipBoard text={activeHeroRoute.name} />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg md:text-xl">
              {activeHeroRoute.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-lg shadow-black/20 sm:text-base">
                <span className="text-gray-500">來回</span>
                <span className="text-lg font-black text-primary sm:text-xl">NT$ {activeHeroRoute.fare}</span>
                <span className="text-gray-500">起</span>
              </div>
              <button
                type="button"
                onClick={handleHeroBook}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/40 transition hover:bg-primary-dark sm:text-base"
              >
                <PlusIcon className="h-4 w-4" />
                現在搶票
              </button>
            </div>

            <div className="mt-7 flex items-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.place}
                  type="button"
                  aria-label={`Show ${slide.place}`}
                  onClick={() => setActiveHeroSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeHeroSlide === index ? 'w-8 bg-primary' : 'w-2.5 bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Map search entrance — stays inside hero */}
        <div className={`relative mt-6 flex justify-center transition-all duration-500 ${isOpeningMap ? 'pointer-events-none translate-y-2 opacity-0' : ''}`}>
          <button
            type="button"
            onClick={handleOpenMap}
            className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/25"
          >
            <MapPinIcon className="h-4 w-4 text-primary" />
            地圖搜尋
            <ChevronDownIcon className="h-4 w-4 transition group-hover:translate-y-1" />
          </button>
        </div>
      </div>

      {/* Search section — sits below hero on mobile, overlaps into hero on desktop */}
      <div className="relative lg:-mt-72">
        {/* Search Card — glass over hero on desktop, normal section below hero on mobile */}
        <div ref={searchFormRef} className={`relative mx-auto max-w-7xl px-4 pt-6 transition-all duration-500 lg:pl-20 lg:pr-24 lg:pt-0 ${isDateOpen ? 'z-[65]' : 'z-10'} ${isOpeningMap ? 'pointer-events-none translate-y-2 opacity-0' : ''}`}>
          <div className="relative rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-200 lg:border lg:border-white/25 lg:bg-white/15 lg:p-6 lg:shadow-2xl lg:shadow-black/30 lg:ring-0 lg:backdrop-blur-2xl xl:px-8 xl:py-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-[0.8fr_1.7fr_1.7fr_0.8fr] lg:items-end">
                <div className="relative rounded-lg border border-gray-200 bg-white/70 backdrop-blur-sm transition hover:border-primary/60 hover:bg-orange-50/40 hover:shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
                  <label className="absolute left-9 top-1.5 text-xs font-semibold text-gray-600">航程</label>
                  <ArrowsRightLeftIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <div className="relative mt-1">
                    <select value={tripType} onChange={e => handleTripTypeChange(e.target.value)} className="w-full rounded-lg border-0 bg-transparent pb-1.5 pl-9 pr-3 pt-5 text-sm font-medium focus:outline-none sm:text-base">
                      <option value="roundtrip">來回</option>
                      <option value="oneway">單程</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-0">
                  <AirportDropdown
                    value={form.from}
                    onChange={value => setForm({...form, from: value})}
                    label="出發地 From"
                    groups={destinationAirportGroups}
                    Icon={PlaneTakeoff}
                    roundedClass="rounded-lg sm:rounded-r-none"
                  />
                  <AirportDropdown
                    value={form.to}
                    onChange={value => setForm({...form, to: value})}
                    label="目的地 To"
                    groups={destinationAirportGroups}
                    Icon={PlaneLanding}
                    roundedClass="rounded-lg sm:-ml-px sm:rounded-l-none"
                  />
                </div>

                <DateRangeCalendar
                  depart={form.depart}
                  returnDate={form.returnDate}
                  onDepartChange={date => setForm((current) => ({ ...current, depart: date }))}
                  onReturnChange={date => setForm((current) => ({ ...current, returnDate: date }))}
                  tripType={tripType}
                  openTrigger={calendarOpenTrigger}
                  onOpenChange={setIsDateOpen}
                />

                <div ref={passengerDropdownRef} className="relative rounded-lg border border-gray-200 bg-white/70 backdrop-blur-sm transition hover:border-primary/60 hover:bg-orange-50/40 hover:shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
                  <label className="absolute left-9 top-1.5 text-xs font-semibold text-gray-600">旅客 Passengers</label>
                  <UserGroupIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <div className="relative mt-1">
                    <button
                      type="button"
                      onClick={() => setIsPassengerOpen((current) => !current)}
                      className="w-full rounded-lg border-0 bg-transparent pb-1.5 pl-9 pr-3 pt-5 text-left text-sm font-medium focus:outline-none sm:text-base"
                    >
                      {passengerSummary}
                    </button>
                  </div>
                  {isPassengerOpen && !isMobile && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                      {[
                        { key: 'adult', label: '成人' },
                        { key: 'child', label: '兒童' },
                        { key: 'infant', label: '嬰兒' },
                      ].map((passenger) => (
                        <div key={passenger.key} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
                          <span className="text-sm font-medium text-gray-800">{passenger.label}</span>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => updatePassengerCount(passenger.key, -1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-lg font-semibold text-gray-500 transition hover:border-primary hover:text-primary">-</button>
                            <span className="w-5 text-center text-sm font-bold text-gray-900">{passengerCounts[passenger.key]}</span>
                            <button type="button" onClick={() => updatePassengerCount(passenger.key, 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-lg font-semibold text-gray-500 transition hover:border-primary hover:text-primary">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {isPassengerOpen && isMobile && typeof document !== 'undefined' && createPortal(
                    <>
                      <div className="fixed inset-0 z-[100] bg-black/40" onClick={() => setIsPassengerOpen(false)} aria-hidden="true" />
                      <div className="fixed left-1/2 top-1/2 z-[110] w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-base font-bold text-gray-900">旅客人數</h3>
                          <button type="button" onClick={() => setIsPassengerOpen(false)} className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700" aria-label="關閉">
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                        {[
                          { key: 'adult', label: '成人', sub: '12 歲以上' },
                          { key: 'child', label: '兒童', sub: '2-11 歲' },
                          { key: 'infant', label: '嬰兒', sub: '未滿 2 歲' },
                        ].map((passenger) => (
                          <div key={passenger.key} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{passenger.label}</p>
                              <p className="text-xs text-gray-500">{passenger.sub}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button type="button" onClick={() => updatePassengerCount(passenger.key, -1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-lg font-semibold text-gray-500 transition hover:border-primary hover:text-primary">-</button>
                              <span className="w-5 text-center text-sm font-bold text-gray-900">{passengerCounts[passenger.key]}</span>
                              <button type="button" onClick={() => updatePassengerCount(passenger.key, 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-lg font-semibold text-gray-500 transition hover:border-primary hover:text-primary">+</button>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => setIsPassengerOpen(false)} className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark">完成</button>
                      </div>
                    </>,
                    document.body
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPromoOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur transition hover:bg-white hover:text-primary"
                  >
                    <TagIcon className="h-4 w-4 text-primary" />
                    加入促銷代碼
                  </button>
                  {appliedPromoCode && (
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-primary">
                      已套用：{appliedPromoCode}
                    </span>
                  )}
                </div>
                <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-16 py-3 text-lg font-bold text-white transition hover:bg-primary-dark sm:w-auto sm:min-w-64">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  搜尋航班
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {isPromoOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-primary">
                  <TagIcon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">輸入促銷代碼</h2>
                <p className="mt-1 text-sm text-gray-500">套用優惠代碼，搜尋時查看符合條件的票價。</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPromoOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="關閉促銷代碼視窗"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplyPromoCode} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">促銷代碼 Promo Code</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="例如 TIGER2026"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm uppercase tracking-wide focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPromoOpen(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!promoCode.trim()}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  套用
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mx-auto mb-12 mt-12 max-w-7xl px-4 sm:mt-16">
        <div className="grid grid-cols-5 divide-x divide-gray-200 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="group flex flex-col items-center justify-center gap-1.5 py-3 transition hover:bg-orange-50/60 sm:py-4"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary text-primary transition group-hover:bg-primary group-hover:text-white sm:h-10 sm:w-10">
                <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span className="text-xs font-semibold text-gray-800 sm:text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Squares */}
      <div className="max-w-8xl mx-auto px-4 mb-16">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Promotions</p>
            <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">焦點優惠</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/articles')}
            className="text-sm font-semibold text-gray-600 transition hover:text-primary"
          >
            查看全部
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {promoSquares.map((promo) => (
            <button
              key={promo.title}
              type="button"
              onClick={() => navigate(promo.path || '/search')}
              className="group relative aspect-square overflow-hidden rounded-xl text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <img
                src={promo.img}
                alt={promo.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
              <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white ${promo.tagClass}`}>
                {promo.tag}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                <h3 className="text-sm font-bold leading-tight sm:text-base">{promo.title}</h3>
                <p className="mt-1 text-xs leading-snug text-white/85 line-clamp-2">{promo.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Latest News */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="overflow-hidden rounded-xl bg-white">
          <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-semibold text-primary">News</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">最新消息</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/articles')}
              className="w-fit rounded-lg py-2 text-sm font-semibold text-gray-600 transition hover:text-primary"
            >
              查看全部
            </button>
          </div>
          <div>
            {latestNews.map((news) => (
              <button
                key={news.title}
                type="button"
                onClick={() => navigate(`/articles/${news.id}`)}
                className="flex w-full flex-col gap-2 border-b border-gray-100 px-5 py-4 text-left hover:text-primary transition last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <span className="text-sm font-semibold text-gray-900 sm:text-base hover:text-primary">{news.title}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 sm:text-sm">
                  <CalendarDaysIcon className="h-4 w-4" />
                  {news.date}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center">Why Tigerair 為什麼選擇虎航</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition">
                <f.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-xs sm:text-sm mb-0.5">{f.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
