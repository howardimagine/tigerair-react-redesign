import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import sitemap from '../assets/sitemap.json';

const languageOptions = [
  { value: 'zh-TW', label: '繁中' },
  { value: 'en-US', label: 'EN' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'ko-KR', label: '한국어' },
];

const currencyOptions = [
  { value: 'TWD', label: 'TWD' },
  { value: 'JPY', label: 'JPY' },
  { value: 'KRW', label: 'KRW' },
  { value: 'THB', label: 'THB' },
  { value: 'USD', label: 'USD' },
];

const LocaleDropdown = ({ icon: Icon, label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex items-center gap-1.5 rounded-full bg-transparent px-2 py-1.5 text-sm font-medium transition hover:bg-orange-50 hover:text-primary ${isOpen ? 'text-primary' : 'text-gray-600'}`}
        aria-label={label}
        aria-expanded={isOpen}
      >
        <Icon className="h-4 w-4" />
        <span>{selectedOption.label}</span>
        <ChevronDownIcon className={`h-3.5 w-3.5 transition duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-32 overflow-hidden rounded-lg bg-white py-1 shadow-xl shadow-gray-900/10 ring-1 ring-black/5">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-orange-50 hover:text-primary ${option.value === value ? 'font-semibold text-primary' : 'text-gray-700'}`}
            >
              <span>{option.label}</span>
              {option.value === value && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [language, setLanguage] = useState('zh-TW');
  const [currency, setCurrency] = useState('TWD');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

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

  const navLinks = sitemap.navigation;

  const localeControls = (
    <div className="flex items-center gap-2">
      <LocaleDropdown
        icon={GlobeAltIcon}
        label="語系"
        value={language}
        options={languageOptions}
        onChange={setLanguage}
      />
      <LocaleDropdown
        icon={CurrencyDollarIcon}
        label="幣別"
        value={currency}
        options={currencyOptions}
        onChange={setCurrency}
      />
    </div>
  );

  const renderMenuItem = (item, className, onClick) => {
    const itemLink = getItemLink(item);

    if (itemLink === '#') {
      return (
        <a href="#" className={className} onClick={onClick}>
          {item}
        </a>
      );
    }

    return (
      <Link to={itemLink} className={className} onClick={onClick}>
        {item}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 shadow-lg shadow-gray-300/10 backdrop-blur">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between md:h-16">
          <Link to="/" className="flex items-center">
            <img
              src="https://www.tigerairtw.com/assets/zh-TW.8eb62b76.svg"
              alt="Tiger Air Taiwan"
              className="h-7 sm:h-9"
            />
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            {navLinks.map((link, idx) => (
              <div key={idx} className="group relative">
                <button className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-orange-50 hover:text-primary">
                  {link.category}
                  <ChevronDownIcon className="h-4 w-4 transition duration-200 group-hover:rotate-180" />
                </button>
                <div className={`invisible absolute top-full z-50 pt-3 opacity-0 transition duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${idx > navLinks.length - 3 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
                  <div className="relative w-[calc(100vw-2rem)] max-w-[680px] rounded-lg border border-gray-100 bg-white p-3 shadow-xl shadow-gray-900/10 ring-1 ring-black/5">
                    <div className={`absolute -top-1 h-3 w-3 rotate-45 border-l border-t border-gray-100 bg-white ${idx > navLinks.length - 3 ? 'right-8' : 'left-1/2 -translate-x-1/2'}`} />
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {link.subcategories.map((sub, sidx) => (
                        <div key={sidx} className="rounded-md p-3">
                          <div className="mb-2 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <div className="text-base font-semibold uppercase tracking-wide text-gray-800">
                              {sub.name}
                            </div>
                          </div>
                          <div>
                            {sub.items.map((item, iidx) => (
                              <div key={iidx}>
                                {renderMenuItem(
                                  item,
                                  'block rounded-md py-1 text-sm text-gray-700 transition hover:text-primary'
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link to="/member" className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
                  <UserIcon className="h-4 w-4" />
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  登出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1 px-2 py-2 text-sm text-gray-600 hover:text-primary">
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  登入
                </Link>
                <Link to="/register" className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-gray-600 hover:text-primary">
                  <UserPlusIcon className="h-4 w-4" />
                  註冊
                </Link>
              </>
            )}
            {localeControls}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-orange-50 hover:text-primary md:hidden"
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="space-y-2">
              {navLinks.map((link, idx) => (
                <div key={idx} className="overflow-hidden rounded-lg border border-gray-100 bg-white">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition ${openDropdown === idx ? 'bg-orange-50 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`}
                  >
                    {link.category}
                    <ChevronDownIcon className={`h-4 w-4 transition duration-200 ${openDropdown === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-200 ease-out ${openDropdown === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="space-y-3 border-t border-gray-100 bg-gray-50/70 px-4 py-3">
                        {link.subcategories.map((sub, sidx) => (
                          <div key={sidx}>
                            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {sub.name}
                            </div>
                            <div className="space-y-1">
                              {sub.items.map((item, iidx) => (
                                <div key={iidx}>
                                  {renderMenuItem(
                                    item,
                                    'block rounded-md px-3 py-2 text-sm text-gray-600 transition hover:bg-white hover:text-primary',
                                    () => setIsOpen(false)
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4">
              {user ? (
                <>
                  <Link
                    to="/member"
                    className="block rounded-md px-4 py-2 text-sm text-gray-600 transition hover:bg-orange-50 hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    會員中心
                  </Link>
                  <button onClick={handleLogout} className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-600 transition hover:bg-orange-50 hover:text-primary">
                    登出
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block rounded-md px-4 py-2 text-sm text-gray-600 transition hover:bg-orange-50 hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    登入
                  </Link>
                  <Link
                    to="/register"
                    className="mt-2 block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-dark"
                    onClick={() => setIsOpen(false)}
                  >
                    註冊
                  </Link>
                </>
              )}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4">
              {localeControls}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
