import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, CheckCircle2, AlertCircle, Sparkles, Ticket, ScanLine, Briefcase, ArrowRight, Check } from 'lucide-react';
import { useBoardingPasses } from '../context/BoardingPassesContext';

// Demo data
const DEMO_BOOKING = {
  ref: 'TW8K3L9M2',
  lastName: 'CHEN',
};

const DEMO_FLIGHT = {
  flightNumber: 'IT 210',
  date: '2026-06-15',
  depart: '08:30',
  arrive: '12:45',
  from: 'TPE',
  to: 'NRT',
  fromName: '台北桃園',
  toName: '東京成田',
  terminal: 'T1',
  gate: 'D5',
  counter: '15-18',
  boardingTime: '08:00',
};

const DEMO_PASSENGERS = [
  {
    id: 'p1',
    type: 'adult',
    lastNameEn: 'CHEN',
    firstNameEn: 'MING-WEI',
    fareBundle: 'TigerSmart',
    seat: '14A',
  },
  {
    id: 'p2',
    type: 'adult',
    lastNameEn: 'LEE',
    firstNameEn: 'MEI-LING',
    fareBundle: 'TigerSmart',
    seat: '14B',
  },
  {
    id: 'p3',
    type: 'child',
    lastNameEn: 'CHEN',
    firstNameEn: 'YU-AN',
    fareBundle: 'TigerSmart',
    seat: '14C',
  },
];

const DEMO_PASSPORT_DATA = {
  p1: { passportNumber: 'A1234567', passportExpiry: '2032-06-10', nationality: 'TW' },
  p2: { passportNumber: 'B7891234', passportExpiry: '2031-04-18', nationality: 'TW' },
  p3: { passportNumber: 'C4567890', passportExpiry: '2030-07-25', nationality: 'TW' },
};

