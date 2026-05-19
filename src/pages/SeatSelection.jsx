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

const SeatGrid = ({ direction, selectedSeatsForDirection, onSeatToggle, activePassengerIdx, occupied, bundleIncludesSeat, infantAttachMap }) => {
  // infantAttachMap: { [seatId]: true } — seats where an infant is attached
  const flatSelected = new Set(selectedSeatsForDirection.filter((s) => typeof s === 'string'));
  const activeSeat = typeof selectedSeatsForDirection[activePassengerIdx] === 'string' ? selectedSeatsForDirection[activePassengerIdx] : null;

  const renderSeat = (row, col) => {
    const seatId = `${row}${col}`;
    const isOccupied = occupied.has(seatId);
    const isMine = activeSeat === seatId;
    const isOtherPassenger = !isMine && flatSelected.has(seatId);
    const hasInfant = infantAttachMap?.[seatId];
    const type = seatTypeFor(row);
    const price = seatPrice(row, bundleIncludesSeat);

    let base = 'flex h-9 w-9 items-center justify-center rounded-md text-[10px] font-bold transition border border-transparent';
    if (isOccupied) base += ' cursor-not-allowed bg-gray-200 text-gray-400 line-through';
    else if (isMine) base += ' bg-primary text-white shadow ring-2 ring-primary/40 scale-105';
    else if (isOtherPassenger) base += ' cursor-not-allowed bg-emerald-100 text-emerald-700';
    else if (type === 'front') base += ' bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300';
    else if (type === 'exit') base += ' bg-sky-50 text-sky-700 hover:bg-sky-100 hover:border-sky-300';
    else base += ' bg-gray-100 text-gray-700 hover:bg-orange-50 hover:border-primary/40';

    // Infant attached — overlay a dashed outline + tiny baby emoji corner
    if (hasInfant) base += ' relative ring-2 ring-pink-500 ring-offset-1';

    return (
      <button
        key={seatId}
        type="button"
        disabled={isOccupied || isOtherPassenger}
        title={`${seatId} · ${price === 0 ? '免費' : `+NT$ ${price}`}${hasInfant ? ' · 嬰兒同座' : ''}`}
        onClick={() => onSeatToggle(seatId, price)}
        className={base}
      >
        {col}
        {hasInfant && <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink-500 text-[8px] text-white">👶</span>}
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

  // Build full passenger list including infants for the tab strip
  const passengerList = useMemo(() => {
    if (incoming.passengers?.length) {
      return incoming.passengers.map((p, idx) => ({ idx, type: p.type || 'adult' }));
    }
    const list = [];
    let idx = 0;
    for (let i = 0; i < (passengerCounts.adult || 0); i += 1) list.push({ idx: idx++, type: 'adult' });
    for (let i = 0; i < (passengerCounts.child || 0); i += 1) list.push({ idx: idx++, type: 'child' });
    for (let i = 0; i < (passengerCounts.infant || 0); i += 1) list.push({ idx: idx++, type: 'infant' });
    return list;
  }, [incoming.passengers, passengerCounts]);

  const seatPassengerIndices = passengerList.filter((p) => p.type !== 'infant').map((p) => p.idx);
  const infantPassengerIndices = passengerList.filter((p) => p.type === 'infant').map((p) => p.idx);
  const totalPassengers = passengerList.length;

  const [activeDirection, setActiveDirection] = useState('outbound');
  const [activePassenger, setActivePassenger] = useState(passengerList[0]?.idx ?? 0);
  // selections: index → seat string (for seat passengers) | adult-idx number (for infant)
  const [selections, setSelections] = useState({
    outbound: Array.from({ length: totalPassengers }, () => null),
    return: Array.from({ length: totalPassengers }, () => null),
  });
  const [extraPrices, setExtraPrices] = useState({
    outbound: Array.from({ length: totalPassengers }, () => 0),
    return: Array.from({ length: totalPassengers }, () => 0),
  });

  const isInfant = (idx) => passengerList.find((p) => p.idx === idx)?.type === 'infant';
  const adultsWithSeats = (direction) =>
    seatPassengerIndices.filter((i) => selections[direction][i] !== null);
  // For a given direction, find which adult an infant is attached to (or null)
  const getInfantAttachAdult = (direction, infantIdx) => selections[direction][infantIdx];
  // For a given direction, find which infant is attached to an adult
  const getAdultsInfant = (direction, adultIdx) =>
    infantPassengerIndices.find((i) => selections[direction][i] === adultIdx);

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

  const handleAttachInfantToAdult = (adultIdx) => {
    if (!isInfant(activePassenger)) return;
    setSelections((current) => {
      const next = [...current[activeDirection]];
      next[activePassenger] = next[activePassenger] === adultIdx ? null : adultIdx;
      return { ...current, [activeDirection]: next };
    });
  };

  const passengerName = (i) => {
    const p = incoming.passengers?.[i];
    if (p && (p.firstNameEn || p.lastNameEn)) return `${p.lastNameEn || ''} ${p.firstNameEn || ''}`.trim();
    return `旅客 ${i + 1}`;
  };
  const passengerTypeLabel = (i) => {
    const t = passengerList.find((p) => p.idx === i)?.type;
    if (t === 'infant') return '嬰兒';
    if (t === 'child') return '兒童';
    return '成人';
  };

  const seatSurchargeTotal = useMemo(() => {
    const sum = (arr) => arr.reduce((s, v) => s + (v || 0), 0);
    return sum(extraPrices.outbound) + (tripType === 'oneway' ? 0 : sum(extraPrices.return));
  }, [extraPrices, tripType]);

  const flightsTotal = (selectedFlights?.outbound?.totalPrice || 0) + (tripType === 'oneway' ? 0 : selectedFlights?.return?.totalPrice || 0);
  const grandTotal = flightsTotal + seatSurchargeTotal;

  const isDirectionComplete = (direction) => {
    // Each seat passenger has a seat
    const seatsOk = seatPassengerIndices.every((i) => selections[direction][i]);
    // Each infant attached to an adult
    const infantsOk = infantPassengerIndices.every((i) => {
      const adultIdx = selections[direction][i];
      return adultIdx !== null && adultIdx !== undefined && selections[direction][adultIdx];
    });
    return seatsOk && infantsOk;
  };
  const allSeatsPicked = isDirectionComplete('outbound') && (tripType === 'oneway' || isDirectionComplete('return'));

  const handleNext = () => {
    if (!allSeatsPicked) return;
    navigate('/add-ons', {
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
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-white sm:gap-x-3">
            <span className="text-xs font-semibold text-primary sm:text-sm">Step 3 / 4</span>
            <h1 className="text-lg font-bold sm:text-2xl">{'選擇座位'}</h1>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {['機票', '旅客資料', '座位', '加購'].map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-bold transition ${
                  idx < 2 ? 'bg-primary text-white' : idx === 2 ? 'bg-white text-gray-900' : 'bg-white/15 text-white/70'
                }`}>{idx < 2 ? <Check className="h-3 w-3" /> : idx + 1}</span>
                <span className={`text-[11px] font-semibold sm:text-xs ${idx === 2 ? 'text-white' : 'text-white/60'}`}>{label}</span>
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
                const filled = sel.filter((v, i) => v !== null && v !== undefined && (isInfant(i) ? sel[v] : true)).length;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setActiveDirection(d)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold transition sm:gap-2 sm:px-3 sm:text-sm ${
                      isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {d === 'outbound' ? '去程' : '回程'} {form.from} → {form.to}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {filled}/{totalPassengers}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Passenger tabs */}
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {passengerList.map((p) => {
                const i = p.idx;
                const isActive = i === activePassenger;
                const isInf = p.type === 'infant';
                const picked = selections[activeDirection][i];
                const displayPick = isInf
                  ? (typeof picked === 'number' ? `依附 ${passengerName(picked)}` : '')
                  : picked;
                const accent = isInf ? 'ring-pink-300' : 'ring-gray-200';
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePassenger(i)}
                    className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm transition sm:flex-none sm:min-w-40 ${
                      isActive
                        ? isInf ? 'bg-pink-500 text-white shadow-md' : 'bg-primary text-white shadow-md'
                        : `bg-gray-50 text-gray-700 hover:bg-orange-50 ring-1 ${accent}`
                    }`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                      isActive ? 'bg-white text-gray-900' : 'bg-white text-gray-600 ring-1 ring-gray-200'
                    }`}>{isInf ? '👶' : i + 1}</span>
                    <span className="flex-1 truncate text-left text-xs font-bold">
                      {passengerName(i)} <span className={`ml-1 text-[9px] font-normal ${isActive ? 'opacity-80' : 'opacity-60'}`}>{passengerTypeLabel(i)}</span>
                    </span>
                    {displayPick ? (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-white/15 text-white' : (isInf ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-700')
                      }`}>{displayPick}</span>
                    ) : (
                      <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-gray-400'}`}>待選</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active panel: seat map (for seat passengers) OR infant attach (for infants) */}
          {isInfant(activePassenger) ? (
            <section className="rounded-2xl border border-pink-200 bg-pink-50/50 p-5 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600 text-lg">👶</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">嬰兒安排 — {passengerName(activePassenger)}</h2>
                  <p className="text-xs text-pink-700">2 歲以下嬰兒不需獨立座位，請選擇一位成人依附（嬰兒將與該成人同座）</p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 ring-1 ring-pink-100">
                <p className="mb-3 text-xs font-bold text-gray-700">選擇依附的成人</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {seatPassengerIndices.map((aIdx) => {
                    const adultIsAdult = passengerList.find((p) => p.idx === aIdx)?.type === 'adult';
                    if (!adultIsAdult) return null;
                    const isAttached = selections[activeDirection][activePassenger] === aIdx;
                    const adultSeat = selections[activeDirection][aIdx];
                    return (
                      <button
                        key={aIdx}
                        type="button"
                        onClick={() => handleAttachInfantToAdult(aIdx)}
                        className={`flex items-center justify-between gap-3 rounded-xl border-2 p-3 text-left transition ${
                          isAttached ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-900">{passengerName(aIdx)}</p>
                          <p className="text-[11px] text-gray-500">
                            {adultSeat ? `座位 ${adultSeat}` : '尚未選座位'}
                          </p>
                        </div>
                        {isAttached && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-pink-500 px-2.5 py-1 text-[10px] font-bold text-white">
                            <Check className="h-3 w-3" /> 已依附
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[11px] text-gray-500">提示：被依附的成人座位上會出現 <span className="inline-block h-3 w-3 rounded-sm bg-gray-100 align-middle ring-2 ring-pink-500" /> 粉色外框 + 👶 標記。</p>
              </div>
            </section>
          ) : (
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
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-gray-100 ring-2 ring-pink-500" /> 嬰兒同座</span>
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-gray-200" /> 已佔用</span>
              </div>

              <SeatGrid
                direction={activeDirection}
                selectedSeatsForDirection={selections[activeDirection]}
                onSeatToggle={handleSeatToggle}
                activePassengerIdx={activePassenger}
                occupied={occupiedByDirection[activeDirection]}
                bundleIncludesSeat={bundleIncludesSeat}
                infantAttachMap={infantPassengerIndices.reduce((acc, iIdx) => {
                  const attachedAdult = selections[activeDirection][iIdx];
                  if (typeof attachedAdult === 'number') {
                    const adultSeat = selections[activeDirection][attachedAdult];
                    if (typeof adultSeat === 'string') acc[adultSeat] = true;
                  }
                  return acc;
                }, {})}
              />
            </section>
          )}
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
                  {passengerList.map((p) => {
                    const i = p.idx;
                    const val = selections[d][i];
                    let display = '—';
                    if (p.type === 'infant') {
                      if (typeof val === 'number') {
                        const adultSeat = selections[d][val];
                        display = adultSeat ? `依附 ${passengerName(val)} (${adultSeat})` : `依附 ${passengerName(val)}`;
                      }
                    } else if (typeof val === 'string') {
                      display = val;
                    }
                    return (
                      <div key={i} className="flex items-center justify-between border-b border-white py-1.5 last:border-b-0 text-xs">
                        <span className="text-gray-600">
                          {p.type === 'infant' && '👶 '}{passengerName(i)}
                        </span>
                        <span className={`font-bold ${p.type === 'infant' ? 'text-pink-600' : 'text-gray-900'}`}>{display}</span>
                      </div>
                    );
                  })}
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500">已選 {Object.values(selections).flat().filter((v) => v !== null && v !== undefined).length} / {totalPassengers * (tripType === 'oneway' ? 1 : 2)} 旅客</p>
            <p className="text-xl font-black text-gray-900"><span className="mr-1 text-xs font-bold">TWD</span>{grandTotal.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/passengers', { state: incoming })} className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
              上一步
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!allSeatsPicked}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              下一步：加購 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
