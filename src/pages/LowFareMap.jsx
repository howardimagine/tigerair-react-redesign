import { ArrowRight, MapPin, Plane, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mapImage from '../../img/map.png';

const fareCities = [
  { city: '東京 Tokyo', airport: 'NRT', country: 'Japan', price: 'NT$ 5,999', top: '25%', left: '70%', flightId: 'IT210' },
  { city: '首爾 Seoul', airport: 'ICN', country: 'Korea', price: 'NT$ 4,999', top: '24%', left: '61%', flightId: 'IT216' },
  { city: '大阪 Osaka', airport: 'KIX', country: 'Japan', price: 'NT$ 6,499', top: '34%', left: '67%', flightId: 'IT212' },
  { city: '澳門 Macau', airport: 'MFM', country: 'China', price: 'NT$ 2,999', top: '49%', left: '51%', flightId: 'IT218' },
  { city: '曼谷 Bangkok', airport: 'BKK', country: 'Thailand', price: 'NT$ 3,999', top: '64%', left: '45%', flightId: 'IT214' },
  { city: '新加坡 Singapore', airport: 'SIN', country: 'Singapore', price: 'NT$ 4,499', top: '79%', left: '49%', flightId: 'IT218' },
];

const LowFareMap = () => {
  const navigate = useNavigate();
  const goToBooking = () => navigate('/booking');

  return (
    <div className="bg-[#d6eaf8]">
      <section className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#d6eaf8]">
        <img src={mapImage} alt="Asia route map" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="absolute left-4 top-5 z-30 w-[calc(100%-2rem)] sm:left-8 sm:top-8 sm:w-[calc(100%-4rem)] lg:w-1/3">
          <div className="flex h-[calc(100vh-4rem-60px)] w-full flex-col rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur md:p-5 sm:h-[calc(100vh-4rem-72px)]">
            <div className="mb-4 shrink-0">
              <p className="text-sm font-semibold text-primary">Low Fare Route Map</p>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">低價航點地圖</h1>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">探索亞洲熱門城市最低票價，點選航點即可前往搜尋航班。</p>
              <button
                type="button"
                onClick={goToBooking}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                搜尋全部航班
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col border-t border-gray-100 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-gray-900">亞洲最低票價</h2>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
                {fareCities.map((destination) => (
                  <button
                    key={destination.city}
                    type="button"
                    onClick={goToBooking}
                    className="w-full rounded-lg border border-gray-100 bg-white px-4 py-3 text-left shadow-sm transition hover:border-primary/50 hover:bg-primary/5"
                  >
                    <span className="block font-semibold text-gray-900">{destination.city}</span>
                    <span className="mt-1 block text-sm text-gray-500">{destination.country} · {destination.airport}</span>
                    <span className="mt-2 block text-lg font-bold text-primary">{destination.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-[20%] top-[52%] z-10 flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-sm font-semibold text-gray-700 shadow-lg ring-1 ring-black/5">
          <Plane className="h-4 w-4 text-primary" />
          Taiwan TPE
        </div>

        {fareCities.map((destination) => (
          <button
            key={destination.airport}
            type="button"
            onClick={goToBooking}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left group"
            style={{ top: destination.top, left: destination.left }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-xl ring-4 ring-white/80 transition group-hover:scale-110">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="mt-2 block min-w-36 rounded-lg bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur transition group-hover:-translate-y-1">
              <span className="block font-bold text-gray-900">{destination.city}</span>
              <span className="block text-gray-500">{destination.airport} · from {destination.price}</span>
            </span>
          </button>
        ))}
      </section>
    </div>
  );
};

export default LowFareMap;
