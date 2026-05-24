import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Briefcase, UtensilsCrossed, Check, Edit3, Sparkles, User, BedDouble, Star, MapPin, Sliders, X } from 'lucide-react';

const baggageOptions = [
  {
    key: 'none',
    title: '不加購',
    weight: 0,
    price: 0,
    desc: '僅手提行李 10kg',
    tone: 'border-gray-200',
  },
  {
    key: '20kg',
    title: '託運行李 20kg',
    weight: 20,
    price: 800,
    desc: '一件 20kg 託運行李',
    tone: 'border-primary',
  },
  {
    key: '30kg',
    title: '託運行李 30kg',
    weight: 30,
    price: 1200,
    desc: '一件 30kg 託運行李',
    tone: 'border-amber-400',
    badge: '熱賣',
  },
  {
    key: '40kg',
    title: '託運行李 40kg',
    weight: 40,
    price: 1600,
    desc: '兩件 20kg 託運行李',
    tone: 'border-rose-400',
  },
];

const mealOptions = [
  {
    key: 'none',
    title: '不加購',
    price: 0,
    desc: '飛行途中可向空服員購買輕食',
    img: null,
    tags: [],
  },
  {
    key: 'tigerwings',
    title: '台式滷雞腿飯',
    price: 220,
    desc: '經典台味滷雞腿配香菇糙米飯，附青菜與滷蛋',
    img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
    tags: ['熱餐', '招牌'],
  },
  {
    key: 'beefnoodle',
    title: '紅燒牛肉麵',
    price: 240,
    desc: '台式紅燒牛肉麵搭配酸菜與青蔥',
    img: 'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=600&h=400&fit=crop',
    tags: ['熱餐', '麵食'],
  },
  {
    key: 'curryrice',
    title: '日式咖哩雞肉飯',
    price: 220,
    desc: '香濃日式咖哩搭配嫩煎雞肉與蔬菜',
    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop',
    tags: ['熱餐'],
  },
  {
    key: 'veggie',
    title: '蔬食拌飯',
    price: 200,
    desc: '當季時蔬與糙米飯，植物性飲食友善',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    tags: ['素食', '無蛋奶'],
  },
  {
    key: 'kidsmeal',
    title: '兒童套餐',
    price: 180,
    desc: '番茄義大利麵 + 雞塊 + 果汁，附小禮物',
    img: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=600&h=400&fit=crop',
    tags: ['兒童'],
  },
  {
    key: 'snack',
    title: '機上點心組',
    price: 120,
    desc: '虎航限定點心包 + 飲品（咖啡/茶/可樂）',
    img: 'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=600&h=400&fit=crop',
    tags: ['輕食'],
  },
];

