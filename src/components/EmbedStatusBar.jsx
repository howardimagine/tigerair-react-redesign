import { useEffect, useState } from 'react';

// iOS-style status bar shown when the React app is rendered inside the
// mobile-demo phone-frame iframe (`?embed=phone`).
// Uses the same bg-white/65 + backdrop-blur treatment as the navbar so the
// two strips read as one continuous translucent surface over the page content.
const EmbedStatusBar = () => {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-[54px] items-center justify-between bg-white/65 px-7 text-[15px] font-semibold text-gray-900 shadow-sm shadow-gray-300/10 backdrop-blur-md">
      <div className="pt-1.5">{time}</div>
      <div className="flex items-center gap-1.5 pt-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
        </svg>
        <span className="text-[13px]">5G</span>
        <span className="relative ml-0.5 inline-block h-3 w-6 rounded-[3px] border border-gray-900 p-px">
          <span className="block h-full w-[90%] rounded-[1px] bg-emerald-500" />
          <span className="absolute -right-[3px] top-[3px] h-1 w-0.5 rounded-r-[1px] bg-gray-900" />
        </span>
      </div>
    </div>
  );
};

const formatTime = (d) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;

export default EmbedStatusBar;
