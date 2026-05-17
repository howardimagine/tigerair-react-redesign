import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane, Wallet, Download, WifiOff, Apple, Smartphone, Building2, Trash2,
  Cloud, CloudRain, Sun, Shield, BedDouble, Umbrella, MapPin, Thermometer, Wind, Droplets,
} from 'lucide-react';
import { useBoardingPasses } from '../context/BoardingPassesContext';

const QR_API = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=';

const buildQrData = (pass) =>
  `M1${pass.passengerName}${pass.bookingRef} ${pass.flight.from}${pass.flight.to}${pass.flight.flightNumber.replace(/\s/g, '')} ${pass.flight.date.replace(/-/g, '')} ${pass.seat}`;

const detectPlatform = () => {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  if (/Macintosh|Mac OS X/.test(ua) || platform === 'MacIntel') return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
};

// Generate deterministic barcode-style bars for a given seed string
const useBarcodeBars = (seed) => useMemo(() => {
  const bars = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 90; i += 1) {
    const v = (hash >> (i % 16)) & 0xff ^ (hash * (i + 1)) & 0xff;
    bars.push((v % 3) + 1); // 1px to 3px widths
  }
  return bars;
}, [seed]);

const Barcode = ({ seed }) => {
  const bars = useBarcodeBars(seed || 'demo');
  return (
    <div className="flex h-14 items-center gap-[1px] overflow-hidden rounded-sm bg-white p-1">
      {bars.map((w, i) => (
        <span
          key={i}
          className="block h-full"
          style={{ width: `${w}px`, backgroundColor: i % 2 === 0 ? '#111' : 'transparent' }}
        />
      ))}
    </div>
  );
};

const BoardingPassCard = ({ pass, onRemove, platform }) => {
  const qrUrl = `${QR_API}${encodeURIComponent(buildQrData(pass))}`;
  const handleWallet = (kind) => {
    alert(`Demo: 加入${kind === 'apple' ? ' Apple Wallet' : ' Google Wallet'} — ${pass.flight.flightNumber} / ${pass.passengerName}`);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/15 ring-1 ring-black/5">
      {/* White header strip */}
      <div className="relative flex items-center justify-between bg-white px-6 py-5">
        <span className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{pass.flight.from}</span>
        <div className="flex flex-col items-center gap-0.5">
          <Plane className="h-5 w-5 -rotate-12 text-gray-900" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{pass.flight.date.slice(5)}</span>
        </div>
        <span className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{pass.flight.to}</span>
      </div>

      {/* Perforation divider */}
      <div className="relative h-3 bg-primary">
        <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gray-50 shadow-inner" />
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gray-50 shadow-inner" />
      </div>

      {/* Yellow body with dot pattern */}
      <div
        className="relative bg-primary px-6 py-7 text-gray-900"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.6px)',
          backgroundSize: '18px 18px',
        }}
      >
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gray-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Checked in
        </div>

        <div className="mt-6 grid grid-cols-2 gap-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Flight</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-gray-900">{pass.flight.flightNumber}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Seat</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-gray-900">{pass.seat}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Terminal</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-gray-900">{pass.flight.terminal}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Gate</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-gray-900">{pass.flight.gate}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Boarding at</p>
            <p className="mt-1 text-5xl font-black tracking-tight text-gray-900">{pass.flight.boardingTime}</p>
          </div>
        </div>

        {/* Passenger + details strip */}
        <div className="mt-7 grid grid-cols-2 gap-y-3 border-t border-gray-900/15 pt-5 text-xs">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Passenger</p>
            <p className="mt-0.5 font-bold text-gray-900">{pass.passengerName}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Counter</p>
            <p className="mt-0.5 font-bold text-gray-900">{pass.flight.counter}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Booking</p>
            <p className="mt-0.5 font-bold text-gray-900">{pass.bookingRef}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Route</p>
            <p className="mt-0.5 font-bold text-gray-900">{pass.flight.depart} → {pass.flight.arrive}</p>
          </div>
        </div>

        {/* Offline indicator — mobile only */}
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gray-900/85 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 md:hidden">
          <WifiOff className="h-3 w-3" />
          已離線存取 · Offline
        </div>

        {/* Barcode */}
        <div className="mt-6">
          <Barcode seed={pass.bookingRef + pass.seat} />
          <p className="mt-2 text-center text-[10px] font-mono tracking-[0.4em] text-gray-900/70">
            {pass.bookingRef} · {pass.seat}
          </p>
        </div>

        {/* Decorative circular icon (bottom-left like reference) */}
        <div className="absolute bottom-5 left-5 hidden h-10 w-10 items-center justify-center rounded-full bg-gray-900/85 text-white shadow-lg sm:flex">
          <span className="text-xs font-bold">IT</span>
        </div>
      </div>

      {/* Footer: QR + wallet */}
      <div className="grid gap-4 border-t border-gray-100 bg-white px-6 py-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-gray-100 bg-white p-2">
            <img src={qrUrl} alt="QR" className="h-24 w-24" />
          </div>
          <div className="text-xs leading-5 text-gray-500">
            <p className="font-bold text-gray-900">登機 QR</p>
            <p>請於登機門 <span className="font-bold text-gray-900">{pass.flight.gate}</span> 出示</p>
            <p>登機時間 {pass.flight.boardingTime}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          {platform === 'android' ? (
            <button
              type="button"
              onClick={() => handleWallet('google')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-black sm:w-auto"
            >
              <Wallet className="h-5 w-5" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-normal opacity-80">加入</span>
                <span className="block">Google Wallet</span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleWallet('apple')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800 sm:w-auto"
            >
              <Apple className="h-5 w-5" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-normal opacity-80">加入</span>
                <span className="block">Apple Wallet</span>
              </span>
            </button>
          )}
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-primary hover:text-primary sm:w-auto"
          >
            <Download className="h-4 w-4" />
            下載 PDF
          </button>
        </div>
      </div>

      {/* Remove footer */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-2.5 text-[10px] text-gray-500">
        <span>{pass.flight.from} · {pass.flight.terminal} · 報到櫃檯 {pass.flight.counter}</span>
        <button
          type="button"
          onClick={() => onRemove(pass.id)}
          className="inline-flex items-center gap-1 text-gray-400 transition hover:text-rose-600"
        >
          <Trash2 className="h-3 w-3" />
          移除
        </button>
      </div>
    </div>
  );
};

