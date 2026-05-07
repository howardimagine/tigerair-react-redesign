import { useState } from 'react';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

const Schedule = () => {
  const [selectedRoute, setSelectedRoute] = useState('TPE-NRT');
  const [selectedDate, setSelectedDate] = useState('2026-05-15');

  const routes = [
    { code: 'TPE-NRT', from: '台北 (TPE)', to: '東京成田 (NRT)', duration: '3h 10m' },
    { code: 'TPE-KIX', from: '台北 (TPE)', to: '大阪關西 (KIX)', duration: '2h 50m' },
    { code: 'TPE-ICN', from: '台北 (TPE)', to: '首爾仁川 (ICN)', duration: '2h 30m' },
    { code: 'TPE-BKK', from: '台北 (TPE)', to: '曼谷 (BKK)', duration: '2h 40m' },
    { code: 'TPE-SIN', from: '台北 (TPE)', to: '新加坡 (SIN)', duration: '3h 50m' },
    { code: 'TPE-MFM', from: '台北 (TPE)', to: '澳門 (MFM)', duration: '1h 20m' },
    { code: 'KHH-NRT', from: '高雄 (KHH)', to: '東京成田 (NRT)', duration: '3h 50m' },
    { code: 'KHH-BKK', from: '高雄 (KHH)', to: '曼谷 (BKK)', duration: '3h 20m' },
  ];

  const schedules = {
    'TPE-NRT': [
      { flight: 'IT601', depart: '08:45', arrive: '13:20', aircraft: 'A320', status: '定期班' },
      { flight: 'IT603', depart: '14:30', arrive: '19:05', aircraft: 'A320', status: '定期班' },
      { flight: 'IT605', depart: '20:00', arrive: '00:35+1', aircraft: 'A321', status: '定期班' },
    ],
    'TPE-KIX': [
      { flight: 'IT621', depart: '07:00', arrive: '10:50', aircraft: 'A320', status: '定期班' },
      { flight: 'IT623', depart: '12:15', arrive: '16:05', aircraft: 'A320', status: '定期班' },
      { flight: 'IT625', depart: '18:45', arrive: '22:35', aircraft: 'A321', status: '定期班' },
    ],
    'TPE-ICN': [
      { flight: 'IT641', depart: '06:30', arrive: '08:35', aircraft: 'A320', status: '定期班' },
      { flight: 'IT643', depart: '13:00', arrive: '15:05', aircraft: 'A320', status: '定期班' },
      { flight: 'IT645', depart: '19:30', arrive: '21:35', aircraft: 'A321', status: '定期班' },
    ],
    'TPE-BKK': [
      { flight: 'IT661', depart: '07:15', arrive: '10:30', aircraft: 'A320', status: '定期班' },
      { flight: 'IT663', depart: '14:00', arrive: '17:15', aircraft: 'A320', status: '定期班' },
    ],
    'TPE-SIN': [
      { flight: 'IT681', depart: '08:00', arrive: '12:40', aircraft: 'A321', status: '定期班' },
      { flight: 'IT683', depart: '16:30', arrive: '21:10', aircraft: 'A321', status: '定期班' },
    ],
    'TPE-MFM': [
      { flight: 'IT701', depart: '07:30', arrive: '08:45', aircraft: 'A320', status: '定期班' },
      { flight: 'IT703', depart: '09:30', arrive: '10:45', aircraft: 'A320', status: '定期班' },
      { flight: 'IT705', depart: '12:00', arrive: '13:15', aircraft: 'A320', status: '定期班' },
      { flight: 'IT707', depart: '15:00', arrive: '16:15', aircraft: 'A320', status: '定期班' },
      { flight: 'IT709', depart: '18:00', arrive: '19:15', aircraft: 'A320', status: '定期班' },
    ],
    'KHH-NRT': [
      { flight: 'IT811', depart: '10:00', arrive: '14:30', aircraft: 'A321', status: '定期班' },
      { flight: 'IT813', depart: '19:00', arrive: '23:30', aircraft: 'A321', status: '定期班' },
    ],
    'KHH-BKK': [
      { flight: 'IT831', depart: '08:30', arrive: '11:40', aircraft: 'A320', status: '定期班' },
      { flight: 'IT833', depart: '15:00', arrive: '18:10', aircraft: 'A320', status: '定期班' },
    ],
  };

  const selectedRouteData = routes.find(r => r.code === selectedRoute);
  const selectedSchedules = schedules[selectedRoute] || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">航班時刻表</h1>
          <p className="text-gray-600">查詢虎航最新航班時刻表</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Route Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-4">航線選擇</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {routes.map((route) => (
                  <button
                    key={route.code}
                    onClick={() => setSelectedRoute(route.code)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedRoute === route.code
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm">{route.code}</div>
                    <div className="text-xs mt-1">{route.from}</div>
                    <div className="text-xs">→ {route.to}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Route Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedRouteData?.from}</h2>
                  <div className="flex items-center text-gray-600 text-sm">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    飛行時間: {selectedRouteData?.duration}
                  </div>
                </div>
                <div className="text-right">
                  <PaperAirplaneIcon className="h-12 w-12 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">→</div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedRouteData?.to}</h2>
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <CalendarDaysIcon className="h-4 w-4 inline mr-2" />
                選擇日期
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-2">提示: 時刻表每日變動，請確認您的旅行日期</p>
            </div>

            {/* Schedule Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold">
                  {selectedDate} 的班次
                </h3>
              </div>
              {selectedSchedules.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">航班</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">出發</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">抵達</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">機型</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">狀態</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSchedules.map((schedule, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-orange-50 transition">
                          <td className="px-6 py-4">
                            <span className="font-bold text-primary">{schedule.flight}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{schedule.depart}</div>
                            <div className="text-xs text-gray-500">{selectedRouteData?.from}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{schedule.arrive}</div>
                            <div className="text-xs text-gray-500">{selectedRouteData?.to}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{schedule.aircraft}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {schedule.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-primary font-medium text-sm hover:underline">
                              查詢票價
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <PaperAirplaneIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>查無此航線的班次資料</p>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2">ℹ️ 提示</h4>
                <p className="text-sm text-blue-800">時刻表資訊每日更新，實際班次時間可能會有變動，請於購票前再次確認。</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-semibold text-green-900 mb-2">✈️ 立即訂票</h4>
                <p className="text-sm text-green-800">點擊「查詢票價」即可查看票價並進行訂票。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
