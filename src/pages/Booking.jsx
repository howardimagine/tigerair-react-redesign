import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, AlertCircle } from 'lucide-react';

const Booking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [passenger, setPassenger] = useState({ firstName: '', lastName: '', email: '', phone: '', passport: '' });
  const [errors, setErrors] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [addons, setAddons] = useState({ baggage: false, meal: false });
  const [payment, setPayment] = useState({ card: '', name: '', expiry: '', cvv: '' });

  const occupiedSeats = ['2B', '3D', '4A', '5F', '1C'];

  const steps = [
    { num: 1, title: '旅客資料' },
    { num: 2, title: '座位選擇' },
    { num: 3, title: '加購服務' },
    { num: 4, title: '付款' }
  ];

  const validateStep1 = () => {
    const errs = {};
    if (!passenger.firstName.trim()) errs.firstName = '請輸入名字';
    if (!passenger.lastName.trim()) errs.lastName = '請輸入姓氏';
    if (!passenger.email.trim()) errs.email = '請輸入 Email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) errs.email = 'Email 格式不正確';
    if (!passenger.phone.trim()) errs.phone = '請輸入手機號碼';
    if (!passenger.passport.trim()) errs.passport = '請輸入護照號碼';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs = {};
    if (!payment.card.trim()) errs.card = '請輸入卡號';
    else if (payment.card.replace(/\s/g, '').length < 16) errs.card = '卡號格式不正確';
    if (!payment.name.trim()) errs.name = '請輸入持卡人姓名';
    if (!payment.expiry.trim()) errs.expiry = '請輸入有效期限';
    if (!payment.cvv.trim()) errs.cvv = '請輸入 CVV';
    else if (payment.cvv.length < 3) errs.cvv = 'CVV 格式不正確';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 4) {
      if (!validateStep4()) return;
      navigate('/confirmation');
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const basePrice = 5999;
  const tax = 800;
  const baggagePrice = addons.baggage ? 800 : 0;
  const mealPrice = addons.meal ? 200 : 0;
  const total = basePrice + tax + baggagePrice + mealPrice;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Steps */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors ${step >= s.num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step > s.num ? <Check size={16} /> : s.num}
                  </div>
                  <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-center text-gray-600">{s.title}</span>
                </div>
                {idx < steps.length - 1 && <ChevronRight className="text-gray-300 mx-0.5 sm:mx-1 shrink-0" size={16} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">旅客資料 Passenger Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">名字 First Name *</label>
                    <input type="text" value={passenger.firstName} onChange={e => setPassenger({...passenger, firstName: e.target.value})}
                      placeholder="MING WEI" className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.firstName ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓氏 Last Name *</label>
                    <input type="text" value={passenger.lastName} onChange={e => setPassenger({...passenger, lastName: e.target.value})}
                      placeholder="CHEN" className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.lastName ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.lastName}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={passenger.email} onChange={e => setPassenger({...passenger, email: e.target.value})}
                      placeholder="your@email.com" className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">手機 Phone *</label>
                    <input type="tel" value={passenger.phone} onChange={e => setPassenger({...passenger, phone: e.target.value})}
                      placeholder="0912-345-678" className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">護照號碼 Passport *</label>
                    <input type="text" value={passenger.passport} onChange={e => setPassenger({...passenger, passport: e.target.value.toUpperCase()})}
                      placeholder="A123456789" className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.passport ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.passport && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.passport}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-2">選擇座位 Select Seat</h2>
                <p className="text-sm text-gray-500 mb-4">選擇您偏好的座位（選填）</p>
                <div className="flex justify-center gap-4 mb-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-4 h-4 bg-primary rounded"></span>已選</span>
                  <span className="flex items-center gap-1"><span className="w-4 h-4 bg-gray-300 rounded"></span>已佔</span>
                  <span className="flex items-center gap-1"><span className="w-4 h-4 border border-gray-200 rounded"></span>可選</span>
                </div>
                <div className="max-w-sm mx-auto">
                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                    <span>A</span><span>B</span><span>C</span><span></span><span>D</span><span>E</span><span>F</span>
                  </div>
                  {Array.from({length: 5}, (_, row) => (
                    <div key={row} className="grid grid-cols-7 gap-1 mb-1">
                      {['A','B','C','','D','E','F'].map((col, ci) => {
                        if (!col) return <div key={ci} className="flex items-center justify-center text-xs text-gray-400">{row+1}</div>;
                        const seat = `${row+1}${col}`;
                        const isOccupied = occupiedSeats.includes(seat);
                        const isSelected = selectedSeat === seat;
                        return (
                          <button key={ci} disabled={isOccupied}
                            onClick={() => setSelectedSeat(isSelected ? null : seat)}
                            className={`p-2 sm:p-3 rounded text-xs font-medium transition ${isOccupied ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : isSelected ? 'bg-primary text-white' : 'border border-gray-200 hover:border-primary hover:text-primary'}`}>
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                {selectedSeat && <p className="text-center mt-4 text-sm">已選座位：<span className="font-bold text-primary">{selectedSeat}</span></p>}
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-2">加購服務 Add-ons</h2>
                <p className="text-sm text-gray-500 mb-4">選擇您需要的額外服務</p>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${addons.baggage ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={addons.baggage} onChange={e => setAddons({...addons, baggage: e.target.checked})} className="w-4 h-4 accent-primary" />
                      <div>
                        <div className="font-medium">托運行李 20kg</div>
                        <div className="text-xs text-gray-500">Checked Baggage</div>
                      </div>
                    </div>
                    <span className="text-primary font-bold">+NT$ 800</span>
                  </label>
                  <label className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${addons.meal ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={addons.meal} onChange={e => setAddons({...addons, meal: e.target.checked})} className="w-4 h-4 accent-primary" />
                      <div>
                        <div className="font-medium">機上餐食 Meal</div>
                        <div className="text-xs text-gray-500">In-flight Meal Set</div>
                      </div>
                    </div>
                    <span className="text-primary font-bold">+NT$ 200</span>
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-4">付款資訊 Payment</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">信用卡號 Card Number *</label>
                    <input type="text" value={payment.card} onChange={e => setPayment({...payment, card: formatCard(e.target.value)})}
                      placeholder="4242 4242 4242 4242" maxLength={19}
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.card ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.card && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.card}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">持卡人姓名 Cardholder *</label>
                    <input type="text" value={payment.name} onChange={e => setPayment({...payment, name: e.target.value.toUpperCase()})}
                      placeholder="CHEN MING WEI"
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">有效期限 *</label>
                      <input type="text" value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})}
                        placeholder="MM/YY" maxLength={5}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.expiry ? 'border-red-400' : 'border-gray-200'}`} />
                      {errors.expiry && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                      <input type="text" value={payment.cvv} onChange={e => setPayment({...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                        placeholder="123" maxLength={4}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.cvv ? 'border-red-400' : 'border-gray-200'}`} />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button onClick={() => { setErrors({}); setStep(step - 1); }} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  上一步 Back
                </button>
              )}
              <button onClick={handleNext} className="ml-auto px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium">
                {step === 4 ? '確認付款 Pay' : '下一步 Next'}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
            <h3 className="font-bold mb-4">訂單摘要 Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">航班</span><span className="font-medium">IT 210</span></div>
              <div className="flex justify-between"><span className="text-gray-600">航線</span><span className="font-medium">TPE → NRT</span></div>
              <div className="flex justify-between"><span className="text-gray-600">日期</span><span className="font-medium">2026-06-15</span></div>
              {selectedSeat && <div className="flex justify-between"><span className="text-gray-600">座位</span><span className="font-medium text-primary">{selectedSeat}</span></div>}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">票價</span><span>NT$ {basePrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">稅金</span><span>NT$ {tax.toLocaleString()}</span></div>
                {addons.baggage && <div className="flex justify-between"><span className="text-gray-600">行李 20kg</span><span>NT$ 800</span></div>}
                {addons.meal && <div className="flex justify-between"><span className="text-gray-600">機上餐食</span><span>NT$ 200</span></div>}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>總計</span>
                <span className="text-primary">NT$ {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
