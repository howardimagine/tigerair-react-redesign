import { Link } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/solid';
import sitemap from '../assets/sitemap.json';

const supportItems = [
  { icon: PhoneIcon, label: '客服專線', value: '02-5599-2555' },
  { icon: EnvelopeIcon, label: '客服信箱', value: 'service@tigerairtw.com' },
  { icon: MapPinIcon, label: '服務據點', value: '台北市大同區鄭州路139號' },
];

const getItemLink = (item) => {
  const linkMap = {
    立即購票: '/search',
    時刻表: '/schedule',
    航點資訊: '/flight-status',
    低價航點地圖: '/fare-map',
    主題旅遊: '/blog/theme-travel',
    熱門活動: '/blog/events',
    限時促銷: '/blog/promotions',
  };

  return linkMap[item] || '/articles/article-1';
};

const Footer = () => (
  <footer className="border-t border-gray-200 bg-gray-50 text-gray-700">
    <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_2fr]">
        <div>
          <Link to="/" className="inline-flex">
            <img
              src="https://www.tigerairtw.com/assets/zh-TW.8eb62b76.svg"
              alt="Tiger Air Taiwan"
              className="h-10"
            />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-gray-500">
            台灣虎航以親民票價串連亞洲城市，陪你用更自由的方式安排每一次旅行。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {supportItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3 py-2">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">{item.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {sitemap.navigation.map((category) => (
            <div
              key={category.category}
              className="grid gap-4 py-2 md:grid-cols-[9rem_1fr]"
            >
              <div className="flex items-start justify-between gap-3 pb-3 md:block md:pb-0 md:pr-4">
                <div>
                  <h4 className="text-base font-bold text-gray-900">{category.category}</h4>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {category.subcategories.map((sub) => (
                  <div key={sub.name}>
                    <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{sub.name}</h5>
                    <ul className="grid gap-1.5">
                      {sub.items.slice(0, 5).map((item) => (
                        <li key={item}>
                          <Link
                            to={getItemLink(item)}
                            className="inline-flex text-sm font-medium text-gray-600 transition hover:translate-x-1 hover:text-primary"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-200 pt-6 text-sm text-gray-500">
        <span>© 2026 {sitemap.site_name}. 台灣虎航股份有限公司</span>
        <Link to="/articles/article-1" className="transition hover:text-primary">隱私權政策</Link>
        <Link to="/articles/article-1" className="transition hover:text-primary">使用條款</Link>
        <Link to="/articles/article-1" className="transition hover:text-primary">Cookie 政策</Link>
        <span className="inline-flex items-center gap-1">
          <ChatBubbleLeftRightIcon className="h-4 w-4" />
          需要協助？請聯繫客服中心
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
