import { User, Award, CreditCard, LogOut, Plane, Target, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Member = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 text-center py-20">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">請先登入</h2>
          <p className="text-gray-500 mb-6">登入後即可查看會員中心</p>
          <Link to="/login" className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition">
            登入 Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Member Center 會員中心</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {user.name?.charAt(0) || 'U'}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                ⭐ Gold 會員
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={() => navigate('/orders')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition">
                <Plane size={18} className="text-primary" /> 我的訂單
              </button>
              <button onClick={() => navigate('/tasks')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition">
                <Target size={18} className="text-primary" /> 會員任務
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition">
                <Settings size={18} className="text-primary" /> 帳號設定
              </button>
              <div className="border-t pt-2 mt-2">
                <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 text-sm text-red-600 transition">
                  <LogOut size={18} /> 登出 Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 sm:p-6 text-white">
                <Award className="mb-2" size={24} />
                <div className="text-2xl sm:text-3xl font-bold mb-1">12,500</div>
                <div className="text-orange-100 text-sm">累積里程 Total Points</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 sm:p-6 text-white">
                <CreditCard className="mb-2" size={24} />
                <div className="text-2xl sm:text-3xl font-bold mb-1">3</div>
                <div className="text-blue-100 text-sm">優惠券 Vouchers</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold mb-4">近期活動 Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Plane size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">TPE → NRT 訂票成功</div>
                    <div className="text-xs text-gray-500">2026-05-01</div>
                  </div>
                  <span className="text-sm font-medium text-primary shrink-0">+500 里程</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">完成「首次訂票」任務</div>
                    <div className="text-xs text-gray-500">2026-05-01</div>
                  </div>
                  <span className="text-sm font-medium text-primary shrink-0">+500 里程</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">帳號建立成功</div>
                    <div className="text-xs text-gray-500">2026-04-28</div>
                  </div>
                  <span className="text-sm font-medium text-gray-400 shrink-0">Welcome!</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold mb-4">Quick Actions 快速功能</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <button onClick={() => navigate('/search')} className="p-4 border rounded-lg hover:bg-gray-50 hover:border-primary text-center transition">
                  <div className="text-2xl mb-2">✈️</div>
                  <div className="text-xs sm:text-sm font-medium">訂票</div>
                </button>
                <button onClick={() => navigate('/checkin')} className="p-4 border rounded-lg hover:bg-gray-50 hover:border-primary text-center transition">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="text-xs sm:text-sm font-medium">線上報到</div>
                </button>
                <button onClick={() => navigate('/orders')} className="p-4 border rounded-lg hover:bg-gray-50 hover:border-primary text-center transition">
                  <div className="text-2xl mb-2">🎫</div>
                  <div className="text-xs sm:text-sm font-medium">我的訂單</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Member;
