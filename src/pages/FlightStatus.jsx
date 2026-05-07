import { useState } from 'react';
import { PaperAirplaneIcon, CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/solid';

const FlightStatus = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [searchType, setSearchType] = useState('flight');

  const mockFlights = [
    {
      flight: 'IT601',
      route: 'TPE → NRT',
      departure: '08:45',
      departureDate: '2026-05-10',
      arrival: '13:20',
      status: 'ONTIME',
      statusText: '準時起飛',
      gate: 'A15',
      terminal: '1',
      aircraft: 'A320',
    },
    {
      flight: 'IT603',
      route: 'TPE → NRT',
      departure: '14:30',
      departureDate: '2026-05-11',
      arrival: '19:05',
      status: 'DELAYED',
      statusText: '延誤',
      delay: '30分鐘',
      gate: 'C23',
      terminal: '2',
      aircraft: 'A321',
    },
    {
      flight: 'IT621',
      route: 'TPE → KIX',
      departure: '07:00',
      departureDate: '2026-05-12',
      arrival: '10:50',
      status: 'ONTIME',
      statusText: '準時起飛',
      gate: 'B12',
      terminal: '1',
      aircraft: 'A320',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONTIME':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'DELAYED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'BOARDING':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'DEPARTED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <PaperAirplaneIcon className="h-8 w-8 text-primary" />
            航班動態
          </h1>
          <p className="text-gray-600">查詢您的航班即時狀態</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="flight"
                    checked={searchType === 'flight'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">按航班號碼</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="booking"
                    checked={searchType === 'booking'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">按訂位代號</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {searchType === 'flight' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">航班號碼</label>
                    <input
                      type="text"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                      placeholder="例: IT601"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">出發日期</label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition"
                    >
                      查詢
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">訂位代號</label>
                    <input
                      type="text"
                      value={bookingRef}
                      onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                      placeholder="例: ABC123"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition"
                  >
                    查詢
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Flight Status Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">近期航班</h2>
          {mockFlights.map((flight, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Flight Info */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-4 mb-2">
                      <h3 className="text-2xl font-bold text-primary">{flight.flight}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(flight.status)}`}>
                        {flight.statusText}
                        {flight.delay && ` (${flight.delay})`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="font-medium">{flight.route}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between md:justify-start md:gap-8">
                      {/* Departure */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{flight.departure}</div>
                        <div className="text-xs text-gray-500 mb-1">出發</div>
                        <div className="text-xs font-medium text-gray-600">
                          {flight.departureDate}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          第 {flight.terminal} 航廈 | 登機口 {flight.gate}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:flex items-center">
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-primary to-orange-300 mx-4"></div>
                        <PaperAirplaneIcon className="h-5 w-5 text-primary rotate-90" />
                      </div>

                      {/* Arrival */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{flight.arrival}</div>
                        <div className="text-xs text-gray-500 mb-1">抵達</div>
                        <div className="text-xs font-medium text-gray-600">
                          預計到達
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          機型: {flight.aircraft}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-1 text-right">
                    <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition">
                      查看詳情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">ℹ️ 提示</h4>
            <p className="text-sm text-blue-800">航班狀態每 5 分鐘更新一次，請重新整理頁面以獲得最新資訊。</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 mb-2">📞 需要幫助?</h4>
            <p className="text-sm text-green-800">如有問題，請致電客服 0412-010-888 或洽詢機場地勤人員。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightStatus;
