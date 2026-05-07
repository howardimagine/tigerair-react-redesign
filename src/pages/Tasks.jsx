import { Target, Gift, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Tasks = () => {
  const { user } = useAuth();

  const tasks = [
    { id: 1, title: '首次訂票 First Booking', desc: '完成您的第一次訂票', reward: 500, progress: 100, done: true },
    { id: 2, title: '完成 3 次飛行 3 Flights', desc: '累積完成 3 次航班', reward: 1000, progress: 66, done: false, cur: 2, max: 3 },
    { id: 3, title: '推薦好友 Refer Friend', desc: '邀請好友註冊並完成首次訂票', reward: 800, progress: 0, done: false, cur: 0, max: 1 },
    { id: 4, title: '填寫個人資料 Complete Profile', desc: '完善您的會員資料', reward: 200, progress: 50, done: false, cur: 3, max: 6 },
  ];

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 text-center py-20">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">請先登入</h2>
          <p className="text-gray-500 mb-6">登入後即可查看會員任務</p>
          <Link to="/login" className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition">
            登入 Login
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.done).length;
  const earnedPoints = tasks.filter(t => t.done).reduce((sum, t) => sum + t.reward, 0);
  const availablePoints = tasks.filter(t => !t.done).reduce((sum, t) => sum + t.reward, 0);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Member Tasks 會員任務</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 sm:p-6 text-white">
            <Target className="mb-2" size={24} />
            <div className="text-2xl sm:text-3xl font-bold">{earnedPoints.toLocaleString()}</div>
            <div className="text-orange-100 text-sm">已獲得里程 Earned</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 sm:p-6 text-white">
            <Gift className="mb-2" size={24} />
            <div className="text-2xl sm:text-3xl font-bold">{availablePoints.toLocaleString()}</div>
            <div className="text-blue-100 text-sm">可獲得里程 Available</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 sm:p-6 text-white">
            <CheckCircle className="mb-2" size={24} />
            <div className="text-2xl sm:text-3xl font-bold">{completedCount}/{tasks.length}</div>
            <div className="text-green-100 text-sm">已完成任務 Completed</div>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map(t => (
            <div key={t.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm sm:text-base">{t.title}</h3>
                    {t.done ? (
                      <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                        <CheckCircle size={12} /> 已完成
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                        <Clock size={12} /> 進行中
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{t.desc}</p>
                </div>
                <span className="text-primary font-bold text-sm sm:text-base ml-2 shrink-0">+{t.reward}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${t.done ? 'bg-green-500' : 'bg-primary'}`} style={{width: `${t.progress}%`}}></div>
              </div>
              {t.cur !== undefined && <div className="text-xs text-gray-500 mt-1">{t.cur} / {t.max}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