const StepHeader = ({ stepIndex }) => {
  const steps = [
    { label: '查詢訂位' },
    { label: '確認航班' },
    { label: '護照資料' },
    { label: '報到完成' },
  ];
  return (
    <div className="relative -mt-14 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-14 md:-mt-16 md:pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(250,168,54,0.16),transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-primary">線上報到</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Online Check-in</h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {steps.map((s, idx) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold transition ${
                idx < stepIndex ? 'bg-primary text-white'
                : idx === stepIndex ? 'bg-white text-gray-900'
                : 'bg-white/15 text-white/70'
              }`}>{idx < stepIndex ? <Check className="h-3.5 w-3.5" /> : idx + 1}</span>
              <span className={`text-xs font-semibold sm:text-sm ${idx === stepIndex ? 'text-white' : 'text-white/60'}`}>{s.label}</span>
              {idx < steps.length - 1 && <span className="mx-1 h-px w-6 bg-white/20 sm:w-10" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LookupStep = ({ onSuccess }) => {
  const [ref, setRef] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({});
  const [attempt, setAttempt] = useState(0);
  const [demoFilled, setDemoFilled] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const errs = {};
    const refUpper = ref.trim().toUpperCase();
    const lastUpper = lastName.trim().toUpperCase();
    if (!refUpper) errs.ref = '請輸入訂位代號';
    else if (refUpper !== DEMO_BOOKING.ref) errs.ref = '查無此訂位代號';
    if (!lastUpper) errs.lastName = '請輸入旅客姓氏';
    else if (lastUpper !== DEMO_BOOKING.lastName) errs.lastName = '姓氏與訂位資料不符';

    if (Object.keys(errs).length > 0) {
      if (attempt >= 1) {
        // Auto-fill demo on 2nd attempt
        setRef(DEMO_BOOKING.ref);
        setLastName(DEMO_BOOKING.lastName);
        setErrors({});
        setDemoFilled(true);
        setAttempt(0);
        return;
      }
      setErrors(errs);
      setAttempt((c) => c + 1);
      return;
    }
    onSuccess();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary">
            <Ticket className="h-7 w-7" />
          </span>
          <h2 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">查詢您的訂位</h2>
          <p className="mt-1 text-sm text-gray-500">起飛前 48 小時至 1 小時可線上報到</p>
        </div>

        {demoFilled && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-800">已自動帶入 demo 訂位資料，請點擊「查詢航班」</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600">訂位代號 Booking Reference *</label>
            <input
              type="text"
              value={ref}
              onChange={(e) => { setRef(e.target.value.toUpperCase()); setErrors((c) => ({ ...c, ref: undefined })); }}
              placeholder={`例：${DEMO_BOOKING.ref}`}
              className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.ref ? 'border-rose-400' : 'border-gray-200 focus:border-primary'}`}
            />
            {errors.ref && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                <AlertCircle className="h-3 w-3" /> {errors.ref}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">旅客姓氏 Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value.toUpperCase()); setErrors((c) => ({ ...c, lastName: undefined })); }}
              placeholder="例：CHEN"
              className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.lastName ? 'border-rose-400' : 'border-gray-200 focus:border-primary'}`}
            />
            {errors.lastName && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                <AlertCircle className="h-3 w-3" /> {errors.lastName}
              </p>
            )}
          </div>
          <button type="submit" className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark">
            查詢航班 Search
          </button>
        </form>

        {(errors.ref || errors.lastName) && attempt >= 1 && !demoFilled && (
          <p className="mt-3 text-center text-xs text-gray-500">再點一次「查詢航班」會自動帶入 demo 資料</p>
        )}
      </div>
    </div>
  );
};

const FlightConfirmStep = ({ selectedPassengerIds, setSelectedPassengerIds, onBack, onNext }) => {
  const togglePassenger = (id) => {
    setSelectedPassengerIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">航班資訊</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-500">航班 / 日期</p>
            <p className="mt-1 text-lg font-bold text-primary">{DEMO_FLIGHT.flightNumber}</p>
            <p className="text-xs text-gray-600">{DEMO_FLIGHT.date}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-500">航線</p>
            <p className="mt-1 text-base font-bold text-gray-900">{DEMO_FLIGHT.from} → {DEMO_FLIGHT.to}</p>
            <p className="text-xs text-gray-600">{DEMO_FLIGHT.fromName} → {DEMO_FLIGHT.toName}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-500">出發 / 抵達</p>
            <p className="mt-1 text-base font-bold text-gray-900">{DEMO_FLIGHT.depart} → {DEMO_FLIGHT.arrive}</p>
            <p className="text-xs text-gray-600">登機 {DEMO_FLIGHT.boardingTime} · 登機門 {DEMO_FLIGHT.gate}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">選擇要報到的旅客</h2>
            <p className="mt-0.5 text-xs text-gray-500">此訂位有 {DEMO_PASSENGERS.length} 位旅客，請勾選要進行線上報到的對象</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPassengerIds(DEMO_PASSENGERS.map((p) => p.id))}
            className="text-xs font-semibold text-primary hover:underline"
          >
            全選
          </button>
        </div>
        <div className="space-y-2">
          {DEMO_PASSENGERS.map((p) => {
            const selected = selectedPassengerIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePassenger(p.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 p-4 text-left transition ${selected ? 'border-primary bg-orange-50/50' : 'border-gray-200 hover:border-primary/50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded ${selected ? 'bg-primary text-white' : 'border-2 border-gray-300'}`}>
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">{p.lastNameEn} {p.firstNameEn}</p>
                    <p className="text-xs text-gray-500">
                      {p.type === 'adult' ? '成人' : p.type === 'child' ? '兒童' : '嬰兒'} · 方案 {p.fareBundle} · 座位 {p.seat}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">已訂位</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-between gap-2">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
          上一步
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedPassengerIds.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          下一步：填寫護照資料 <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const PassportStep = ({ selectedPassengerIds, passportInfo, setPassportInfo, onBack, onSubmit }) => {
  const [errors, setErrors] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [demoFilled, setDemoFilled] = useState(false);

  const selectedPassengers = DEMO_PASSENGERS.filter((p) => selectedPassengerIds.includes(p.id));

  const updateInfo = (id, patch) => {
    setPassportInfo((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  };

  const validate = () => {
    const errs = [];
    selectedPassengers.forEach((p) => {
      const info = passportInfo[p.id] || {};
      if (!info.passportNumber?.trim()) errs.push(`${p.lastNameEn} ${p.firstNameEn}：護照號碼必填`);
      if (!info.passportExpiry) errs.push(`${p.lastNameEn} ${p.firstNameEn}：護照效期必填`);
      if (!info.nationality) errs.push(`${p.lastNameEn} ${p.firstNameEn}：國籍必選`);
    });
    return errs;
  };

  const fillDemo = () => {
    const next = {};
    selectedPassengers.forEach((p) => {
      next[p.id] = { ...DEMO_PASSPORT_DATA[p.id] };
    });
    setPassportInfo(next);
    setDemoFilled(true);
    setErrors([]);
    setAttempt(0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errs = validate();
    if (errs.length > 0) {
      if (attempt >= 1) {
        fillDemo();
        return;
      }
      setErrors(errs);
      setAttempt((c) => c + 1);
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-gray-900">護照資料</h2>
        <p className="mt-1 text-xs text-gray-500">出境前需確認以下資料正確</p>
      </section>

      {errors.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-bold text-rose-700">{errors.length} 項資料需要補齊</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-rose-700/80">
                {errors.slice(0, 4).map((e) => <li key={e}>{e}</li>)}
                {errors.length > 4 && <li>… 共 {errors.length} 項</li>}
              </ul>
              <p className="mt-2 text-xs text-rose-600/80">再點一次「確認報到」會自動帶入 demo 資料</p>
            </div>
          </div>
        </div>
      )}

      {demoFilled && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-800">已自動帶入 demo 護照資料，請點擊「確認報到」</p>
          </div>
        </div>
      )}

      {selectedPassengers.map((p) => {
        const info = passportInfo[p.id] || {};
        return (
          <section key={p.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-primary"><ScanLine className="h-4 w-4" /></span>
              <h3 className="font-bold text-gray-900">{p.lastNameEn} {p.firstNameEn}</h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">{p.type === 'adult' ? '成人' : '兒童'}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="text-xs font-semibold text-gray-600">護照號碼 *</span>
                <input
                  type="text"
                  value={info.passportNumber || ''}
                  onChange={(e) => updateInfo(p.id, { passportNumber: e.target.value.toUpperCase() })}
                  placeholder="例：A1234567"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase tracking-wider focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-gray-600">護照效期 *</span>
                <input
                  type="date"
                  value={info.passportExpiry || ''}
                  onChange={(e) => updateInfo(p.id, { passportExpiry: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-gray-600">國籍 *</span>
                <select
                  value={info.nationality || ''}
                  onChange={(e) => updateInfo(p.id, { nationality: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">請選擇</option>
                  <option value="TW">中華民國</option>
                  <option value="JP">日本</option>
                  <option value="KR">韓國</option>
                </select>
              </label>
            </div>
          </section>
        );
      })}

      <div className="flex justify-between gap-2">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
          上一步
        </button>
        <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark">
          確認報到 <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

const SuccessStep = ({ selectedPassengerIds, onViewPasses }) => {
  const selectedPassengers = DEMO_PASSENGERS.filter((p) => selectedPassengerIds.includes(p.id));
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{selectedPassengers.length} 位旅客報到完成！</h2>
        <p className="mt-2 text-sm text-gray-600">登機證已準備好，請保留至登機門</p>
      </div>

      <div className="mt-5 space-y-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-bold text-gray-700">報到狀態</h3>
        {selectedPassengers.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-bold text-gray-900">{p.lastNameEn} {p.firstNameEn}</p>
                <p className="text-xs text-gray-500">座位 {p.seat} · 登機門 {DEMO_FLIGHT.gate}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">已報到</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onViewPasses}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
      >
        瀏覽登機證 <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

const CheckIn = () => {
  const navigate = useNavigate();
  const { addPasses } = useBoardingPasses();
  const [step, setStep] = useState(0);
  const [selectedPassengerIds, setSelectedPassengerIds] = useState([]);
  const [passportInfo, setPassportInfo] = useState({});

  const completeCheckIn = () => {
    const selectedPassengers = DEMO_PASSENGERS.filter((p) => selectedPassengerIds.includes(p.id));
    const newPasses = selectedPassengers.map((p) => ({
      bookingRef: DEMO_BOOKING.ref,
      passengerName: `${p.lastNameEn} ${p.firstNameEn}`,
      type: p.type,
      seat: p.seat,
      fareBundle: p.fareBundle,
      flight: { ...DEMO_FLIGHT },
      passport: passportInfo[p.id] || DEMO_PASSPORT_DATA[p.id],
      checkedInAt: new Date().toISOString(),
    }));
    addPasses(newPasses);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <StepHeader stepIndex={step} />
      {step === 0 && <LookupStep onSuccess={() => setStep(1)} />}
      {step === 1 && (
        <FlightConfirmStep
          selectedPassengerIds={selectedPassengerIds}
          setSelectedPassengerIds={setSelectedPassengerIds}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <PassportStep
          selectedPassengerIds={selectedPassengerIds}
          passportInfo={passportInfo}
          setPassportInfo={setPassportInfo}
          onBack={() => setStep(1)}
          onSubmit={completeCheckIn}
        />
      )}
      {step === 3 && (
        <SuccessStep selectedPassengerIds={selectedPassengerIds} onViewPasses={() => navigate('/boarding-passes')} />
      )}
    </div>
  );
};

export default CheckIn;
