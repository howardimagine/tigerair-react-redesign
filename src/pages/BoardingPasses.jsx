import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane, Wallet, Download, WifiOff, Apple, Smartphone, Trash2,
  Cloud, CloudRain, Sun, Shield, BedDouble, Umbrella, MapPin, Wind, Droplets, ChevronDown,
  Train, Car, Wifi, Sparkles, Coins, PhoneCall,
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

// Shared wallet/PDF/remove actions row — all buttons same height & style
const ActionsRow = ({ pass, platform, onRemove, handleWallet }) => {
  const baseBtn = 'inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {platform === 'android' ? (
        <button
          type="button"
          onClick={() => handleWallet('google')}
          className={`${baseBtn} bg-gray-900 text-white shadow hover:bg-black`}
        >
          <Wallet className="h-4 w-4" />
          加入 Google Wallet
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleWallet('apple')}
          className={`${baseBtn} bg-black text-white shadow hover:bg-gray-800`}
        >
          <Apple className="h-4 w-4" />
          加入 Apple Wallet
        </button>
      )}
      <button
        type="button"
        className={`${baseBtn} border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary`}
      >
        <Download className="h-4 w-4" />
        下載 PDF
      </button>
      <button
        type="button"
        onClick={() => onRemove(pass.id)}
        className={`${baseBtn} ml-auto border border-gray-200 bg-white text-gray-500 hover:border-rose-300 hover:text-rose-600`}
      >
        <Trash2 className="h-4 w-4" />
        移除登機證
      </button>
    </div>
  );
};

// Desktop horizontal layout — main white section + orange right stub
const HorizontalTicket = ({ pass }) => (
  <div className="relative flex overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/15 ring-1 ring-black/5">
    {/* Left main section (white) */}
    <div className="relative flex-1 p-8">
      {/* Top row: route + barcode */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="flex items-baseline gap-3 font-mono text-5xl font-black tracking-tight text-gray-900">
            <span>{pass.flight.from}</span>
            <span className="text-primary text-4xl">›</span>
            <span>{pass.flight.to}</span>
          </h2>
          <div className="mt-1 flex gap-12 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <span>{pass.flight.fromName}</span>
            <span>{pass.flight.toName}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-64">
            <Barcode seed={pass.bookingRef} />
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Checked in
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="mt-10 grid grid-cols-4 gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Passenger</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">{pass.passengerName}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Terminal</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">{pass.flight.terminal}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Flight</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">{pass.flight.flightNumber}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Seat</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">{pass.seat}</p>
        </div>
      </div>

      {/* Boarding + secondary */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Boarding</p>
          <p className="mt-1 font-mono text-3xl font-black tracking-tight text-primary">
            {pass.flight.boardingTime} <span className="text-xl text-primary/80">· {pass.flight.date}</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Gate · Counter</p>
          <p className="mt-1 font-mono text-2xl font-black tracking-tight text-gray-900">
            {pass.flight.gate} <span className="text-base text-gray-400">·</span> {pass.flight.counter}
          </p>
        </div>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-widest text-gray-400">
        Booking {pass.bookingRef}　·　{pass.flight.depart} → {pass.flight.arrive}
      </p>
    </div>

    {/* Perforation between main and stub */}
    <div className="relative flex w-px items-stretch bg-gray-100 before:absolute before:-top-2 before:left-1/2 before:h-4 before:w-4 before:-translate-x-1/2 before:rounded-full before:bg-gray-50 before:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:h-4 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-gray-50 after:content-['']">
      <span className="my-3 block border-l-2 border-dashed border-gray-300" />
    </div>

    {/* Right orange stub */}
    <div
      className="relative flex w-64 flex-col bg-primary p-6 text-gray-900"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.2) 1.5px, transparent 1.6px)',
        backgroundSize: '16px 16px',
      }}
    >
      <div>
        <h3 className="flex items-baseline gap-2 font-mono text-3xl font-black tracking-tight">
          <span>{pass.flight.from}</span>
          <span>›</span>
          <span>{pass.flight.to}</span>
        </h3>
        <div className="mt-1 flex gap-3 text-[9px] font-bold uppercase tracking-widest text-gray-900/70">
          <span>{pass.flight.fromName}</span>
          <span>{pass.flight.toName}</span>
        </div>
      </div>

      <div className="my-6 flex flex-1 flex-col justify-center gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Seat</p>
          <p className="mt-0.5 font-mono text-5xl font-black leading-none tracking-tighter">{pass.seat}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Flight</p>
            <p className="mt-0.5 font-mono text-base font-black tracking-tight">{pass.flight.flightNumber}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Gate</p>
            <p className="mt-0.5 font-mono text-base font-black tracking-tight">{pass.flight.gate}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900/60">Boarding</p>
          <p className="mt-0.5 font-mono text-xl font-black tracking-tight">{pass.flight.boardingTime}</p>
          <p className="text-[10px] font-bold text-gray-900/70">{pass.flight.date}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-gray-900/15 pt-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/85 text-white">
          <span className="text-[10px] font-bold">IT</span>
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Tigerair Taiwan</span>
      </div>
    </div>
  </div>
);

