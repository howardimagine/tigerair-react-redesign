import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Wallet, Download, WifiOff, Apple, ArrowLeft, Smartphone, Building2, QrCode, Trash2 } from 'lucide-react';
import { useBoardingPasses } from '../context/BoardingPassesContext';

const QR_API = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=';

const buildQrData = (pass) =>
  `M1${pass.passengerName}${pass.bookingRef} ${pass.flight.from}${pass.flight.to}${pass.flight.flightNumber.replace(/\s/g, '')} ${pass.flight.date.replace(/-/g, '')} ${pass.seat}`;

const BoardingPassCard = ({ pass, onRemove }) => {
  const qrUrl = `${QR_API}${encodeURIComponent(buildQrData(pass))}`;

  const addToWallet = () => {
    // Demo only — in production this would open a .pkpass file
    alert(`Demo: 加入 Apple Wallet — 登機證 ${pass.flight.flightNumber} / ${pass.passengerName}`);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
      {/* Header strip */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-4 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(250,168,54,0.2),transparent_60%)]" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">Tigerair · Boarding Pass</span>
          </div>
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">已報到</span>
        </div>
      </div>

      {/* Route + times */}
      <div className="border-b border-dashed border-gray-200 px-5 py-5 sm:px-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div>
            <p className="text-3xl font-black text-gray-900">{pass.flight.from}</p>
            <p className="mt-0.5 text-xs text-gray-500">{pass.flight.fromName}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{pass.flight.depart}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase text-gray-400">{pass.flight.flightNumber}</span>
            <Plane className="h-5 w-5 text-primary" />
            <span className="text-[10px] text-gray-400">{pass.flight.date}</span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-gray-900">{pass.flight.to}</p>
            <p className="mt-0.5 text-xs text-gray-500">{pass.flight.toName}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{pass.flight.arrive}</p>
          </div>
        </div>
      </div>

      {/* Info cells */}
      <div className="grid grid-cols-3 gap-px bg-gray-100 sm:grid-cols-4">
        <div className="bg-white p-3 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">旅客</p>
          <p className="mt-1 text-sm font-bold text-gray-900">{pass.passengerName}</p>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">座位 Seat</p>
          <p className="mt-1 text-lg font-black text-primary">{pass.seat}</p>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">登機門 Gate</p>
          <p className="mt-1 text-lg font-black text-gray-900">{pass.flight.gate}</p>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">登機時間</p>
          <p className="mt-1 text-sm font-bold text-gray-900">{pass.flight.boardingTime}</p>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Building2 className="h-3 w-3" /> 機場 / 航廈
          </p>
          <p className="mt-1 text-sm font-bold text-gray-900">{pass.flight.from} · {pass.flight.terminal}</p>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">報到櫃檯</p>
          <p className="mt-1 text-sm font-bold text-gray-900">櫃檯 {pass.flight.counter}</p>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">訂位代號</p>
          <p className="mt-1 text-sm font-bold text-gray-900">{pass.bookingRef}</p>
        </div>
        {/* Offline-access cell — mobile only */}
        <div className="bg-emerald-50 p-3 sm:p-4 md:hidden">
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            <WifiOff className="h-3 w-3" /> 已離線存取
          </p>
          <p className="mt-1 text-xs font-semibold text-emerald-800">無網路時仍可開啟</p>
        </div>
      </div>

      {/* QR + Wallet */}
      <div className="border-t border-dashed border-gray-200 px-5 py-5 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch">
          <div className="rounded-xl border-2 border-gray-100 bg-white p-3">
            <img src={qrUrl} alt="boarding pass QR" className="h-32 w-32" />
            <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-500">登機 QR Code</p>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2">
            <button
              type="button"
              onClick={addToWallet}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800"
            >
              <Apple className="h-5 w-5" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-normal opacity-80">加入</span>
                <span className="block">Apple Wallet</span>
              </span>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
            >
              <Wallet className="h-4 w-4" />
              加入 Google Wallet
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
            >
              <Download className="h-4 w-4" />
              下載 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3 text-[11px] text-gray-500 sm:px-6">
        <span>請於登機門 {pass.flight.gate} 集合，登機時間 {pass.flight.boardingTime}</span>
        <button
          type="button"
          onClick={() => onRemove(pass.id)}
          className="inline-flex items-center gap-1 text-gray-400 transition hover:text-rose-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
          移除
        </button>
      </div>
    </div>
  );
};

const BoardingPasses = () => {
  const navigate = useNavigate();
  const { passes, removePass } = useBoardingPasses();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
        {/* Passenger tabs */}
        {passes.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {passes.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeIdx === idx ? 'bg-primary text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-primary'
                }`}
              >
                {p.passengerName} · {p.seat}
              </button>
            ))}
          </div>
        )}

        {activePass && <BoardingPassCard pass={activePass} onRemove={removePass} />}

        {/* Mobile-only offline notice (extra emphasis) */}
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
