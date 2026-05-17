import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Armchair, Check, ArrowRight, Sparkles } from 'lucide-react';

const ROWS = 22;
const COLS_LEFT = ['A', 'B', 'C'];
const COLS_RIGHT = ['D', 'E', 'F'];

const seatTypeFor = (row) => {
  if (row <= 2) return 'front';     // 前排優選 (NT$ 300 surcharge)
  if (row >= 11 && row <= 13) return 'exit'; // 緊急出口 (NT$ 200)
  if (row === 1) return 'front';
  return 'standard'; // 一般 (NT$ 0)
};

const seatPrice = (row, included) => {
  if (included) return 0;
  if (row <= 2) return 300;
  if (row >= 11 && row <= 13) return 200;
  return 0;
};

const generateOccupied = (seed) => {
  const set = new Set();
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 26; i += 1) {
    const r = (h * (i + 1) >>> 0) % ROWS + 1;
    const col = [...COLS_LEFT, ...COLS_RIGHT][((h >> i) >>> 0) % 6];
    set.add(`${r}${col}`);
  }
  return set;
};

const SeatGrid = ({ direction, selectedSeatsForDirection, onSeatToggle, activePassengerIdx, occupied, bundleIncludesSeat }) => {
  const flatSelected = new Set(selectedSeatsForDirection.filter(Boolean));
  const activeSeat = selectedSeatsForDirection[activePassengerIdx];

  const renderSeat = (row, col) => {
    const seatId = `${row}${col}`;
    const isOccupied = occupied.has(seatId);
    const isMine = activeSeat === seatId;
    const isOtherPassenger = !isMine && flatSelected.has(seatId);
    const type = seatTypeFor(row);
    const price = seatPrice(row, bundleIncludesSeat);

    let base = 'flex h-9 w-9 items-center justify-center rounded-md text-[10px] font-bold transition border border-transparent';
    if (isOccupied) base += ' cursor-not-allowed bg-gray-200 text-gray-400 line-through';
    else if (isMine) base += ' bg-primary text-white shadow ring-2 ring-primary/40 scale-105';
    else if (isOtherPassenger) base += ' cursor-not-allowed bg-emerald-100 text-emerald-700';
    else if (type === 'front') base += ' bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300';
    else if (type === 'exit') base += ' bg-sky-50 text-sky-700 hover:bg-sky-100 hover:border-sky-300';
    else base += ' bg-gray-100 text-gray-700 hover:bg-orange-50 hover:border-primary/40';

    return (
      <button
        key={seatId}
        type="button"
        disabled={isOccupied || isOtherPassenger}
        title={`${seatId} · ${price === 0 ? '免費' : `+NT$ ${price}`}`}
        onClick={() => onSeatToggle(seatId, price)}
        className={base}
      >
        {col}
      </button>
    );
  };

  return (
    <div>
      {/* Cabin nose */}
      <div className="mx-auto mb-3 flex max-w-[280px] justify-center">
        <div className="relative h-10 w-44 rounded-t-full bg-gray-100">
          <div className="absolute inset-x-0 bottom-0 mx-auto h-px w-32 bg-gray-300" />
          <Plane className="absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 text-gray-400" />
        </div>
      </div>

      {/* Column letters */}
      <div className="mx-auto grid max-w-[280px] grid-cols-[1fr_1fr_1fr_1.2rem_1fr_1fr_1fr] gap-1 px-1 text-center text-[10px] font-bold text-gray-400">
        <span>A</span><span>B</span><span>C</span><span></span><span>D</span><span>E</span><span>F</span>
      </div>

      <div className="mx-auto mt-1 max-w-[280px] space-y-1 px-1">
        {Array.from({ length: ROWS }, (_, i) => i + 1).map((row) => (
          <div key={row} className="grid grid-cols-[1fr_1fr_1fr_1.2rem_1fr_1fr_1fr] items-center gap-1">
            {COLS_LEFT.map((c) => renderSeat(row, c))}
            <span className="text-center text-[9px] font-bold text-gray-300">{row}</span>
            {COLS_RIGHT.map((c) => renderSeat(row, c))}
          </div>
        ))}
      </div>
    </div>
  );
};

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = location.state || {};
  const selectedFlights = incoming.selectedFlights;
  const tripType = incoming.tripType || 'roundtrip';
  const passengerCounts = incoming.passengerCounts || { adult: 2, child: 0, infant: 0 };
  const form = incoming.form || { from: 'TPE', to: 'NRT' };

  const passengerCount = (passengerCounts.adult || 0) + (passengerCounts.child || 0);
  const [activeDirection, setActiveDirection] = useState('outbound');
  const [activePassenger, setActivePassenger] = useState(0);
  const [selections, setSelections] = useState({
    outbound: Array.from({ length: passengerCount }, () => null),
    return: Array.from({ length: passengerCount }, () => null),
  });
  const [extraPrices, setExtraPrices] = useState({
    outbound: Array.from({ length: passengerCount }, () => 0),
    return: Array.from({ length: passengerCount }, () => 0),
  });

  const occupiedByDirection = useMemo(() => ({
    outbound: generateOccupied('IT210-' + (selectedFlights?.outbound?.flight?.id || 'OUT')),
    return: generateOccupied('IT216-' + (selectedFlights?.return?.flight?.id || 'RET')),
  }), [selectedFlights]);

  const directionSelection = selectedFlights?.[activeDirection];
  const bundleIncludesSeat = Boolean(directionSelection?.bundle?.items?.seat?.included);

  const handleSeatToggle = (seatId, price) => {
    setSelections((current) => {
      const next = [...current[activeDirection]];
      next[activePassenger] = next[activePassenger] === seatId ? null : seatId;
      return { ...current, [activeDirection]: next };
    });
    setExtraPrices((current) => {
      const next = [...current[activeDirection]];
      const wasSame = selections[activeDirection][activePassenger] === seatId;
      next[activePassenger] = wasSame ? 0 : price;
      return { ...current, [activeDirection]: next };
    });
  };

  const passengerName = (i) => {
    const p = incoming.passengers?.[i];
    if (p && (p.firstNameEn || p.lastNameEn)) return `${p.lastNameEn || ''} ${p.firstNameEn || ''}`.trim();
    return `旅客 ${i + 1}`;
  };

  const seatSurchargeTotal = useMemo(() => {
    const sum = (arr) => arr.reduce((s, v) => s + (v || 0), 0);
    return sum(extraPrices.outbound) + (tripType === 'oneway' ? 0 : sum(extraPrices.return));
  }, [extraPrices, tripType]);

  const flightsTotal = (selectedFlights?.outbound?.totalPrice || 0) + (tripType === 'oneway' ? 0 : selectedFlights?.return?.totalPrice || 0);
  const grandTotal = flightsTotal + seatSurchargeTotal;

  const allSeatsPicked = (() => {
    const allDir = (arr) => arr.every((s) => s);
    return allDir(selections.outbound) && (tripType === 'oneway' || allDir(selections.return));
  })();

  const handleNext = () => {
    if (!allSeatsPicked) return;
    navigate('/passengers', {
      state: {
        ...incoming,
        seats: selections,
        seatSurchargeTotal,
      },
    });
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

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Compact dark header */}
      <div className="relative -mt-14 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-14 md:-mt-16 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,168,54,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-white">
            <span className="text-sm font-semibold text-primary">Step 2 / 4</span>
            <h1 className="text-xl font-bold sm:text-2xl">{'選擇座位 Seat Selection'}</h1>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {['機票', '座位', '旅客資料', '加購'].map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-bold transition ${
                  idx < 1 ? 'bg-primary text-white' : idx === 1 ? 'bg-white text-gray-900' : 'bg-white/15 text-white/70'
                }`}>{idx < 1 ? <Check className="h-3 w-3" /> : idx + 1}</span>
                <span className={`text-[11px] font-semibold sm:text-xs ${idx === 1 ? 'text-white' : 'text-white/60'}`}>{label}</span>
                {idx < 3 && <span className="mx-0.5 h-px w-5 bg-white/20 sm:w-8" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        {/* Left: seat map */}
        <div className="space-y-5">
          {/* Direction tabs (only if roundtrip) */}
          {tripType === 'roundtrip' && (
            <div className="flex gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
              {['outbound', 'return'].map((d) => {
                const isActive = activeDirection === d;
                const sel = selections[d];
                const filled = sel.filter(Boolean).length;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setActiveDirection(d)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                      isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {d === 'outbound' ? '去程' : '回程'} {form.from} → {form.to}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {filled}/{passengerCount}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Passenger tabs */}
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: passengerCount }).map((_, i) => {
                const isActive = i === activePassenger;
                const picked = selections[activeDirection][i];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePassenger(i)}
                    className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm transition sm:flex-none sm:min-w-40 ${
                      isActive ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${isActive ? 'bg-white text-primary' : 'bg-white text-gray-600 ring-1 ring-gray-200'}`}>{i + 1}</span>
                    <span className="flex-1 truncate text-left text-xs font-bold">{passengerName(i)}</span>
                    {picked ? (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white/15 text-white' : 'bg-emerald-100 text-emerald-700'}`}>{picked}</span>
                    ) : (
                      <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-gray-400'}`}>待選</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seat map */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary"><Armchair className="h-5 w-5" /></span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">座位圖 — {passengerName(activePassenger)}</h2>
                  <p className="text-xs text-gray-500">{activeDirection === 'return' ? `回程 ${form.to} → ${form.from}` : `去程 ${form.from} → ${form.to}`} · {selectedFlights[activeDirection]?.flight?.id}</p>
                </div>
              </div>
              {bundleIncludesSeat && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">方案已含座位 · 免加價</span>
              )}
            </div>

            <div className="mb-3 flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-600">
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-gray-100 ring-1 ring-gray-200" /> 可選</span>
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-amber-100 ring-1 ring-amber-300" /> 前排 +NT$ 300</span>
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-sky-100 ring-1 ring-sky-300" /> 緊急出口 +NT$ 200</span>
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-primary ring-1 ring-primary" /> 你的選擇</span>
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-emerald-100 ring-1 ring-emerald-300" /> 同行旅客</span>
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-gray-200" /> 已佔用</span>
            </div>

            <SeatGrid
              direction={activeDirection}
              selectedSeatsForDirection={selections[activeDirection]}
              onSeatToggle={handleSeatToggle}
              activePassengerIdx={activePassenger}
              occupied={occupiedByDirection[activeDirection]}
              bundleIncludesSeat={bundleIncludesSeat}
            />
          </section>
        </div>

        {/* Right: sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-base font-bold text-gray-900">座位摘要</h3>
            <div className="space-y-2">
              {['outbound', tripType === 'oneway' ? null : 'return'].filter(Boolean).map((d) => (
                <div key={d} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {d === 'return' ? '回程' : '去程'} · {selectedFlights[d]?.flight?.id}
                  </p>
                  {Array.from({ length: passengerCount }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white py-1.5 last:border-b-0 text-xs">
                      <span className="text-gray-600">{passengerName(i)}</span>
                      <span className="font-bold text-gray-900">{selections[d][i] || '—'}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-orange-50 p-3 text-xs">
              <div className="flex justify-between text-gray-700">
                <span>機票小計</span>
                <span className="font-semibold">NT$ {flightsTotal.toLocaleString()}</span>
              </div>
              <div className="mt-1 flex justify-between text-gray-700">
                <span>座位加價</span>
                <span className="font-semibold">NT$ {seatSurchargeTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-900 p-4 text-white">
              <p className="text-xs uppercase tracking-wide text-white/60">總計</p>
              <p className="mt-1 text-2xl font-black">NT$ {grandTotal.toLocaleString()}</p>
            </div>

            {!bundleIncludesSeat && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <Sparkles className="mb-1 h-3.5 w-3.5 text-amber-600" />
                你的票價方案不含指定座位，選擇前排或緊急出口會加價。一般座位免費。
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="sticky bottom-0 z-30 mt-8 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500">已選 {Object.values(selections).flat().filter(Boolean).length} / {passengerCount * (tripType === 'oneway' ? 1 : 2)} 座位</p>
            <p className="text-xl font-black text-gray-900"><span className="mr-1 text-xs font-bold">TWD</span>{grandTotal.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/search')} className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
              上一步
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!allSeatsPicked}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              下一步：填旅客資料 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
