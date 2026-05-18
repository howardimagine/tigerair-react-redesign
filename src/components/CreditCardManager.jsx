import { useState } from 'react';
import { CreditCard, Plus, Trash2, ShieldCheck, Check, Lock, Sparkles } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useCreditCards, detectBrand, formatCardNumber, maskCardNumber } from '../context/CreditCardsContext';

const brandColors = {
  visa: 'from-blue-600 to-blue-900',
  mastercard: 'from-orange-500 to-red-600',
  amex: 'from-emerald-600 to-teal-800',
  jcb: 'from-emerald-500 to-blue-700',
  unionpay: 'from-red-500 to-red-700',
  unknown: 'from-gray-700 to-gray-900',
};

const brandLabel = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'AMEX',
  jcb: 'JCB',
  unionpay: '銀聯',
  unknown: '信用卡',
};

const CardArt = ({ card, masked = true, holderName, expiry }) => {
  const brand = card?.brand || detectBrand(card?.number);
  const color = brandColors[brand];
  const number = card?.number ? (masked ? maskCardNumber(card.number) : formatCardNumber(card.number)) : `•••• •••• •••• ${card?.last4 || '0000'}`;
  return (
    <div className={`relative h-44 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Tigerair</p>
          <p className="text-xs font-bold uppercase tracking-wide opacity-90">{brandLabel[brand]}</p>
        </div>
        <div className="h-9 w-12 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner" />
      </div>
      <p className="relative mt-8 font-mono text-xl font-bold tracking-[0.18em]">{number}</p>
      <div className="relative mt-4 flex items-end justify-between text-xs">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Cardholder</p>
          <p className="mt-0.5 font-bold tracking-wide">{(holderName || card?.holderName || 'YOUR NAME').toUpperCase()}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Expires</p>
          <p className="mt-0.5 font-bold tracking-wide">{expiry || card?.expiry || 'MM/YY'}</p>
        </div>
      </div>
    </div>
  );
};

const AddCardModal = ({ open, onClose, onSubmit }) => {
  const [number, setNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nickname, setNickname] = useState('');
  const [setDefault, setSetDefault] = useState(true);
  const [stage, setStage] = useState('form'); // form | otp | verifying | done
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const cleanedNumber = number.replace(/\D/g, '');
  const previewCard = { number, holderName, expiry };

  const validate = () => {
    const e = {};
    if (cleanedNumber.length < 13) e.number = '卡號需 13 碼以上';
    if (!holderName.trim()) e.holderName = '請輸入持卡人姓名';
    if (!/^\d{2}\/\d{2}$/.test(expiry)) e.expiry = '格式為 MM/YY';
    if (!/^\d{3,4}$/.test(cvv)) e.cvv = 'CVV 3-4 碼';
    return e;
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStage('otp');
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();
    if (otp.length < 4) {
      setErrors({ otp: '請輸入 6 位驗證碼' });
      return;
    }
    setStage('verifying');
    setTimeout(() => {
      onSubmit({ number: cleanedNumber, holderName: holderName.trim().toUpperCase(), expiry, nickname, isDefault: setDefault });
      setStage('done');
      setTimeout(() => {
        // reset & close
        setNumber(''); setHolderName(''); setExpiry(''); setCvv(''); setNickname(''); setSetDefault(true); setOtp(''); setStage('form');
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Add Card</p>
            <h2 className="mt-0.5 text-xl font-bold text-gray-900">綁定新信用卡</h2>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-gray-500">
              <Lock className="h-3 w-3 text-emerald-600" /> 卡片資料以 PCI-DSS 標準加密儲存
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100" aria-label="關閉">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Card preview */}
        <div className="mb-5 flex justify-center">
          <CardArt card={previewCard} masked={false} holderName={holderName} expiry={expiry} />
        </div>

        {stage === 'form' && (
          <form onSubmit={handleSubmitForm} className="space-y-3">
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">卡號 *</span>
              <input
                type="text"
                inputMode="numeric"
                value={number}
                onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.number ? 'border-rose-400' : 'border-gray-200 focus:border-primary'}`}
              />
              {errors.number && <p className="mt-1 text-xs text-rose-600">{errors.number}</p>}
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">持卡人姓名 *</span>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="CHEN MING-WEI"
                className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.holderName ? 'border-rose-400' : 'border-gray-200 focus:border-primary'}`}
              />
              {errors.holderName && <p className="mt-1 text-xs text-rose-600">{errors.holderName}</p>}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold text-gray-600">有效期 MM/YY *</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                    setExpiry(v);
                  }}
                  placeholder="12/28"
                  className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.expiry ? 'border-rose-400' : 'border-gray-200 focus:border-primary'}`}
                />
                {errors.expiry && <p className="mt-1 text-xs text-rose-600">{errors.expiry}</p>}
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-gray-600">CVV *</span>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••"
                  className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.cvv ? 'border-rose-400' : 'border-gray-200 focus:border-primary'}`}
                />
                {errors.cvv && <p className="mt-1 text-xs text-rose-600">{errors.cvv}</p>}
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">暱稱 (選填)</span>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例如：日常用、出國卡"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700">
              <input type="checkbox" checked={setDefault} onChange={(e) => setSetDefault(e.target.checked)} className="h-4 w-4 accent-primary" />
              設為預設付款方式
            </label>
            <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
              <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary">
                取消
              </button>
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark">
                <ShieldCheck className="h-4 w-4" /> 進行 3D 驗證
              </button>
            </div>
          </form>
        )}

        {stage === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-800">📱 3D Secure 驗證</p>
              <p className="mt-1 text-xs text-emerald-700/80">
                驗證碼已發送至發卡銀行登錄的手機號碼 (尾號 ****1234)，請輸入 6 位數字
              </p>
              <p className="mt-2 text-[10px] text-emerald-700/60">提示：demo 直接點下方按鈕即可</p>
            </div>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">驗證碼</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className={`mt-1 w-full rounded-lg border px-3 py-3 text-center text-lg font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.otp ? 'border-rose-400' : 'border-gray-200 focus:border-primary'}`}
              />
              {errors.otp && <p className="mt-1 text-xs text-rose-600">{errors.otp}</p>}
            </label>
            <div className="flex justify-between gap-2 border-t border-gray-100 pt-4">
              <button type="button" onClick={() => setStage('form')} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary">
                返回修改
              </button>
              <button type="submit" onClick={() => !otp && setOtp('123456')} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark">
                確認綁定
              </button>
            </div>
          </form>
        )}

        {stage === 'verifying' && (
          <div className="py-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm font-bold text-gray-800">3D Secure 驗證中…</p>
            <p className="mt-1 text-xs text-gray-500">正在與發卡銀行確認，請稍候</p>
          </div>
        )}

        {stage === 'done' && (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="h-7 w-7" />
            </div>
            <p className="mt-4 text-base font-bold text-emerald-700">綁定成功！</p>
            <p className="mt-1 text-xs text-gray-500">下次訂票會自動帶入此張卡片</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CreditCardManager = () => {
  const { cards, addCard, removeCard, setDefaultCard } = useCreditCards();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold text-gray-900">付款方式</h3>
            <p className="mt-0.5 text-xs text-gray-500">綁定信用卡，訂票結帳一鍵搞定 · 通過 3D 驗證安全保護</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> 新增信用卡
        </button>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {cards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <CreditCard className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-bold text-gray-700">尚未綁定任何信用卡</p>
            <p className="mt-1 text-xs text-gray-500">綁定後可一鍵付款、自動領取會員里程</p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4" /> 立即綁定
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((c) => (
              <div key={c.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <CardArt card={c} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{c.nickname || `${c.brand?.toUpperCase()} 信用卡`}</p>
                      <p className="text-xs text-gray-500">{c.holderName} · 到期 {c.expiry}</p>
                    </div>
                    {c.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <Sparkles className="h-3 w-3" /> 預設
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!c.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultCard(c.id)}
                        className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
                      >
                        設為預設
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeCard(c.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-[11px] font-semibold text-gray-500 transition hover:border-rose-300 hover:text-rose-600"
                    >
                      <Trash2 className="h-3 w-3" /> 移除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddCardModal open={open} onClose={() => setOpen(false)} onSubmit={(card) => addCard(card)} />
    </div>
  );
};

export default CreditCardManager;
