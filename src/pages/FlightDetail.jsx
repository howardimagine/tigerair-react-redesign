import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plane, Briefcase, Coffee, Armchair, ArrowLeft } from 'lucide-react';

const FlightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addons, setAddons] = useState({ baggage: false, meal: false, seat: false });

  const flightData = {
    'IT210': { depart: '08:30', arrive: '12:45', price: 5999 },
    'IT212': { depart: '11:20', arrive: '15:35', price: 6499 },
    'IT214': { depart: '14:50', arrive: '19:05', price: 5499 },
    'IT216': { depart: '18:30', arrive: '22:45', price: 4999 },
    'IT218': { depart: '21:00', arrive: '01:15+1', price: 4499 },
  };

  const flight = flightData[id] || flightData['IT210'];
  const tax = 800;
  const baggagePrice = addons.baggage ? 800 : 0;
  const mealPrice = addons.meal ? 200 : 0;
  const seatPrice = addons.seat ? 300 : 0;
  const total = flight.price + tax + baggagePrice + mealPrice + seatPrice;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary mb-4 transition">
          <ArrowLeft size={16} /> 返回搜尋結果
        </button>

        {/* Flight Info */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold">航班 {id || 'IT210'}</h1>
            <span className="text-sm text-gray-500 ml-2">直飛 Direct</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">{flight.depart}</div>
              <div className="text-gray-500 text-sm">TPE 台北桃園</div>
            </div>
            <div className="flex-1 mx-4 sm:mx-8 text-center">
              <div className="text-xs text-gray-400 mb-2">3h 15m</div>
              <div className="relative">
                <div className="h-px bg-gray-200 w-full"></div>
                <Plane className="h-4 w-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">{flight.arrive}</div>
              <div className="text-gray-500 text-sm">NRT 東京成田</div>
            </div>
          </div>
          <div className="border-t pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500 block text-xs">航班</span><span className="font-medium">{id || 'IT210'}</span></div>
            <div><span className="text-gray-500 block text-xs">機型</span><span className="font-medium">Airbus A320</span></div>
            <div><span className="text-gray-500 block text-xs">日期</span><span className="font-medium">2026-06-15</span></div>
            <div><span className="text-gray-500 block text-xs">艙等</span><span className="font-medium">Economy 經濟艙</span></div>
          </div>
        </div>

        {/* Add-ons */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 mb-6">
          <h2 className="font-bold mb-4">Add-ons 加購服務</h2>
          <div className="space-y-3">
            <label className={`flex items-center justify-between p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${addons.baggage ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={addons.baggage} onChange={e => setAddons({...addons, baggage: e.target.checked})} className="w-4 h-4 accent-primary" />
                <Briefcase className="h-5 w-5 text-primary hidden sm:block" />
                <div>
                  <div className="font-medium text-sm sm:text-base">托運行李 20kg</div>
                  <div className="text-xs text-gray-500">Checked Baggage</div>
                </div>
              </div>
              <div className="text-primary font-bold text-sm sm:text-base">+NT$ 800</div>
            </label>
            <label className={`flex items-center justify-between p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${addons.meal ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={addons.meal} onChange={e => setAddons({...addons, meal: e.target.checked})} className="w-4 h-4 accent-primary" />
                <Coffee className="h-5 w-5 text-primary hidden sm:block" />
                <div>
                  <div className="font-medium text-sm sm:text-base">機上餐食</div>
                  <div className="text-xs text-gray-500">In-flight Meal Set</div>
                </div>
              </div>
              <div className="text-primary font-bold text-sm sm:text-base">+NT$ 200</div>
            </label>
            <label className={`flex items-center justify-between p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${addons.seat ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={addons.seat} onChange={e => setAddons({...addons, seat: e.target.checked})} className="w-4 h-4 accent-primary" />
                <Armchair className="h-5 w-5 text-primary hidden sm:block" />
                <div>
                  <div className="font-medium text-sm sm:text-base">預選座位</div>
                  <div className="text-xs text-gray-500">Seat Selection</div>
                </div>
              </div>
              <div className="text-primary font-bold text-sm sm:text-base">+NT$ 300</div>
            </label>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
          <h2 className="font-bold mb-4">費用明細 Price Breakdown</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">票價 Fare</span>
              <span className="font-medium">NT$ {flight.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">稅金 Taxes & Fees</span>
              <span className="font-medium">NT$ {tax.toLocaleString()}</span>
            </div>
            {addons.baggage && <div className="flex justify-between items-center"><span className="text-gray-600">托運行李 20kg</span><span className="font-medium">NT$ 800</span></div>}
            {addons.meal && <div className="flex justify-between items-center"><span className="text-gray-600">機上餐食</span><span className="font-medium">NT$ 200</span></div>}
            {addons.seat && <div className="flex justify-between items-center"><span className="text-gray-600">預選座位</span><span className="font-medium">NT$ 300</span></div>}
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-bold">總計 Total</span>
              <span className="text-2xl font-bold text-primary">NT$ {total.toLocaleString()}</span>
            </div>
          </div>
          <button onClick={() => navigate('/booking')} className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition">
            繼續訂位 Continue to Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;