// Mock hotels at destination — mirrors SearchResults; used for the last-step 虎加酒 upsell.
const hotelsByCity = {
  NRT: [
    { id: 'h-marriott', name: '東京萬豪酒店', area: '品川 · 御殿山', stars: 5, rating: 4.7, reviews: 1284, pricePerNight: 4280, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=640&h=400&fit=crop', tags: ['免費早餐', '近車站'] },
    { id: 'h-gracery', name: 'Hotel Gracery 新宿', area: '新宿 · 歌舞伎町', stars: 4, rating: 4.5, reviews: 3120, pricePerNight: 3180, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=640&h=400&fit=crop', tags: ['鬧區精選', '哥吉拉景'] },
    { id: 'h-park', name: '東京汐留 Park Hotel', area: '汐留 · 海景樓層', stars: 4, rating: 4.6, reviews: 982, pricePerNight: 3680, img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=640&h=400&fit=crop', tags: ['藝術飯店', '高樓層'] },
    { id: 'h-asakusa', name: '淺草雷門精品酒店', area: '淺草 · 雷門 3 分鐘', stars: 3, rating: 4.4, reviews: 1567, pricePerNight: 2280, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=640&h=400&fit=crop', tags: ['超值首選', '日式風格'] },
  ],
};

const BaggageCard = ({ option, value, onChange, label }) => {
  const selected = value === option.key;
  return (
    <button
      type="button"
      onClick={() => onChange(option.key)}
      className={`relative flex flex-col items-start gap-2 rounded-2xl border-2 bg-white p-4 text-left transition hover:shadow-md ${
        selected ? `${option.tone} ring-2 ring-primary/40 shadow-lg` : 'border-gray-200'
      }`}
    >
      {option.badge && (
        <span className="absolute -top-2 right-3 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white">{option.badge}</span>
      )}
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${selected ? 'bg-primary text-white' : 'bg-orange-50 text-primary'}`}>
        <Briefcase className="h-6 w-6" />
      </div>
      <p className="text-sm font-bold text-gray-900">{option.title}</p>
      <p className="text-xs text-gray-500">{option.desc}</p>
      <p className="mt-auto text-sm font-black text-primary">
        {option.price === 0 ? '免費' : `+ NT$ ${option.price.toLocaleString()}`}
      </p>
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-3 w-3" />
        </span>
      )}
    </button>
  );
};

const MealCard = ({ option, selected, onSelect }) => {
  const noImage = !option.img;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex overflow-hidden rounded-2xl border-2 bg-white text-left transition ${selected ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-primary/50'}`}
    >
      <div className={`relative w-28 flex-shrink-0 ${noImage ? 'bg-gray-100' : ''}`}>
        {noImage ? (
          <div className="flex h-full items-center justify-center">
            <UtensilsCrossed className="h-10 w-10 text-gray-300" />
          </div>
        ) : (
          <img src={option.img} alt={option.title} className="h-full w-full object-cover" />
        )}
        {selected && (
          <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-gray-900">{option.title}</h4>
          <span className="whitespace-nowrap text-sm font-black text-primary">
            {option.price === 0 ? '免費' : `+ NT$ ${option.price}`}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{option.desc}</p>
        {option.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {option.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
};

const FlightLine = ({ direction, selection, route }) => {
  if (!selection) return null;
  const { flight, bundle, totalPrice } = selection;
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-primary">
        {direction === 'return' ? '回程' : '去程'} · {bundle.name}
      </p>
      <div className="flex items-center justify-between text-sm font-bold text-gray-800">
        <span>{flight.depart}</span>
        <Plane className="h-3.5 w-3.5 text-gray-400" />
        <span>{flight.arrive}</span>
      </div>
      <p className="mt-1 text-[10px] text-gray-500">{direction === 'return' ? `${route.to} → ${route.from}` : `${route.from} → ${route.to}`} · {flight.id}</p>
      <p className="mt-2 text-right text-xs font-bold text-gray-600">
        NT$ <span className="text-base text-primary">{totalPrice.toLocaleString()}</span>
      </p>
    </div>
  );
};

const AddOns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = location.state || {};
  const selectedFlights = incoming.selectedFlights;
  const tripType = incoming.tripType || 'roundtrip';
  const passengerCounts = incoming.passengerCounts || { adult: 2, child: 0, infant: 0 };
  const form = incoming.form || { from: 'TPE', to: 'NRT' };
  const passengers = incoming.passengers || [];

  const passengerCount = passengerCounts.adult + passengerCounts.child;
  const [baggagePerPassenger, setBaggagePerPassenger] = useState(
    Array.from({ length: passengerCount }, () => 'none'),
  );
  const [mealPerPassenger, setMealPerPassenger] = useState(
    Array.from({ length: passengerCount }, () => 'none'),
  );
  const [activePassenger, setActivePassenger] = useState(0);

  const baggageTotal = useMemo(
    () => baggagePerPassenger.reduce((sum, key) => {
      const opt = baggageOptions.find((o) => o.key === key);
      return sum + (opt?.price || 0);
    }, 0),
    [baggagePerPassenger],
  );

  const mealTotal = useMemo(
    () => mealPerPassenger.reduce((sum, key) => {
      const opt = mealOptions.find((o) => o.key === key);
      return sum + (opt?.price || 0);
    }, 0),
    [mealPerPassenger],
  );

  const flightsTotal = (selectedFlights?.outbound?.totalPrice || 0) + (tripType === 'oneway' ? 0 : selectedFlights?.return?.totalPrice || 0);

  // === 虎加酒 last-step upsell ===
  const hotelList = hotelsByCity[form.to] || hotelsByCity.NRT;
  const fmt = (d) => d.toISOString().slice(0, 10);
  const today = new Date();
  const defaultCheckIn = form.depart || fmt(today);
  const defaultCheckOut = form.returnDate || fmt(new Date(new Date(defaultCheckIn).getTime() + 3 * 86400000));
  const incomingHotelSeg = incoming.hotel?.segments?.[0];
  const [hotelOpen, setHotelOpen] = useState(Boolean(incomingHotelSeg));
  const [hotelSeg, setHotelSeg] = useState(() => ({
    checkIn: incomingHotelSeg?.checkIn || defaultCheckIn,
    checkOut: incomingHotelSeg?.checkOut || defaultCheckOut,
    rooms: incomingHotelSeg?.rooms || 1,
    adults: incomingHotelSeg?.adults || (passengerCounts.adult || 2),
    area: incomingHotelSeg?.area || '',
    stars: incomingHotelSeg?.stars || 0,
  }));
  const [selectedHotelId, setSelectedHotelId] = useState(incomingHotelSeg?.hotelId || null);
  const [advancedHotel, setAdvancedHotel] = useState(false);
  const hotelNights = Math.max(0, Math.round((new Date(hotelSeg.checkOut).getTime() - new Date(hotelSeg.checkIn).getTime()) / 86400000));
  const selectedHotel = hotelList.find((h) => h.id === selectedHotelId) || null;
  const hotelTotal = selectedHotel && hotelOpen ? selectedHotel.pricePerNight * hotelNights * hotelSeg.rooms : 0;

  const grandTotal = flightsTotal + baggageTotal + mealTotal + hotelTotal;

  const updateBaggage = (i, key) => {
    setBaggagePerPassenger((current) => current.map((v, idx) => (idx === i ? key : v)));
  };

  const updateMeal = (i, key) => {
    setMealPerPassenger((current) => current.map((v, idx) => (idx === i ? key : v)));
  };

  const passengerName = (i) => {
    const p = passengers[i];
    if (p && (p.firstNameEn || p.lastNameEn)) return `${p.lastNameEn || ''} ${p.firstNameEn || ''}`.trim();
    return `旅客 ${i + 1}`;
  };

  const passengerHasSelection = (i) =>
    (baggagePerPassenger[i] && baggagePerPassenger[i] !== 'none') ||
    (mealPerPassenger[i] && mealPerPassenger[i] !== 'none');

  const handleNext = () => {
    const hotelPayload = hotelOpen && selectedHotel
      ? {
          segments: [{ ...hotelSeg, hotelId: selectedHotel.id, hotel: selectedHotel, nights: hotelNights }],
          total: hotelTotal,
        }
      : null;
    navigate('/confirmation', {
      state: {
        ...incoming,
        hotel: hotelPayload,
        addOns: { baggagePerPassenger, mealPerPassenger, baggageTotal, mealTotal, hotelTotal, grandTotal },
      },
    });
  };

  const handleBack = () => {
    navigate('/seat', { state: incoming });
  };

  if (!selectedFlights?.outbound) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">尚未選擇航班</p>
          <button type="button" onClick={() => navigate('/')} className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark">
            回首頁搜尋
          </button>
        </div>
      </div>
    );
  }

  const route = { from: form.from, to: form.to };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="relative -mt-14 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-14 md:-mt-16 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(250,168,54,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-primary">Step 4 / 4</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">加購行李與餐食</h1>
          <p className="mt-1 text-xs text-white/60">行李、機上餐食可額外加購</p>
          <div className="mt-3 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max items-center gap-2 whitespace-nowrap">
              <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white"><Check className="inline h-3 w-3" /> 機票</span>
              <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white"><Check className="inline h-3 w-3" /> 旅客資料</span>
              <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white"><Check className="inline h-3 w-3" /> 座位</span>
              <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-gray-900">4 加購</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-6">
          {/* Passenger tabs */}
          <section className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm sm:p-3">
            <div className="-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-2 whitespace-nowrap sm:w-auto sm:flex-wrap">
                {Array.from({ length: passengerCount }).map((_, i) => {
                  const isActive = i === activePassenger;
                  const hasSel = passengerHasSelection(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivePassenger(i)}
                      className={`group flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition sm:min-w-44 ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isActive ? 'bg-white text-primary' : 'bg-white text-gray-600 ring-1 ring-gray-200'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="truncate text-xs font-bold sm:text-sm">{passengerName(i)}</span>
                      {hasSel && (
                        <Check className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="mt-2 px-2 text-[11px] text-gray-500">為每位旅客個別選擇行李與餐食，切換上方分頁進行設定。</p>
          </section>

          {/* Baggage (active passenger only) */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
                <Briefcase className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">託運行李 — {passengerName(activePassenger)}</h2>
                <p className="text-xs text-gray-500">為這位旅客選擇行李額度，價格依重量計算</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {baggageOptions.map((opt) => (
                <BaggageCard
                  key={opt.key}
                  option={opt}
                  value={baggagePerPassenger[activePassenger]}
                  onChange={(k) => updateBaggage(activePassenger, k)}
                />
              ))}
            </div>
          </section>

          {/* Meals (active passenger only) */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
                <UtensilsCrossed className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">機上餐食 — {passengerName(activePassenger)}</h2>
                <p className="text-xs text-gray-500">為這位旅客挑一份熱騰騰的機上餐點</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {mealOptions.map((opt) => (
                <MealCard
                  key={opt.key}
                  option={opt}
                  selected={mealPerPassenger[activePassenger] === opt.key}
                  onSelect={() => updateMeal(activePassenger, opt.key)}
                />
              ))}
            </div>
          </section>

          {/* Seat already selected reminder */}
          {/* 虎加酒 last-chance upsell — appears after baggage / meal */}
          <section className={`overflow-hidden rounded-2xl border ${hotelOpen ? 'border-primary/30 bg-orange-50/40' : 'border-gray-100 bg-white'} shadow-sm`}>
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${hotelOpen ? 'bg-primary text-white' : 'bg-orange-50 text-primary'}`}>
                <BedDouble className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-black tracking-wide text-white">虎加酒</span>
                  <h2 className="text-base font-bold text-gray-900">
                    {incomingHotelSeg ? '飯店已加入' : '最後加購機會'}
                  </h2>
                </div>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  {incomingHotelSeg
                    ? '可以更換飯店或日期，加購最高折 NT$ 600'
                    : '同時段熱門飯店推薦，現在加上可享機加酒 NT$ 600 折扣'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHotelOpen((c) => !c)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  hotelOpen ? 'border border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary' : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {hotelOpen ? '收合' : '查看飯店'}
              </button>
            </div>

            {hotelOpen && (
              <div className="border-t border-orange-100 bg-white p-4 sm:p-5">
                {/* Hotel criteria */}
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="text-[10px] font-semibold text-gray-500">入住</span>
                      <input
                        type="date"
                        value={hotelSeg.checkIn}
                        onChange={(e) => setHotelSeg((c) => ({ ...c, checkIn: e.target.value }))}
                        className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-900 focus:border-primary focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-semibold text-gray-500">退房</span>
                      <input
                        type="date"
                        value={hotelSeg.checkOut}
                        onChange={(e) => setHotelSeg((c) => ({ ...c, checkOut: e.target.value }))}
                        className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-900 focus:border-primary focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-semibold text-gray-500">房數</span>
                      <select
                        value={hotelSeg.rooms}
                        onChange={(e) => setHotelSeg((c) => ({ ...c, rooms: Number(e.target.value) }))}
                        className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-900 focus:border-primary focus:outline-none"
                      >
                        {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} 間</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-semibold text-gray-500">大人</span>
                      <select
                        value={hotelSeg.adults}
                        onChange={(e) => setHotelSeg((c) => ({ ...c, adults: Number(e.target.value) }))}
                        className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-900 focus:border-primary focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} 人</option>)}
                      </select>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAdvancedHotel((c) => !c)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary"
                  >
                    <Sliders className="h-3 w-3" /> {advancedHotel ? '收合進階條件' : '進階條件'}
                  </button>

                  {advancedHotel && (
                    <div className="mt-2 space-y-2 rounded-lg bg-gray-50 p-2">
                      <label className="block">
                        <span className="text-[10px] font-semibold text-gray-500">區域偏好</span>
                        <select
                          value={hotelSeg.area}
                          onChange={(e) => setHotelSeg((c) => ({ ...c, area: e.target.value }))}
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
                              onClick={() => setHotelSeg((c) => ({ ...c, stars: s }))}
                              className={`flex-1 rounded-md px-2 py-1 text-[11px] font-bold transition ${
                                hotelSeg.stars === s ? 'bg-primary text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100'
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

                {/* Hotel result list */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                    <BedDouble className="h-3.5 w-3.5 text-primary" />
                    同時段飯店推薦{hotelNights > 0 && <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">{hotelNights} 晚</span>}
                  </p>
                  {selectedHotelId && (
                    <button
                      type="button"
                      onClick={() => setSelectedHotelId(null)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-primary"
                    >
                      <X className="h-3 w-3" /> 取消選擇
                    </button>
                  )}
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {hotelList
                    .filter((h) => hotelSeg.stars === 0 || h.stars >= hotelSeg.stars)
                    .filter((h) => !hotelSeg.area || h.area.includes(hotelSeg.area))
                    .map((hotel) => {
                      const isSel = selectedHotelId === hotel.id;
                      const subtotal = hotel.pricePerNight * hotelNights * hotelSeg.rooms;
                      return (
                        <button
                          key={hotel.id}
                          type="button"
                          onClick={() => setSelectedHotelId(hotel.id)}
                          className={`group relative overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 transition hover:shadow-md ${
                            isSel ? 'ring-2 ring-primary' : 'ring-gray-100 hover:ring-gray-200'
                          }`}
                        >
                          {isSel && (
                            <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                              <Check className="h-3 w-3" /> 已選
                            </span>
                          )}
                          <div className="relative h-24 w-full overflow-hidden">
                            <img src={hotel.img} alt={hotel.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                            <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white">{hotel.tags[0]}</span>
                          </div>
                          <div className="p-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-gray-900">{hotel.name}</p>
                                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500">
                                  <MapPin className="h-2.5 w-2.5" />
                                  <span className="truncate">{hotel.area}</span>
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-0.5">
                                {Array.from({ length: hotel.stars }).map((_, i) => (
                                  <Star key={i} className="h-2 w-2 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                            <div className="mt-1.5 flex items-end justify-between gap-2">
                              <span className="rounded bg-emerald-50 px-1 py-0.5 text-[10px] font-bold text-emerald-700">{hotel.rating.toFixed(1)}</span>
                              <div className="text-right leading-tight">
                                <p className="text-base font-black text-primary">
                                  <span className="text-[9px] font-bold">TWD</span> {hotel.pricePerNight.toLocaleString()}
                                  <span className="text-[9px] text-gray-400">/晚</span>
                                </p>
                                {hotelNights > 0 && (
                                  <p className="text-[9px] text-gray-500">小計 {subtotal.toLocaleString()}</p>
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
          </section>

          {incoming.seats && (
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-gray-900">座位已選擇</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    去程 {(incoming.seats.outbound || []).filter((s) => typeof s === 'string').join(' / ')}
                    {tripType !== 'oneway' && (
                      <>　·　回程 {(incoming.seats.return || []).filter((s) => typeof s === 'string').join(' / ')}</>
                    )}
                    {incoming.seatSurchargeTotal > 0 && (
                      <>（額外座位費 NT$ {incoming.seatSurchargeTotal.toLocaleString()}）</>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/seat', { state: incoming })}
                  className="rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  重新選座位
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">訂單明細</h3>
              <button type="button" onClick={() => navigate('/search')} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                <Edit3 className="h-3.5 w-3.5" /> 編輯
              </button>
            </div>
            <FlightLine direction="outbound" selection={selectedFlights.outbound} route={route} />
            {tripType !== 'oneway' && selectedFlights.return && (
              <FlightLine direction="return" selection={selectedFlights.return} route={route} />
            )}

            <div className="rounded-lg bg-gray-50 p-3 text-xs">
              <p className="mb-2 font-bold text-gray-700">加購</p>
              <div className="flex justify-between text-gray-600">
                <span>託運行李</span>
                <span>NT$ {baggageTotal.toLocaleString()}</span>
              </div>
              <div className="mt-1 flex justify-between text-gray-600">
                <span>機上餐食</span>
                <span>NT$ {mealTotal.toLocaleString()}</span>
              </div>
              {hotelOpen && selectedHotel && (
                <div className="mt-1 flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="rounded bg-gray-900 px-1 py-px text-[9px] font-bold text-white">虎加酒</span>
                    <span className="truncate">{selectedHotel.name}</span>
                  </span>
                  <span>NT$ {hotelTotal.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-gray-900 p-4 text-white">
              <p className="text-xs uppercase tracking-wide text-white/60">總計</p>
              <p className="mt-1 text-2xl font-black">NT$ {grandTotal.toLocaleString()}</p>
              <p className="mt-1 text-[10px] text-white/60">{passengerCount} 位旅客 · 含稅 · 含加購</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pt-2.5 pb-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur sm:px-6 sm:pt-3 sm:pb-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <div className="min-w-0 leading-tight">
            <p className="text-[10px] font-semibold text-gray-500">{'總計'}</p>
            <p className="whitespace-nowrap text-lg font-black text-gray-900 sm:text-xl"><span className="mr-1 text-[10px] font-bold">TWD</span>{grandTotal.toLocaleString()}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={handleBack} className="whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-primary hover:text-primary sm:px-4 sm:py-3 sm:text-sm">
              上一步
            </button>
            <button type="button" onClick={handleNext} className="whitespace-nowrap rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark sm:px-6 sm:py-3">
              前往付款
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOns;
