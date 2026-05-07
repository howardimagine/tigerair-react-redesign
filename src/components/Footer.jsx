import { Plane, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-800 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-white">Tigerair Taiwan</span>
          </div>
          <p className="text-sm text-gray-400">台灣虎航 — 探索亞洲最便捷的方式</p>
          <div className="flex gap-4 mt-4">
            <Share2 className="h-5 w-5 hover:text-primary cursor-pointer transition" />
            <Share2 className="h-5 w-5 hover:text-primary cursor-pointer transition" />
            <Share2 className="h-5 w-5 hover:text-primary cursor-pointer transition" />
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Flight 航班</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search" className="hover:text-primary transition">訂票 Book</Link></li>
            <li><Link to="/checkin" className="hover:text-primary transition">報到 Check-in</Link></li>
            <li><Link to="/orders" className="hover:text-primary transition">訂單查詢 My Trips</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Service 服務</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/support" className="hover:text-primary transition">常見問題 FAQ</Link></li>
            <li><Link to="/support" className="hover:text-primary transition">聯絡我們 Contact</Link></li>
            <li><Link to="/tasks" className="hover:text-primary transition">會員任務 Tasks</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">About 關於</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-primary cursor-pointer transition">關於虎航</span></li>
            <li><span className="hover:text-primary cursor-pointer transition">隱私權政策</span></li>
            <li><span className="hover:text-primary cursor-pointer transition">使用條款</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
        © 2026 Tigerair Taiwan. All rights reserved. | 台灣虎航股份有限公司
      </div>
    </div>
  </footer>
);

export default Footer;
