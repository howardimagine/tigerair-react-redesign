import { useState } from 'react';
import { Plane, CheckCircle, AlertCircle } from 'lucide-react';

const CheckIn = () => {
  const [step, setStep] = useState(1);
  const [ref, setRef] = useState('');
  const [name, setName] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [errors, setErrors] = useState({});

  const occupiedSeats = ['1A', '2C', '3B', '4D', '5F', '2E'];

  const handleSearch = (e) => {
    e.preventDefault();
    const errs = {};
    if (!ref.trim()) errs.ref = '請輸入訂位代號';
    if (!name.trim()) errs.name = '請輸入姓氏';
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };

  const handleConfirm = () => {
    if (!selectedSeat) {
      setErrors({ seat: '請選擇座位' });
      return;
    }
    setStep(3);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Online Check-in 線上報到</h1>

        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <div className="text-center mb-8">
              <Plane className="w-14 h-14 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold mb-2">開始線上報到</h2>
              <p className="text-gray-600 text-sm sm:text-base">請輸入您的訂位資訊，起飛前 48 小時至 1 小時可報到</p>
            </div>
            <form onSubmit={handleSearch} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">訂位代號 Booking Reference *</label>
                <input type="text" value={ref} onChange={e => setRef(e.target.value.toUpperCase())}
                  placeholder="例：TW8K3L9M2"
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.ref ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.ref && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.ref}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">旅客姓氏 Last Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value.toUpperCase())}
                  placeholder="例：CHEN"
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition">
                查詢航班 Search
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold mb-4">航班資訊 Flight Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between sm:block"><span className="text-gray-500">航班：</span><span className="font-medium">IT 210</span></div>
                <div className="flex justify-between sm:block"><span className="text-gray-500">日期：</span><span className="font-medium">2026-06-15</span></div>
                <div className="flex justify-between sm:block"><span className="text-gray-500">時間：</span><span className="font-medium">08:30 → 12:45</span></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-3">
                <div className="flex justify-between sm:block"><span className="text-gray-500">航線：</span><span className="font-medium">TPE → NRT</span></div>
                <div className="flex justify-between sm:block"><span className="text-gray-500">旅客：</span><span className="font-medium">{name || 'CHEN'}</span></div>
                <div className="flex justify-between sm:block"><span className="text-gray-500">訂位代號：</span><span className="font-medium">{ref || 'TW8K3L9M2'}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold mb-2">選擇座位 Select Seat</h2>
              <p className="text-sm text-gray-500 mb-4">請選擇您的座位</p>
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
                      if (!col) return <div key={ci} className="flex items-center justify-center text-xs text-gray-400 font-medium">{row+1}</div>;
                      const seat = `${row+1}${col}`;
                      const isOccupied = occupiedSeats.includes(seat);
                      const isSelected = selectedSeat === seat;
                      return (
                        <button key={ci} disabled={isOccupied}
                          onClick={() => { setSelectedSeat(isSelected ? null : seat); setErrors({}); }}
                          className={`p-2 sm:p-3 rounded text-xs font-medium transition ${isOccupied ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : isSelected ? 'bg-primary text-white' : 'border border-gray-200 hover:border-primary hover:text-primary'}`}>
                          {col}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              {selectedSeat && <p className="text-center mt-4 text-sm">已選座位：<span className="font-bold text-primary">{selectedSeat}</span></p>}
              {errors.seat && <p className="text-center mt-2 text-red-500 text-sm">{errors.seat}</p>}
            </div>

            <button onClick={handleConfirm} className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition">
              確認報到 Confirm Check-in
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Check-in Successful!</h2>
            <p className="text-gray-600 mb-6">報到成功！您的登機證已準備好</p>
            <div className="max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 text-left space-y-3 text-sm">
              <div className="text-center mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Boarding Pass</div>
                <div className="text-lg font-bold text-primary mt-1">IT 210</div>
              </div>
              <div className="flex justify-between"><span className="text-gray-600">旅客 Passenger：</span><span className="font-medium">{name || 'CHEN'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">航線 Route：</span><span className="font-medium">TPE → NRT</span></div>
              <div className="flex justify-between"><span className="text-gray-600">日期 Date：</span><span className="font-medium">2026-06-15</span></div>
              <div className="flex justify-between"><span className="text-gray-600">座位 Seat：</span><span className="font-medium text-primary text-lg">{selectedSeat}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">登機門 Gate：</span><span className="font-medium">D5</span></div>
              <div className="flex justify-between"><span className="text-gray-600">登機時間 Boarding：</span><span className="font-medium">08:00</span></div>
            </div>
            <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-medium">
              下載登機證 Download Boarding Pass
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
