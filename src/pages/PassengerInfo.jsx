import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Briefcase, Armchair, UtensilsCrossed, RefreshCcw, ShieldCheck, Check, Edit3, User, Users } from 'lucide-react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useSavedTravelers } from '../context/SavedTravelersContext';

const passengerTypeLabel = { adult: '成人', child: '兒童', infant: '嬰兒' };

const bundleFeatureList = [
  { key: 'carryOn', label: '手提行李', Icon: Briefcase },
  { key: 'checkedBag', label: '託運行李', Icon: Briefcase },
  { key: 'seat', label: '指定座位', Icon: Armchair },
  { key: 'meal', label: '機上餐食', Icon: UtensilsCrossed },
  { key: 'change', label: '免費變更', Icon: RefreshCcw },
  { key: 'priority', label: '優先登機', Icon: ShieldCheck },
];

const emptyPassenger = () => ({
  type: 'adult',
  nickname: '',
  lastNameEn: '',
  firstNameEn: '',
  lastNameZh: '',
  firstNameZh: '',
  gender: 'male',
  birthDate: '',
  nationality: 'TW',
  passportNumber: '',
  passportExpiry: '',
});

const FlightSummaryCard = ({ direction, selection, route }) => {
  if (!selection) return null;
  const { flight, bundle, totalPrice } = selection;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">
          {direction === 'return' ? '回程' : '去程'} · {bundle.name}
        </p>
        <span className="text-[10px] font-semibold text-gray-400">{flight.id}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xl font-bold text-gray-900">{flight.depart}</p>
          <p className="text-[11px] text-gray-500">{direction === 'return' ? route.to : route.from}</p>
        </div>
        <div className="flex flex-1 flex-col items-center gap-0.5 pb-1">
          <span className="text-[10px] font-medium text-gray-400">{flight.duration}</span>
          <div className="flex w-full items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span className="h-px flex-1 bg-gray-200" />
            <Plane className="h-3.5 w-3.5 text-primary" />
            <span className="h-px flex-1 bg-gray-200" />
            <span className="h-1 w-1 rounded-full bg-primary" />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{flight.arrive}</p>
          <p className="text-[11px] text-gray-500">{direction === 'return' ? route.from : route.to}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1 border-t border-gray-100 pt-3">
        {bundleFeatureList.slice(0, 6).map(({ key, label, Icon }) => {
          const included = bundle.items?.[key]?.included;
          return (
            <div key={key} className={`flex items-center gap-1 text-[10px] ${included ? 'text-gray-700' : 'text-gray-300 line-through'}`}>
              <Icon className="h-3 w-3" />
              {label}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-right text-xs font-semibold text-gray-500">
        小計 <span className="ml-1 text-base font-black text-primary">NT$ {totalPrice.toLocaleString()}</span>
      </p>
    </div>
  );
};

const TravelerPicker = ({ open, onClose, travelers, onPick }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">選擇常用旅客</h3>
            <p className="mt-1 text-xs text-gray-500">點選後自動帶入該旅客資料</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700" aria-label="關閉">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        {travelers.length === 0 ? (
          <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">尚未建立常用旅客 — 你可以到「會員 → 常用旅客」管理</p>
        ) : (
          <div className="space-y-2">
            {travelers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onPick(t)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-left transition hover:border-primary hover:bg-orange-50/50"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {t.nickname || `${t.lastNameZh}${t.firstNameZh}`}
                    <span className="ml-2 text-xs font-normal text-gray-500">{t.lastNameEn} {t.firstNameEn}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">護照 {t.passportNumber} · {t.passportExpiry}</p>
                </div>
                <Check className="h-4 w-4 text-primary opacity-0 transition group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PassengerForm = ({ index, passenger, onChange, savedTravelers, allowSavedPicker, hint }) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const update = (patch) => onChange({ ...passenger, ...patch });

  const handlePick = (t) => {
    update({
      lastNameEn: t.lastNameEn,
      firstNameEn: t.firstNameEn,
      lastNameZh: t.lastNameZh,
      firstNameZh: t.firstNameZh,
      gender: t.gender,
      birthDate: t.birthDate,
      nationality: t.nationality,
      passportNumber: t.passportNumber,
      passportExpiry: t.passportExpiry,
      nickname: t.nickname,
    });
    setPickerOpen(false);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-primary">{index + 1}</span>
          <h3 className="text-lg font-bold text-gray-900">旅客 {index + 1}</h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">{passengerTypeLabel[passenger.type] || '成人'}</span>
          {hint && <span className="text-xs text-gray-500">· {hint}</span>}
        </div>
        {allowSavedPicker && (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-orange-50 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            <Users className="h-3.5 w-3.5" />
            選擇常用旅客
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">英文姓 Last name *</span>
          <input
            type="text"
            value={passenger.lastNameEn}
            onChange={(e) => update({ lastNameEn: e.target.value.toUpperCase() })}
            placeholder="CHEN"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase tracking-wider focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">英文名 First name *</span>
          <input
            type="text"
            value={passenger.firstNameEn}
            onChange={(e) => update({ firstNameEn: e.target.value.toUpperCase() })}
            placeholder="TA-WEI"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase tracking-wider focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">中文姓</span>
          <input
            type="text"
            value={passenger.lastNameZh}
            onChange={(e) => update({ lastNameZh: e.target.value })}
            placeholder="陳"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">中文名</span>
          <input
            type="text"
            value={passenger.firstNameZh}
            onChange={(e) => update({ firstNameZh: e.target.value })}
            placeholder="大為"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">性別 *</span>
          <select
            value={passenger.gender}
            onChange={(e) => update({ gender: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">出生日期 *</span>
          <input
            type="date"
            value={passenger.birthDate}
            onChange={(e) => update({ birthDate: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">國籍 *</span>
          <select
            value={passenger.nationality}
            onChange={(e) => update({ nationality: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="TW">中華民國</option>
            <option value="JP">日本</option>
            <option value="KR">韓國</option>
            <option value="TH">泰國</option>
            <option value="VN">越南</option>
            <option value="HK">香港</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">護照號碼 *</span>
          <input
            type="text"
            value={passenger.passportNumber}
            onChange={(e) => update({ passportNumber: e.target.value.toUpperCase() })}
            placeholder="300123456"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase tracking-wider focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold text-gray-600">護照效期 *</span>
          <input
            type="date"
            value={passenger.passportExpiry}
            onChange={(e) => update({ passportExpiry: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
      </div>

      <TravelerPicker open={pickerOpen} onClose={() => setPickerOpen(false)} travelers={savedTravelers} onPick={handlePick} />
    </div>
  );
};

const ContactForm = ({ contact, onChange }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
    <h3 className="mb-4 text-lg font-bold text-gray-900">聯絡資訊</h3>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="text-xs font-semibold text-gray-600">電子郵件 *</span>
        <input
          type="email"
          value={contact.email}
          onChange={(e) => onChange({ ...contact, email: e.target.value })}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-gray-600">手機號碼 *</span>
        <input
          type="tel"
          value={contact.phone}
          onChange={(e) => onChange({ ...contact, phone: e.target.value })}
          placeholder="+886 912 345 678"
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>
    </div>
  </div>
);

const PassengerInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const isAuthenticated = Boolean(user);
  const { travelers } = useSavedTravelers();

  const incoming = location.state || {};
  const selectedFlights = incoming.selectedFlights || null;
  const tripType = incoming.tripType || 'roundtrip';
  const passengerCounts = incoming.passengerCounts || { adult: 2, child: 0, infant: 0 };
  const form = incoming.form || { from: 'TPE', to: 'NRT' };

  const passengerSlots = useMemo(() => {
    const slots = [];
    const push = (type, count) => {
      for (let i = 0; i < count; i += 1) slots.push({ ...emptyPassenger(), type });
    };
    push('adult', passengerCounts.adult || 1);
    push('child', passengerCounts.child || 0);
    push('infant', passengerCounts.infant || 0);
    return slots;
  }, [passengerCounts]);

  const [passengers, setPassengers] = useState(passengerSlots);
  const [contact, setContact] = useState({ email: user?.email || '', phone: user?.phone || '' });
  const [autoFillEnabled, setAutoFillEnabled] = useState(true);
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [quickLoginForm, setQuickLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated && autoFillEnabled && user) {
      setPassengers((current) => {
        if (!current.length) return current;
        const [first, ...rest] = current;
        return [
          {
            ...first,
            lastNameEn: first.lastNameEn || (user.lastNameEn || (user.name || '').split(' ').slice(-1)[0] || ''),
            firstNameEn: first.firstNameEn || (user.firstNameEn || (user.name || '').split(' ').slice(0, -1).join(' ') || ''),
            lastNameZh: first.lastNameZh || user.lastNameZh || '',
            firstNameZh: first.firstNameZh || user.firstNameZh || '',
            birthDate: first.birthDate || user.birthDate || '',
            passportNumber: first.passportNumber || user.passportNumber || '',
            passportExpiry: first.passportExpiry || user.passportExpiry || '',
            nationality: first.nationality || user.nationality || 'TW',
            gender: first.gender || user.gender || 'male',
          },
          ...rest,
        ];
      });
      setContact((c) => ({ email: c.email || user.email || '', phone: c.phone || user.phone || '' }));
    }
  }, [isAuthenticated, autoFillEnabled, user]);

  const handlePassengerChange = (i, next) => {
    setPassengers((current) => current.map((p, idx) => (idx === i ? next : p)));
  };

  const handleQuickLogin = (event) => {
    event.preventDefault();
    if (!quickLoginForm.email || !quickLoginForm.password) return;
    login(quickLoginForm.email);
    setShowQuickLogin(false);
  };

  const handleNext = () => {
    navigate('/add-ons', {
      state: {
        selectedFlights,
        tripType,
        passengerCounts,
        form,
        passengers,
        contact,
      },
    });
  };

  const handleBack = () => {
    navigate('/search');
  };

  if (!selectedFlights || !selectedFlights.outbound) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">尚未選擇航班</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark"
          >
            回首頁搜尋
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = (selectedFlights.outbound?.totalPrice || 0) + ((tripType === 'oneway' ? 0 : selectedFlights.return?.totalPrice) || 0);
  const route = { from: form.from, to: form.to };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="relative -mt-14 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-14 md:-mt-16 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,168,54,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary">Step 3 / 4</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">填寫旅客資料</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white"><Check className="inline h-3 w-3" /> 去程</span>
            {tripType !== 'oneway' && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white"><Check className="inline h-3 w-3" /> 回程</span>}
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-gray-900">3 旅客資料</span>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold text-white/70">4 加購</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        {/* Main column */}
        <div className="space-y-5">
          {/* Login / Guest banner */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            {isAuthenticated ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"><User className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user?.name || user?.email || '會員'}</p>
                    <p className="text-xs text-gray-500">已登入 · 可自動帶入會員資料</p>
                  </div>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={autoFillEnabled}
                    onChange={(e) => setAutoFillEnabled(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  自動帶入會員資料到旅客 1
                </label>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500"><User className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">訪客結帳</p>
                    <p className="text-xs text-gray-500">登入後可自動帶入會員資料、查看訂單紀錄</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickLogin((s) => !s)}
                    className="rounded-full border border-primary px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                  >
                    快速登入
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-700"
                  >
                    註冊
                  </button>
                </div>
              </div>
            )}

            {showQuickLogin && !isAuthenticated && (
              <form onSubmit={handleQuickLogin} className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  type="email"
                  required
                  placeholder="會員 Email"
                  value={quickLoginForm.email}
                  onChange={(e) => setQuickLoginForm((c) => ({ ...c, email: e.target.value }))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="password"
                  required
                  placeholder="密碼"
                  value={quickLoginForm.password}
                  onChange={(e) => setQuickLoginForm((c) => ({ ...c, password: e.target.value }))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button type="submit" className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-primary-dark">
                  登入
                </button>
              </form>
            )}
          </div>

          {/* Passenger forms */}
          {passengers.map((p, i) => (
            <PassengerForm
              key={i}
              index={i}
              passenger={p}
              onChange={(next) => handlePassengerChange(i, next)}
              savedTravelers={travelers}
              allowSavedPicker={isAuthenticated && i > 0}
              hint={i === 0 && isAuthenticated && autoFillEnabled ? '已自動帶入會員資料' : ''}
            />
          ))}

          {/* Contact */}
          <ContactForm contact={contact} onChange={setContact} />
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">行程摘要</h3>
              <button type="button" onClick={() => navigate('/search')} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                <Edit3 className="h-3.5 w-3.5" /> 編輯
              </button>
            </div>
            <FlightSummaryCard direction="outbound" selection={selectedFlights.outbound} route={route} />
            {tripType !== 'oneway' && selectedFlights.return && (
              <FlightSummaryCard direction="return" selection={selectedFlights.return} route={route} />
            )}
            <div className="rounded-xl bg-gray-900 p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-white/60">總計 ({(passengerCounts.adult + passengerCounts.child)} 位旅客)</span>
              </div>
              <p className="mt-1 text-2xl font-black">NT$ {totalPrice.toLocaleString()}</p>
              <p className="mt-1 text-[10px] text-white/60">機票含稅 · 加購項目尚未計入</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-0 z-30 mt-8 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500">{passengers.length} 位旅客 · 步驟 3 / 4</p>
            <p className="text-xl font-black text-gray-900"><span className="mr-1 text-xs font-bold">TWD</span>{totalPrice.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleBack} className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
              上一步
            </button>
            <button type="button" onClick={handleNext} className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark">
              下一步：加購
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerInfo;
