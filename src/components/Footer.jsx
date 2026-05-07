import { Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import sitemap from '../assets/sitemap.json';

const Footer = () => (
  <footer className="bg-white text-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Brand Section */}
      <div className="mb-12">
        <div className="mb-4">
          <img src="https://www.tigerairtw.com/assets/zh-TW.8eb62b76.svg" alt="Tiger Air Taiwan" className="h-10" />
        </div>
        <p className="text-base text-gray-600">台灣虎航 — 探索亞洲最便捷的方式</p>
        <div className="flex gap-4 mt-4">
          <Share2 className="h-5 w-5 hover:text-primary cursor-pointer transition" />
          <Share2 className="h-5 w-5 hover:text-primary cursor-pointer transition" />
          <Share2 className="h-5 w-5 hover:text-primary cursor-pointer transition" />
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {sitemap.navigation.map((category, idx) => (
          <div key={idx}>
            <h4 className="text-gray-900 font-bold text-base mb-4">{category.category}</h4>
            <div className="space-y-4">
              {category.subcategories.map((sub, sidx) => (
                <div key={sidx}>
                  <h5 className="text-gray-600 text-sm font-semibold mb-2">{sub.name}</h5>
                  <ul className="space-y-1 text-sm">
                    {sub.items.map((item, iidx) => (
                      <li key={iidx}>
                        <a href="#" className="text-gray-500 hover:text-primary transition">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-200 pt-8 text-center text-base text-gray-500">
        <p>© 2026 {sitemap.site_name}. All rights reserved. | 台灣虎航股份有限公司</p>
      </div>
    </div>
  </footer>
);

export default Footer;
