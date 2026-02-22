import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, TrendingUp, Search, MessageSquare, CreditCard, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Dự báo Giá', path: '/prices', icon: TrendingUp },
    { name: 'Bệnh Cây', path: '/disease', icon: Search },
    { name: 'Trợ lý AI', path: '/chat', icon: MessageSquare },
    { name: 'Gói Dịch vụ', path: '/subscription', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass sticky top-0 z-50 border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200 group-hover:scale-110 transition-transform">
                  <Leaf className="w-6 h-6" />
                </div>
                <span className="text-2xl font-serif font-bold tracking-tight text-stone-900">AgriAI</span>
              </Link>
              
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      location.pathname === item.path
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-full border border-stone-100">
                    <div className="w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center text-white text-[10px]">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-medium text-stone-700">{user.fullName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                      user.tier === 'premium' ? 'bg-orange-100 text-orange-600' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {user.tier}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
                >
                  Đăng nhập
                </Link>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-stone-500"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-stone-600 hover:bg-stone-50"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </div>
                  </Link>
                ))}
                {!user && (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-bold text-brand-600 bg-brand-50"
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-xl font-serif font-bold">AgriAI Platform</span>
              </div>
              <p className="text-stone-400 max-w-sm leading-relaxed">
                Tiên phong ứng dụng trí tuệ nhân tạo vào nông nghiệp Việt Nam, giúp nông dân tối ưu hóa năng suất và nâng cao giá trị nông sản.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Sản phẩm</h4>
              <ul className="space-y-4 text-stone-400 text-sm">
                <li><Link to="/prices" className="hover:text-white transition-colors">Dự báo giá AI</Link></li>
                <li><Link to="/disease" className="hover:text-white transition-colors">Nhận diện bệnh cây</Link></li>
                <li><Link to="/chat" className="hover:text-white transition-colors">Trợ lý ảo AgriAI</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Liên hệ</h4>
              <ul className="space-y-4 text-stone-400 text-sm">
                <li>Email: contact@agriai.vn</li>
                <li>Hotline: 1900 8888</li>
                <li>Địa chỉ: Khu Công nghệ cao, TP. HCM</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-800 text-center text-stone-500 text-xs">
            © 2024 AgriAI Platform. All rights reserved. Phát triển bởi AI Engineer.
          </div>
        </div>
      </footer>
    </div>
  );
}