const BoardingPassCard = ({ pass, onRemove, platform }) => {
  const qrUrl = `${QR_API}${encodeURIComponent(buildQrData(pass))}`;
  const handleWallet = (kind) => {
    alert(`Demo: 加入${kind === 'apple' ? ' Apple Wallet' : ' Google Wallet'} — ${pass.flight.flightNumber} / ${pass.passengerName}`);
  };

  return (
    <>
      {/* Desktop: horizontal ticket */}
      <div className="hidden md:block">
        <HorizontalTicket pass={pass} />
        <div className="mt-4">
          <ActionsRow pass={pass} platform={platform} onRemove={onRemove} handleWallet={handleWallet} />
        </div>
      </div>

      {/* Mobile: original vertical card */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/15 ring-1 ring-black/5 md:hidden">
      {/* White header strip */}
      <div className="relative flex items-center justify-between bg-white px-5 py-3">
        <span className="text-2xl font-black tracking-tight text-gray-900">{pass.flight.from}</span>
        <div className="flex flex-col items-center gap-0.5">
          <Plane className="h-4 w-4 -rotate-12 text-gray-900" />
          <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">{pass.flight.date.slice(5)}</span>
        </div>
        <span className="text-2xl font-black tracking-tight text-gray-900">{pass.flight.to}</span>
      </div>

      {/* Perforation divider */}
      <div className="relative h-2 bg-primary">
        <div className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-gray-50 shadow-inner" />
        <div className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-gray-50 shadow-inner" />
      </div>

      {/* Yellow body with dot pattern */}
      <div
        className="relative bg-primary px-5 pb-4 pt-4 text-gray-900"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.6px)',
          backgroundSize: '16px 16px',
        }}
      >
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gray-900/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white shadow">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Checked in
        </div>

        <div className="grid grid-cols-2 gap-y-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Flight</p>
            <p className="mt-0.5 text-xl font-black tracking-tight text-gray-900">{pass.flight.flightNumber}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Seat</p>
            <p className="mt-0.5 text-xl font-black tracking-tight text-gray-900">{pass.seat}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Terminal</p>
            <p className="mt-0.5 text-xl font-black tracking-tight text-gray-900">{pass.flight.terminal}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Gate</p>
            <p className="mt-0.5 text-xl font-black tracking-tight text-gray-900">{pass.flight.gate}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Boarding at</p>
            <p className="mt-0.5 text-3xl font-black tracking-tight text-gray-900">{pass.flight.boardingTime}</p>
          </div>
        </div>

        {/* Passenger + details strip */}
        <div className="mt-3 grid grid-cols-2 gap-y-1.5 border-t border-gray-900/15 pt-3 text-xs">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Passenger</p>
            <p className="text-[11px] font-bold text-gray-900">{pass.passengerName}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Counter</p>
            <p className="text-[11px] font-bold text-gray-900">{pass.flight.counter}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Booking</p>
            <p className="text-[11px] font-bold text-gray-900">{pass.bookingRef}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900/60">Route</p>
            <p className="text-[11px] font-bold text-gray-900">{pass.flight.depart} → {pass.flight.arrive}</p>
          </div>
        </div>

        {/* Barcode */}
        <div className="mt-3">
          <Barcode seed={pass.bookingRef + pass.seat} />
          <p className="mt-1 text-center text-[9px] font-mono tracking-[0.4em] text-gray-900/70">
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
    </>
  );
};

