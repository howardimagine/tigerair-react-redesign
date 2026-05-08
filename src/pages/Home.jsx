import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MapPinIcon,
  CalendarDaysIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import PriceCalendar from '../components/PriceCalendar';
import { latestNews } from '../data/news';

const heroSlides = [
  {
    place: 'Tokyo',
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=900&fit=crop',
  },
  {
    place: 'Osaka',
    img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1920&h=900&fit=crop',
  },
  {
    place: 'Singapore',
    img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&h=900&fit=crop',
  },
  {
    place: 'Vietnam',
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&h=900&fit=crop',
  },
  {
    place: 'Thailand',
    img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1920&h=900&fit=crop',
  },
];

const bannerSlides = [
  {
    title: 'Fly More, Save More',
    subtitle: '精選亞洲航線限時優惠，下一趟旅程現在出發',
    cta: '查看優惠',
    img: 'https://strapi-assets.tigerairtw.com/HRBN_team_Tiger_2880x600_3758637ac4.jpg',
  },
  {
    title: 'Japan City Break',
    subtitle: '東京、大阪熱門航點，輕鬆安排週末小旅行',
    cta: '探索日本',
    img: 'https://strapi-assets.tigerairtw.com/W26_HERO_Banner_2880_X600_431aaa59d7.jpg',
  },
  {
    title: 'Beach & City Escape',
    subtitle: '曼谷、越南、新加坡，城市和海島一次收藏',
    cta: '開始搜尋',
    img: 'https://strapi-assets.tigerairtw.com/banner_2880x600_e31ff8f824.gif',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [form, setForm] = useState({ from: 'TPE', to: 'NRT', depart: '', returnDate: '', passengers: 1 });
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search');
  };

  const handleApplyPromoCode = (e) => {
    e.preventDefault();
    setAppliedPromoCode(promoCode.trim());
    setIsPromoOpen(false);
  };

  const destinations = [
    { city: '東京 Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop', price: 'NT$ 5,999' },
    { city: '首爾 Seoul', country: 'Korea', img: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&h=400&fit=crop', price: 'NT$ 4,999' },
    { city: '大阪 Osaka', country: 'Japan', img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600&h=400&fit=crop', price: 'NT$ 6,499' },
    { city: '曼谷 Bangkok', country: 'Thailand', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', price: 'NT$ 3,999' },
    { city: '新加坡 Singapore', country: 'Singapore', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', price: 'NT$ 4,499' },
    { city: '澳門 Macau', country: 'China', img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=400&fit=crop', price: 'NT$ 2,999' },
    { city: '峴港 Da Nang', country: 'Vietnam', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop', price: 'NT$ 3,299' },
    { city: '普吉 Phuket', country: 'Thailand', img: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&h=400&fit=crop', price: 'NT$ 4,299' },
  ];

  const features = [
    { icon: TagIcon, title: '超值票價', sub: 'Low Fares', desc: '最優惠的機票價格' },
    { icon: GlobeAltIcon, title: '多元航線', sub: 'Routes', desc: '飛往亞洲各大城市' },
    { icon: ShieldCheckIcon, title: '安全保障', sub: 'Safety', desc: '嚴格的安全標準' },
    { icon: PaperAirplaneIcon, title: '準點起飛', sub: 'On-time', desc: '高準點率保證' },
  ];

  const bannerAds = [
    {
      title: 'Early Bird Sale 早鳥優惠',
      subtitle: '日本、韓國熱門航線限時開搶',
      cta: '立即訂票',
      img: 'https://strapi-assets.tigerairtw.com/HRBN_team_Tiger_2880x600_3758637ac4.jpg',
    },
    {
      title: 'Weekend Getaway 週末輕旅行',
      subtitle: '亞洲城市短航線，說走就走',
      cta: '探索航線',
      img: 'https://strapi-assets.tigerairtw.com/W26_HERO_Banner_2880_X600_431aaa59d7.jpg',
    },
  ];

  const quickActions = [
    { icon: PaperAirplaneIcon, label: '訂位購票', path: '/search' },
    { icon: CheckCircleIcon, label: '確認定位', path: '/orders' },
    { icon: InformationCircleIcon, label: '自助報到', path: '/checkin' },
    { icon: SignalIcon, label: '航班動態', path: '/flight-status' },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBannerSlide((current) => (current + 1) % bannerSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[380px] overflow-hidden bg-gray-900 sm:h-[600px]">
        {heroSlides.map((slide, index) => (
          <img
            key={slide.place}
            src={slide.img}
            alt={`${slide.place} travel scene`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              activeHeroSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Explore Asia with Tigerair</h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90">探索亞洲，從這裡開始</p>
            <div className="mt-5 flex items-center gap-2">
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
      </div>

      {/* Search Card */}

      <div className="max-w-8xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-10 mb-12">
        <div className="bg-white rounded-xl shadow-lg">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-gray-200">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="relative px-4 py-4 group overflow-hidden transition hover:bg-orange-50 border-r border-gray-100 last:border-r-0"
              >
                <div className="flex items-center justify-center gap-2">
                  <action.icon className="h-5 w-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-sm text-gray-900">{action.label}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div className="p-5 sm:p-6 md:p-8">
            <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.7fr_1.7fr_0.8fr_0.9fr] lg:items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">航程 Trip</label>
                <div className="relative">
                  <ArrowsRightLeftIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select value={tripType} onChange={e => setTripType(e.target.value)} className="w-full border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="roundtrip">來回</option>
                    <option value="oneway">單程</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">出發地 From</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <select value={form.from} onChange={e => setForm({...form, from: e.target.value})} className="w-full border border-gray-200 rounded-l-lg rounded-r-none py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="TPE">台北桃園 TPE</option>
                      <option value="KHH">高雄 KHH</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">目的地 To</label>
                  <div className="relative -ml-px">
                    <PaperAirplaneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <select value={form.to} onChange={e => setForm({...form, to: e.target.value})} className="w-full border border-gray-200 rounded-l-none rounded-r-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="NRT">東京成田 NRT</option>
                      <option value="KIX">大阪關西 KIX</option>
                      <option value="ICN">首爾仁川 ICN</option>
                      <option value="BKK">曼谷 BKK</option>
                      <option value="SIN">新加坡 SIN</option>
                      <option value="MFM">澳門 MFM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">去程 Depart</label>
                  <div className="relative [&_input]:rounded-l-lg [&_input]:rounded-r-none [&_input]:pl-9">
                    <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <PriceCalendar value={form.depart} onChange={e => setForm({...form, depart: e})} placeholder="選擇出發日期" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">回程 Return</label>
                  <div className="relative -ml-px [&_input]:rounded-l-none [&_input]:rounded-r-lg [&_input]:pl-9">
                    <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <PriceCalendar value={form.returnDate} onChange={e => setForm({...form, returnDate: e})} placeholder="選擇回程日期" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">旅客 Passengers</label>
                <div className="relative">
                  <UserGroupIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select value={form.passengers} onChange={e => setForm({...form, passengers: Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} 位</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  搜尋航班
                </button>
              </div>
            </form>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPromoOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-primary"
              >
                <TagIcon className="h-4 w-4" />
                加入促銷代碼
              </button>
              {appliedPromoCode && (
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-primary">
                  已套用：{appliedPromoCode}
                </span>
              )}
            </div>
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

      {/* Popular Destinations */}
      <div className="max-w-8xl mx-auto px-4 mb-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Popular Destinations 熱門航線</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {destinations.map(d => (
            <div key={d.city} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group" onClick={() => navigate('/search')}>
              <div className="overflow-hidden">
                <img src={d.img} alt={d.city} className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="px-5 py-5">
                <h3 className="font-bold text-base sm:text-lg">{d.city}</h3>
                <p className="text-sm text-gray-500">{d.country}</p>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-xl font-bold leading-none text-primary sm:text-2xl">{d.price} 起</span>
                  <span className="text-xs text-gray-400">單程 / 含稅</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="relative h-56 overflow-hidden rounded-xl bg-gray-900 shadow-sm sm:h-100">
          {bannerSlides.map((banner, index) => (
            <button
              key={banner.title}
              type="button"
              onClick={() => navigate('/search')}
              className={`absolute inset-0 text-left transition-opacity duration-700 ease-in-out ${
                activeBannerSlide === index ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <img src={banner.img} alt={banner.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 sm:px-10">
                <div className="max-w-xl text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-light">Tigerair Promotion</p>
                  <h2 className="text-2xl font-bold sm:text-4xl">{banner.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/90 sm:text-base">{banner.subtitle}</p>
                  <span className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
                    {banner.cta}
                  </span>
                </div>
              </div>
            </button>
          ))}

          <div className="absolute bottom-5 left-6 flex items-center gap-2 sm:left-10">
            {bannerSlides.map((banner, index) => (
              <button
                key={banner.title}
                type="button"
                aria-label={`Show banner ${index + 1}`}
                onClick={() => setActiveBannerSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeBannerSlide === index ? 'w-8 bg-primary' : 'w-2.5 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Banner Ads */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {bannerAds.map((banner) => (
            <button
              key={banner.title}
              type="button"
              onClick={() => navigate('/search')}
              className="relative h-48 sm:h-56 overflow-hidden rounded-xl text-left shadow-sm transition hover:shadow-md group"
            >
              <img src={banner.img} alt={banner.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/45" />
              <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{banner.title}</h2>
                <p className="text-sm sm:text-base opacity-90 mb-4">{banner.subtitle}</p>
                <span className="inline-flex w-fit items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold transition group-hover:bg-primary-dark">
                  {banner.cta}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="max-w-8xl mx-auto px-4 py-12 sm:py-16">
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col items-start justify-center p-6 sm:p-8 lg:p-10">
              <h2 className="max-w-2xl text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                台灣虎航擁有眾多不同航線，供旅客在各城市中自在飛行。
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                快使用低價航點地圖功能，一覽日、韓、泰、越、澳等各城市的低價機票，實現說走就走的自在旅程。
              </p>
              <button
                onClick={() => navigate('/fare-map')}
                className="mt-6 inline-flex items-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary"
              >
                低價航點地圖
              </button>
            </div>

            <div className="border-t border-gray-100 bg-gray-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { city: 'Tokyo', code: 'NRT', fare: 'NT$ 5,999 起' },
                  { city: 'Osaka', code: 'KIX', fare: 'NT$ 6,499 起' },
                  { city: 'Seoul', code: 'ICN', fare: 'NT$ 4,999 起' },
                  { city: 'Bangkok', code: 'BKK', fare: 'NT$ 3,999 起' },
                  { city: 'Vietnam', code: 'DAD', fare: 'NT$ 3,299 起' },
                  { city: 'Macau', code: 'MFM', fare: 'NT$ 2,999 起' },
                ].map((route) => (
                  <button
                    key={route.code}
                    type="button"
                    onClick={() => navigate('/fare-map')}
                    className="rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-primary hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-gray-900">{route.city}</span>
                      <span className="rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-primary">{route.code}</span>
                    </div>
                    <p className="mt-3 text-xs font-medium text-gray-500">{route.fare}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
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