// Mock destination weather data
const destinationData = {
  NRT: { name: '東京', tempHi: 22, tempLo: 14, condition: 'sunny', humidity: 58, wind: 12, hint: '建議帶薄外套，午後可能短暫陣雨' },
  KIX: { name: '大阪', tempHi: 25, tempLo: 16, condition: 'cloudy', humidity: 62, wind: 8, hint: '舒適氣溫，適合戶外散步賞景' },
  OKA: { name: '沖繩', tempHi: 28, tempLo: 22, condition: 'sunny', humidity: 75, wind: 18, hint: '紫外線強，請帶防曬與帽子' },
  ICN: { name: '首爾', tempHi: 8, tempLo: -2, condition: 'snow', humidity: 50, wind: 15, hint: '低溫降雪，建議厚外套與防滑鞋' },
  BKK: { name: '曼谷', tempHi: 34, tempLo: 26, condition: 'sunny', humidity: 70, wind: 6, hint: '炎熱潮濕，多補水並避免日曬高峰' },
};

const conditionIcon = (condition) => {
  if (condition === 'snow') return Cloud;
  if (condition === 'cloudy') return Cloud;
  if (condition === 'rain') return CloudRain;
  return Sun;
};

const TravelTips = ({ pass }) => {
  const weather = destinationData[pass.flight.to] || { name: pass.flight.to, tempHi: 24, tempLo: 18, condition: 'sunny', humidity: 60, wind: 10, hint: '一切看起來都不錯，準備出發吧！' };
  const WeatherIcon = conditionIcon(weather.condition);

  return (
    <section className="mt-8 rounded-3xl border border-sky-200/60 bg-sky-50/50 p-1">
      <div className="rounded-[20px] bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Umbrella className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-600">Travel Tips</p>
              <h2 className="text-lg font-bold text-gray-900">旅遊小提醒</h2>
            </div>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold text-sky-700">
            飛航資訊以外的貼心整理
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {/* Weather */}
          <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide opacity-90">
                  <MapPin className="h-3 w-3" /> {weather.name} · {pass.flight.to}
                </p>
                <p className="mt-2 text-4xl font-black">{weather.tempHi}°<span className="text-xl font-bold opacity-70">/ {weather.tempLo}°</span></p>
              </div>
              <WeatherIcon className="h-10 w-10 opacity-90" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/20 pt-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Droplets className="h-3 w-3 opacity-80" />
                濕度 {weather.humidity}%
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="h-3 w-3 opacity-80" />
                風速 {weather.wind} km/h
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 opacity-90">{weather.hint}</p>
          </div>

          {/* Travel insurance */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Shield className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Insurance</p>
                <h3 className="text-base font-bold text-gray-900">旅平險加保</h3>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700">飛行中享有意外醫療、行李遺失、班機延誤等多重保障。</p>
            <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
              <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-emerald-500" /> 醫療給付最高 200 萬</li>
              <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-emerald-500" /> 行李遺失賠償 30,000</li>
              <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-emerald-500" /> 班機延誤 4 小時起賠</li>
            </ul>
            <button type="button" className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">
              立即加保 NT$ 320 起
            </button>
          </div>

          {/* Hotel */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <BedDouble className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-rose-600">Stay</p>
                <h3 className="text-base font-bold text-gray-900">{weather.name}熱門住宿</h3>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700">搭配機票折扣，於合作飯店預訂享 8 折優惠。</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                <span className="font-semibold text-gray-700">市中心商務飯店</span>
                <span className="font-bold text-rose-600">NT$ 2,400</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                <span className="font-semibold text-gray-700">設計型旅店</span>
                <span className="font-bold text-rose-600">NT$ 3,100</span>
              </div>
            </div>
            <button type="button" className="mt-4 w-full rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-700">
              查看更多住宿
            </button>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-gray-400">* 以上資訊為示範用，實際請依當地公告與保單條款為準。</p>
      </div>
    </section>
  );
};

const BoardingPasses = () => {
  const navigate = useNavigate();
  const { passes, removePass } = useBoardingPasses();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState('other');

  useEffect(() => {
    setPlatform(detectPlatform());
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (activeIdx >= passes.length && passes.length > 0) setActiveIdx(0);
  }, [passes.length, activeIdx]);

  const activePass = passes[activeIdx];

  if (passes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative -mt-14 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-14 md:-mt-16 md:pt-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(250,168,54,0.16),transparent_55%)]" />
          <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-primary">我的登機證</p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Boarding Passes</h1>
          </div>
        </div>
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <Smartphone className="mx-auto h-14 w-14 text-gray-300" />
          <p className="mt-3 text-gray-600">尚未有登機證</p>
          <p className="mt-1 text-xs text-gray-500">完成線上報到後，登機證會儲存在這裡，並可離線存取</p>
          <button type="button" onClick={() => navigate('/checkin')} className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark">
            前往線上報到
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="relative -mt-14 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-14 md:-mt-16 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(250,168,54,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">我的登機證</p>
              <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Boarding Passes</h1>
              <p className="mt-2 text-xs text-white/70">共 {passes.length} 張登機證 · 已支援離線存取</p>
            </div>
            <button type="button" onClick={() => navigate('/checkin')} className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20">
              + 新增報到
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        {passes.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {passes.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeIdx === idx ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-primary'
                }`}
              >
                {p.passengerName} · {p.seat}
              </button>
            ))}
          </div>
        )}

        {activePass && <BoardingPassCard pass={activePass} onRemove={removePass} platform={platform} />}

        {/* Travel tips — clearly separated below boarding pass */}
        {activePass && <TravelTips pass={activePass} />}

        {/* Mobile offline notice */}
        {isMobile && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-2">
              <WifiOff className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-emerald-800">已支援離線存取</p>
                <p className="mt-0.5 text-xs text-emerald-700/80">此頁面已快取，無網路連線時也能開啟登機證</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardingPasses;