// Mock destination data — weather + city photo
const destinationData = {
  NRT: {
    name: '東京', tempHi: 22, tempLo: 14, condition: 'sunny', humidity: 58, wind: 12,
    hint: '建議帶薄外套，午後可能短暫陣雨',
    photo: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=900&h=600&fit=crop',
    forecast: [
      { day: '今', icon: 'sunny', hi: 22, lo: 14 },
      { day: '明', icon: 'cloudy', hi: 21, lo: 13 },
      { day: '三', icon: 'rain', hi: 19, lo: 12 },
      { day: '四', icon: 'sunny', hi: 23, lo: 15 },
    ],
  },
  KIX: {
    name: '大阪', tempHi: 25, tempLo: 16, condition: 'cloudy', humidity: 62, wind: 8,
    hint: '舒適氣溫，適合戶外散步賞景',
    photo: 'https://images.unsplash.com/photo-1604834733992-8453fdf4ba68?w=900&h=600&fit=crop',
    forecast: [
      { day: '今', icon: 'cloudy', hi: 25, lo: 16 },
      { day: '明', icon: 'sunny', hi: 26, lo: 17 },
      { day: '三', icon: 'sunny', hi: 27, lo: 18 },
      { day: '四', icon: 'cloudy', hi: 24, lo: 15 },
    ],
  },
  OKA: {
    name: '沖繩', tempHi: 28, tempLo: 22, condition: 'sunny', humidity: 75, wind: 18,
    hint: '紫外線強，請帶防曬與帽子',
    photo: 'https://images.unsplash.com/photo-1610971250019-f677bc1300be?w=900&h=600&fit=crop',
    forecast: [
      { day: '今', icon: 'sunny', hi: 28, lo: 22 },
      { day: '明', icon: 'sunny', hi: 29, lo: 23 },
      { day: '三', icon: 'rain', hi: 26, lo: 22 },
      { day: '四', icon: 'sunny', hi: 28, lo: 23 },
    ],
  },
  ICN: {
    name: '首爾', tempHi: 8, tempLo: -2, condition: 'snow', humidity: 50, wind: 15,
    hint: '低溫降雪，建議厚外套與防滑鞋',
    photo: 'https://images.unsplash.com/photo-1637073758540-f2aaec39e9c3?w=900&h=600&fit=crop',
    forecast: [
      { day: '今', icon: 'snow', hi: 8, lo: -2 },
      { day: '明', icon: 'cloudy', hi: 6, lo: -3 },
      { day: '三', icon: 'snow', hi: 4, lo: -5 },
      { day: '四', icon: 'sunny', hi: 9, lo: -1 },
    ],
  },
  BKK: {
    name: '曼谷', tempHi: 34, tempLo: 26, condition: 'sunny', humidity: 70, wind: 6,
    hint: '炎熱潮濕，多補水並避免日曬高峰',
    photo: 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?w=900&h=600&fit=crop',
    forecast: [
      { day: '今', icon: 'sunny', hi: 34, lo: 26 },
      { day: '明', icon: 'sunny', hi: 35, lo: 27 },
      { day: '三', icon: 'rain', hi: 32, lo: 26 },
      { day: '四', icon: 'cloudy', hi: 33, lo: 26 },
    ],
  },
};

const conditionIcon = (condition) => {
  if (condition === 'snow') return Cloud;
  if (condition === 'cloudy') return Cloud;
  if (condition === 'rain') return CloudRain;
  return Sun;
};

