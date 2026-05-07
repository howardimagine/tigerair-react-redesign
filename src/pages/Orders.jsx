import { Download, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();

  const orders = [
    { id: 'TW8K3L9M2', status: 'confirmed', route: 'TPE → NRT', date: '2026-06-15', time: '08:30', price: 'NT$ 7,599', flight: 'IT 210' },
    { id: 'TW5N7P2Q8', status: 'completed', route: 'TPE → ICN', date: '2026-04-10', time: '14:20', price: 'NT$ 5,499', flight: 'IT 302' },
    { id: 'TW3M8K1P5', status: 'cancelled', route: 'TPE → BKK', date: '2026-03-20', time: '09:15', price: 'NT$ 4,299', flight: 'IT 505' },
  ];

  const badge = (s) => {
    const styles = { confirmed: 'bg-green-100 text-green-800', completed: 'bg-gray-100 text-gray-800', cancelled: 'bg-red-100 text-red-800' };
    const labels = { confirmed: '已確認', completed: '已完成', cancelled: '已取消' };
    return <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${styles[s]}`}>{labels[s]}</span>;
  };

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 text-center py-20">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">請先登入</h2>
          <p className="text-gray-500 mb-6">登入後即可查看您的訂單</p>
          <Link to="/login" className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition">
            登入 Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">My Trips 我的訂單</h1>
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h3 className="font-bold text-sm sm:text-base">{o.id}</h3>
                    {badge(o.status)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">航班 {o.flight}</p>
                </div>
                {o.status === 'confirmed' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition shrink-0">
                    <Download size={16} />
                    <span className="hidden sm:inline">下載機票</span>
                    <span className="sm:hidden">下載</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t text-sm">
                <div><span className="text-gray-500 block text-xs">航線</span><span className="font-medium">{o.route}</span></div>
                <div><span className="text-gray-500 block text-xs">日期</span><span className="font-medium">{o.date}</span></div>
                <div><span className="text-gray-500 block text-xs">時間</span><span className="font-medium">{o.time}</span></div>
                <div><span className="text-gray-500 block text-xs">金額</span><span className="font-medium text-primary">{o.price}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
