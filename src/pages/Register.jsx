import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', agree: false });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('請填寫所有必填欄位'); return; }
    if (form.password !== form.confirm) { setError('密碼不一致'); return; }
    if (!form.agree) { setError('請同意使用條款'); return; }
    register(form.name, form.email);
    navigate('/member');
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-gray-500 text-center mb-8">建立您的帳號</p>

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名 Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="陳明偉" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email 電子郵件</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="your@email.com" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手機 Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="0912-345-678" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密碼 Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="至少 8 碼" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">確認密碼 Confirm</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}
                  placeholder="再次輸入密碼" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={form.agree} onChange={e => setForm({...form, agree: e.target.checked})} className="mt-1 rounded" />
              <span className="text-gray-600">我已閱讀並同意 <a href="#" className="text-primary underline">使用條款</a> 及 <a href="#" className="text-primary underline">隱私權政策</a></span>
            </label>
            <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition">
              註冊 Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            已有帳號？<Link to="/login" className="text-primary font-medium hover:underline">立即登入 Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