const ForecastIcon = ({ icon, className }) => {
  const Icon = icon === 'snow' ? Cloud : icon === 'cloudy' ? Cloud : icon === 'rain' ? CloudRain : Sun;
  return <Icon className={className} />;
};

// Hotel data per destination
const hotelData = {
  NRT: [
    { name: '東京新宿 京王廣場大飯店', area: '新宿', price: 4200, img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=240&fit=crop' },
    { name: 'Shibuya Sky Hotel', area: '澀谷', price: 3600, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=240&fit=crop' },
  ],
  KIX: [
    { name: '大阪難波光芒飯店', area: '難波', price: 3200, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=240&fit=crop' },
    { name: 'Cross Hotel Osaka', area: '心齋橋', price: 3800, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=240&fit=crop' },
  ],
  OKA: [
    { name: '沖繩海濱度假村', area: '那霸', price: 4500, img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=240&fit=crop' },
    { name: 'Hyatt Regency Naha', area: '國際通', price: 5200, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=240&fit=crop' },
  ],
  ICN: [
    { name: '首爾明洞 N 酒店', area: '明洞', price: 2800, img: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&h=240&fit=crop' },
    { name: 'L7 Gangnam', area: '江南', price: 3400, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=240&fit=crop' },
  ],
  BKK: [
    { name: 'Bangkok Marriott', area: '素坤逸', price: 3200, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=240&fit=crop' },
    { name: 'Park Hyatt Bangkok', area: '帕林普', price: 5800, img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=240&fit=crop' },
  ],
};

// eslint-disable-next-line no-unused-vars
const TravelTipsLegacy = ({ pass }) => {
  const [open, setOpen] = useState(false);
  const fallback = {
    name: pass.flight.to, tempHi: 24, tempLo: 18, condition: 'sunny', humidity: 60, wind: 10,
    hint: '一切看起來都不錯，準備出發吧！',
    photo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&h=600&fit=crop',
    forecast: [
      { day: '今', icon: 'sunny', hi: 24, lo: 18 },
      { day: '明', icon: 'cloudy', hi: 23, lo: 17 },
      { day: '三', icon: 'sunny', hi: 25, lo: 19 },
      { day: '四', icon: 'rain', hi: 22, lo: 17 },
    ],
  };
  const weather = destinationData[pass.flight.to] || fallback;
  const hotels = hotelData[pass.flight.to] || [];
  const WeatherIcon = conditionIcon(weather.condition);

  return (
    <section className="mt-6">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white px-5 py-4 shadow-sm transition hover:border-primary hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
            <Umbrella className="h-5 w-5" />
          </span>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Travel Tips</p>
            <h2 className="text-base font-bold text-gray-900">旅遊小提醒 — {weather.name} {weather.tempHi}° <WeatherIcon className="inline h-4 w-4 align-middle text-amber-500" /></h2>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white transition ${open ? 'rotate-180' : ''}`} style={{ transformOrigin: 'center' }}>
          <ChevronDown className="h-3.5 w-3.5" />
          {open ? '收起' : 'Show more'}
        </span>
      </button>

      {open && (
        <div className="mt-3 animate-fade-in-delay-2 grid gap-4 lg:grid-cols-3">
          {/* Weather card with destination photo */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-900 text-white shadow-lg lg:col-span-1">
            <img
              src={weather.photo}
              alt={weather.name}
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/40 to-gray-900/80" />
            <div className="relative p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-90">
                    <MapPin className="h-3 w-3" /> {weather.name} · {pass.flight.to}
                  </p>
                  <p className="mt-3 text-6xl font-black leading-none tracking-tighter">
                    {weather.tempHi}°
                  </p>
                  <p className="mt-1 text-xs font-bold opacity-80">最低 {weather.tempLo}°</p>
                </div>
                <div className="relative">
                  <WeatherIcon className="h-14 w-14 drop-shadow-lg" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/20 pt-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 opacity-80" />
                  濕度 {weather.humidity}%
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 opacity-80" />
                  風速 {weather.wind} km/h
                </div>
              </div>

              {/* 4-day forecast */}
              <div className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-black/30 p-2 backdrop-blur">
                {weather.forecast.map((f) => (
                  <div key={f.day} className="flex flex-col items-center gap-0.5 text-[10px]">
                    <span className="font-bold opacity-80">{f.day}</span>
                    <ForecastIcon icon={f.icon} className="h-4 w-4" />
                    <span className="font-bold">{f.hi}°</span>
                    <span className="opacity-60">{f.lo}°</span>
                  </div>
                ))}
              </div>

              <p className="mt-3 rounded-lg bg-white/15 p-2 text-[11px] leading-relaxed backdrop-blur">
                💡 {weather.hint}
              </p>
            </div>
          </div>

          {/* Travel insurance — tigerair orange */}
          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-primary to-primary-dark px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide opacity-90">Tigerair Care</p>
                  <h3 className="text-base font-bold">旅平險加保</h3>
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-700">飛行中享有意外醫療、行李遺失、班機延誤等多重保障。</p>
              <ul className="mt-3 space-y-2 text-xs">
                <li className="flex items-center gap-2 rounded-lg bg-orange-50/60 px-3 py-2 text-gray-700">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  醫療給付最高 <span className="font-bold text-primary">200 萬</span>
                </li>
                <li className="flex items-center gap-2 rounded-lg bg-orange-50/60 px-3 py-2 text-gray-700">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  行李遺失賠償 <span className="font-bold text-primary">30,000</span>
                </li>
                <li className="flex items-center gap-2 rounded-lg bg-orange-50/60 px-3 py-2 text-gray-700">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  班機延誤 <span className="font-bold text-primary">4 小時起賠</span>
                </li>
              </ul>
              <button type="button" className="mt-4 w-full rounded-lg bg-primary px-3 py-2.5 text-xs font-bold text-white shadow transition hover:bg-primary-dark">
                立即加保 NT$ 320 起
              </button>
            </div>
          </div>

          {/* Hotel — with photos */}
          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-amber-500 to-primary px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide opacity-90">Hotels</p>
                  <h3 className="text-base font-bold">{weather.name} 熱門住宿</h3>
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="mb-3 text-xs text-gray-700">搭配機票享 8 折合作飯店優惠</p>
              <div className="space-y-2">
                {hotels.map((h) => (
                  <div key={h.name} className="flex items-center gap-3 rounded-xl border border-gray-100 p-2 transition hover:border-primary/40 hover:shadow-sm">
                    <img src={h.img} alt={h.name} className="h-14 w-16 flex-shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-gray-900">{h.name}</p>
                      <p className="text-[10px] text-gray-500">{h.area}</p>
                      <p className="mt-0.5 text-xs font-black text-primary">NT$ {h.price.toLocaleString()}<span className="text-[10px] font-normal text-gray-400"> /晚</span></p>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-4 w-full rounded-lg border-2 border-primary bg-white px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white">
                查看更多住宿
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 lg:col-span-3">* 以上資訊為示範用，實際請依當地公告與保單條款為準。</p>
        </div>
      )}
    </section>
  );
};

const TipsHeader = ({ pass, passCount, onAddCheckIn, onOpenAi }) => {
  const [open, setOpen] = useState(false);
  const fallback = {
    name: pass?.flight.to || '—', tempHi: 24, tempLo: 18, condition: 'sunny', humidity: 60, wind: 10,
    hint: '一切看起來都不錯，準備出發吧！',
    photo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&h=900&fit=crop',
    forecast: [
      { day: '今', icon: 'sunny', hi: 24, lo: 18 },
      { day: '明', icon: 'cloudy', hi: 23, lo: 17 },
      { day: '三', icon: 'sunny', hi: 25, lo: 19 },
      { day: '四', icon: 'rain', hi: 22, lo: 17 },
    ],
  };
  const weather = pass ? (destinationData[pass.flight.to] || fallback) : fallback;
  const hotels = pass ? (hotelData[pass.flight.to] || []) : [];
  const WeatherIcon = conditionIcon(weather.condition);
  // Higher-res destination photo for header background
  const headerPhoto = weather.photo.replace(/w=\d+&h=\d+/, 'w=1600&h=900');

  return (
    <div className="relative -mt-14 overflow-hidden bg-gray-950 pt-14 md:-mt-16 md:pt-16">
      {/* Destination photo background — visible when expanded, faded when collapsed */}
      <img
        src={headerPhoto}
        alt={weather.name}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${open ? 'opacity-85' : 'opacity-30'}`}
      />
      <div className={`absolute inset-0 bg-gradient-to-b transition-all duration-700 ${open ? 'from-gray-900/35 via-gray-900/20 to-gray-900/55' : 'from-gray-900/85 via-gray-900/80 to-gray-800/90'}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(250,168,54,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-5xl px-4 pb-4 pt-4 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary">我的登機證</p>
            <h1 className="mt-0.5 text-lg font-bold text-white sm:text-3xl">Boarding Passes</h1>
            <p className="mt-1 text-[11px] text-white/70 sm:text-xs">共 {passCount} 張 · 支援離線</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <button type="button" onClick={onAddCheckIn} className="whitespace-nowrap rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:px-4 sm:py-2 sm:text-xs">
              + 新增報到
            </button>
            {pass && (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-gray-900/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur transition hover:bg-gray-900/80 sm:px-4 sm:text-xs"
              >
                <Umbrella className="h-3.5 w-3.5 text-primary" />
                旅遊提醒
                <ChevronDown className={`h-3.5 w-3.5 text-white/70 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Expanded tip cards — icons (no emojis), backdrop-blur, fewer borders */}
        {open && pass && (
          <>
            <div className="mt-6 animate-fade-in-delay-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Weather */}
              <div className="rounded-3xl bg-white/75 p-5 text-gray-900 shadow-xl shadow-black/20 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <Sun className="h-3.5 w-3.5 text-amber-500" /> 當地天氣
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-900">{weather.name} · {pass.flight.to}</p>
                    <p className="mt-3 text-5xl font-black leading-none tracking-tighter">{weather.tempHi}°</p>
                    <p className="mt-1 text-xs text-gray-500">最低 {weather.tempLo}° · 濕度 {weather.humidity}% · 風速 {weather.wind} km/h</p>
                  </div>
                  <WeatherIcon className="h-10 w-10 text-amber-400" />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 rounded-2xl bg-gray-50/80 p-3 backdrop-blur">
                  {weather.forecast.map((f) => (
                    <div key={f.day} className="flex flex-col items-center gap-0.5 text-[10px] text-gray-700">
                      <span className="text-gray-500">{f.day}</span>
                      <ForecastIcon icon={f.icon} className="h-4 w-4 text-gray-600" />
                      <span className="font-bold">{f.hi}°</span>
                      <span className="text-gray-400">{f.lo}°</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-600">{weather.hint}</p>
              </div>

              {/* Travel insurance */}
              <div className="rounded-3xl bg-white/75 p-5 text-gray-900 shadow-xl shadow-black/20 backdrop-blur-xl">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <Shield className="h-3.5 w-3.5 text-primary" /> Tigerair Care
                </p>
                <h3 className="mt-1 text-sm font-bold text-gray-900">旅平險加保</h3>
                <ul className="mt-3 space-y-1.5 text-xs text-gray-700">
                  <li className="flex items-center justify-between"><span>醫療給付</span><span className="font-bold">最高 200 萬</span></li>
                  <li className="flex items-center justify-between"><span>行李遺失</span><span className="font-bold">賠償 30,000</span></li>
                  <li className="flex items-center justify-between"><span>班機延誤</span><span className="font-bold">4 小時起賠</span></li>
                </ul>
                <p className="mt-4 text-xs text-gray-600">NT$ 320 起 / 趟</p>
                <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  了解更多 →
                </button>
              </div>

              {/* Hotel */}
              <div className="rounded-3xl bg-white/75 p-5 text-gray-900 shadow-xl shadow-black/20 backdrop-blur-xl">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <BedDouble className="h-3.5 w-3.5 text-primary" /> 熱門住宿
                </p>
                <h3 className="mt-1 text-sm font-bold text-gray-900">{weather.name} 合作飯店 · 享 8 折</h3>
                <div className="mt-3 space-y-2">
                  {hotels.slice(0, 2).map((h) => (
                    <div key={h.name} className="flex items-center gap-3 rounded-2xl bg-gray-50/70 p-2">
                      <img src={h.img} alt={h.name} className="h-11 w-14 flex-shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-gray-900">{h.name}</p>
                        <p className="text-[10px] text-gray-500">{h.area} · NT$ {h.price.toLocaleString()}/晚</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  了解更多 →
                </button>
              </div>

              {/* Transport — descriptive + direct taxi-call CTA */}
              <div className="rounded-3xl bg-white/75 p-5 text-gray-900 shadow-xl shadow-black/20 backdrop-blur-xl sm:col-span-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <Train className="h-3.5 w-3.5 text-primary" /> 機場交通
                </p>
                <h3 className="mt-1 text-sm font-bold text-gray-900">抵達後怎麼到市區？</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-700">
                  你預計於 <span className="font-bold text-gray-900">{pass.flight.arrive}</span> 抵達 <span className="font-bold text-gray-900">{pass.flight.toName}</span>，機場提供多種交通方式：
                  <span className="font-semibold text-gray-900"> 機場快線（42 分鐘、NT$ 290）</span>、
                  <span className="font-semibold text-gray-900">機場巴士（75 分鐘、NT$ 150）</span>、
                  <span className="font-semibold text-gray-900">地鐵（60 分鐘、NT$ 180）</span>。
                  也可以直接呼叫計程車，落地直接搭車不用排隊。
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-primary-dark"
                  >
                    <PhoneCall className="h-3.5 w-3.5" /> 立即呼叫計程車
                  </button>
                  <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    查看大眾運輸路線 →
                  </button>
                </div>
              </div>

              {/* eSIM — ad-style */}
              <div className="relative overflow-hidden rounded-3xl bg-white/75 p-5 text-gray-900 shadow-xl shadow-black/20 backdrop-blur-xl">
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <Coins className="h-2.5 w-2.5" /> 點數可折抵
                </span>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <Wifi className="h-3.5 w-3.5 text-primary" /> 虎航 eSIM
                </p>
                <h3 className="mt-2 text-xl font-black leading-tight text-gray-900">
                  網路買了嗎？
                </h3>
                <p className="mt-1 text-xs text-gray-600">落地一掃 QR 自動連網 · 免換卡免插卡 · 5 天 NT$ 380 起</p>
                <button
                  type="button"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-black"
                >
                  立即購買 eSIM
                </button>
              </div>
            </div>

            {/* AI Trip Planner — standalone CTA button (not card) */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onOpenAi}
                className="group inline-flex items-center gap-2 rounded-full bg-gray-900/70 px-6 py-3 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:bg-gray-900/90"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                幫我安排 {weather.name} 行程
                <span className="text-primary">→</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
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
        <TipsHeader pass={null} passCount={0} onAddCheckIn={() => navigate('/checkin')} onOpenAi={() => navigate('/my-trips')} />
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
      <TipsHeader
        pass={activePass}
        passCount={passes.length}
        onAddCheckIn={() => navigate('/checkin')}
        onOpenAi={() => navigate('/my-trips', { state: { destination: activePass?.flight?.to, destinationName: (destinationData[activePass?.flight?.to]?.name || activePass?.flight?.toName), pass: activePass } })}
      />

      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 sm:py-6 lg:px-8">
        {passes.length > 1 && (
          <div className="mb-3 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2 whitespace-nowrap">
              {passes.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition sm:text-xs ${
                    activeIdx === idx ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-primary'
                  }`}
                >
                  {p.passengerName} · {p.seat}
                </button>
              ))}
            </div>
          </div>
        )}

        {activePass && <BoardingPassCard pass={activePass} onRemove={removePass} platform={platform} />}

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
