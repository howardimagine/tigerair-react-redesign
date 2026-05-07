import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import sitemap from '../assets/sitemap.json';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = sitemap.navigation;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="https://www.tigerairtw.com/assets/zh-TW.8eb62b76.svg" alt="Tiger Air Taiwan" className="h-12" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <div key={idx} className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition py-2">
                  {link.category}
                  <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition" />
                </button>
                {/* Dropdown Menu */}
                <div className="hidden group-hover:block absolute left-0 top-full pt-2 bg-white rounded-lg shadow-lg min-w-48 z-50">
                  {link.subcategories.map((sub, sidx) => (
                    <div key={sidx}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b">
                        {sub.name}
                      </div>
                      {sub.items.map((item, iidx) => (
                        <a key={iidx} href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition">
                          {item}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/member" className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
                  <User className="h-4 w-4" />
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-primary">
                  登出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-primary">登入 Login</Link>
                <Link to="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                  註冊 Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-600">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t py-4 space-y-3">
            {navLinks.map((link, idx) => (
              <div key={idx}>
                <button 
                  onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-primary py-2 font-medium"
                >
                  {link.category}
                  <ChevronDown className={`h-4 w-4 transition ${openDropdown === idx ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === idx && (
                  <div className="pl-4 space-y-2">
                    {link.subcategories.map((sub, sidx) => (
                      <div key={sidx}>
                        <div className="text-xs font-semibold text-gray-500 uppercase py-1">{sub.name}</div>
                        {sub.items.map((item, iidx) => (
                          <a key={iidx} href="#" className="block text-sm text-gray-600 hover:text-primary py-1">
                            {item}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              {user ? (
                <>
                  <Link to="/member" className="block text-gray-600 hover:text-primary py-1" onClick={() => setIsOpen(false)}>
                    會員中心
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left text-gray-600 hover:text-primary py-1">
                    登出
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-gray-600 hover:text-primary py-1" onClick={() => setIsOpen(false)}>
                    登入
                  </Link>
                  <Link to="/register" className="block bg-primary text-white text-center px-4 py-2 rounded-lg mt-2" onClick={() => setIsOpen(false)}>
                    註冊
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
