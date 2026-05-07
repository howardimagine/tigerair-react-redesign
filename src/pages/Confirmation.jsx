import { CheckCircle, Download, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const navigate = useNavigate();
  const ref = 'TW8K3L9M2X';

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
          <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-4">訂位成功！電子機票已發送至您的信箱</p>
          <div className="text-xl sm:text-2xl font-bold text-primary mb-6 sm:mb-8">訂位代號 {ref}</div>

          <div className="border-t border-b py-4 sm:py-6 mb-6 text-left space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">航班 Flight：</span><span className="font-medium">IT 210</span></div>
            <div className="flex justify-between"><span className="text-gray-600">航線 Route：</span><span className="font-medium">TPE → NRT</span></div>
            <div className="flex justify-between"><span className="text-gray-600">日期 Date：</span><span className="font-medium">2026-06-15</span></div>
            <div className="flex justify-between"><span className="text-gray-600">時間 Time：</span><span className="font-medium">08:30</span></div>
            <div className="flex justify-between"><span className="text-gray-600">旅客 Passenger：</span><span className="font-medium">CHEN MING WEI</span></div>
            <div className="flex justify-between"><span className="text-gray-600">座位 Seat：</span><span className="font-medium">12A</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-medium">
              <Download size={18} />
              下載機票 Download
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
              <Mail size={18} />
              重新發送 Resend
            </button>
          </div>

          <button onClick={() => navigate('/')} className="text-primary hover:underline text-sm">
            返回首頁 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
