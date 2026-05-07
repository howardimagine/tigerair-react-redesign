import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane, Tag, Globe, Shield, Users } from 'lucide-react';
import PriceCalendar from '../components/PriceCalendar';

const Home = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [form, setForm] = useState({ from: 'TPE', to: 'NRT', depart: '', returnDate: '', passengers: 1 });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search');
  };

  const destinations = [
    { city: '東京 Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop', price: 'NT$ 5,999' },
    { city: '首爾 Seoul', country: 'Korea', img: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&h=400&fit=crop', price: 'NT$ 4,999' },
    { city: '大阪 Osaka', country: 'Japan', img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600&h=400&fit=crop', price: 'NT$ 6,499' },
    { city: '曼谷 Bangkok', country: 'Thailand', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', price: 'NT$ 3,999' },
    { city: '新加坡 Singapore', country: 'Singapore', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', price: 'NT$ 4,499' },
    { city: '澳門 Macau', country: 'China', img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=400&fit=crop', price: 'NT$ 2,999' },
  ];

  const features = [
    { icon: Tag, title: '超值票價', sub: 'Low Fares', desc: '最優惠的機票價格' },
    { icon: Globe, title: '多元航線', sub: 'Routes', desc: '飛往亞洲各大城市' },
    { icon: Shield, title: '安全保障', sub: 'Safety', desc: '嚴格的安全標準' },
    { icon: Plane, title: '準點起飛', sub: 'On-time', desc: '高準點率保證' },
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

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[380px] sm:h-[480px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=800&fit=crop)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Explore Asia with Tigerair</h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90">探索亞洲，從這裡開始</p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 sm:-mt-24 relative z-10 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 md:p-8">
          <div className="flex gap-3 mb-5">
            <button onClick={() => setTripType('roundtrip')} className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${tripType === 'roundtrip' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              來回 Round Trip
            </button>
            <button onClick={() => setTripType('oneway')} className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${tripType === 'oneway' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              單程 One Way
            </button>
          </div>
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">出發地 From</label>
              <select value={form.from} onChange={e => setForm({...form, from: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="TPE">台北桃園 TPE</option>
                <option value="KHH">高雄 KHH</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">目的地 To</label>
              <select value={form.to} onChange={e => setForm({...form, to: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="NRT">東京成田 NRT</option>
                <option value="KIX">大阪關西 KIX</option>
                <option value="ICN">首爾仁川 ICN</option>
                <option value="BKK">曼谷 BKK</option>
                <option value="SIN">新加坡 SIN</option>
                <option value="MFM">澳門 MFM</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">去程 Depart</label>
              <PriceCalendar value={form.depart} onChange={e => setForm({...form, depart: e})} placeholder="選擇出發日期" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">回程 Return</label>
              <PriceCalendar value={form.returnDate} onChange={e => setForm({...form, returnDate: e})} placeholder="選擇回程日期" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">旅客 Passengers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select value={form.passengers} onChange={e => setForm({...form, passengers: Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} 位</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                搜尋航班
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Popular Destinations 熱門航線</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {destinations.map(d => (
            <div key={d.city} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group" onClick={() => navigate('/search')}>
              <div className="overflow-hidden">
                <img src={d.img} alt={d.city} className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base sm:text-lg">{d.city}</h3>
                <p className="text-sm text-gray-500">{d.country}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-primary font-bold">{d.price} 起</span>
                  <span className="text-xs text-gray-400">單程 / 含稅</span>
                </div>
              </div>
            </div>
          ))}
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

      {/* Promo Banner */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="relative rounded-xl overflow-hidden h-48 sm:h-60" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=400&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-primary/80"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">低價航點地圖</h2>
            <p className="text-base sm:text-lg mb-4 opacity-90">全航線最低 NT$ 1,999 起</p>
            <button onClick={() => navigate('/fare-map')} className="bg-white text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition">
              立即搶購
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
