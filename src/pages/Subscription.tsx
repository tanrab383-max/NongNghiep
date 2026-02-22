import React from 'react';
import { Check, Zap, Shield, Star, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

const tiers = [
  {
    name: "Cơ bản",
    price: "0đ",
    period: "/tháng",
    description: "Dành cho nông dân mới bắt đầu tiếp cận công nghệ.",
    features: [
      "Nhận diện 5 bệnh cây/tháng",
      "Chatbot tư vấn cơ bản",
      "Xem giá nông sản hiện tại",
      "Lưu 10 lịch sử chẩn đoán"
    ],
    button: "Đang sử dụng",
    current: true,
    tier: 'free'
  },
  {
    name: "Premium",
    price: "199.000đ",
    period: "/tháng",
    description: "Dành cho trang trại chuyên nghiệp cần dự báo chính xác.",
    features: [
      "Nhận diện bệnh không giới hạn",
      "Dự báo giá AI chuyên sâu (7, 30, 90 ngày)",
      "Chatbot ưu tiên phản hồi",
      "Cảnh báo biến động giá sớm",
      "Xuất báo cáo PDF hàng tháng"
    ],
    button: "Nâng cấp ngay",
    popular: true,
    tier: 'premium'
  },
  {
    name: "Doanh nghiệp",
    price: "Liên hệ",
    period: "",
    description: "Giải pháp tùy chỉnh cho hợp tác xã và doanh nghiệp.",
    features: [
      "Tất cả tính năng Premium",
      "API tích hợp hệ thống riêng",
      "Quản lý nhiều tài khoản con",
      "Hỗ trợ chuyên gia 24/7",
      "Tùy chỉnh model AI theo yêu cầu"
    ],
    button: "Liên hệ tư vấn",
    tier: 'enterprise'
  }
];

export default function Subscription() {
  const { user, token, login } = useAuth();

  const handleUpgrade = async (tier: string) => {
    if (tier === 'free') return;
    if (tier === 'enterprise') {
      window.location.href = "mailto:contact@agriai.vn";
      return;
    }

    try {
      const res = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tier })
      });
      const data = await res.json();
      if (data.success) {
        alert("Nâng cấp thành công!");
        login(token!, { ...user!, tier });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-5xl font-bold text-stone-900">Gói Dịch vụ</h1>
        <p className="text-stone-500 text-lg">Chọn gói dịch vụ phù hợp để tối ưu hóa năng suất và lợi nhuận cho trang trại của bạn.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass rounded-[2.5rem] p-8 flex flex-col relative ${
              t.popular ? 'border-brand-500 border-2 shadow-xl shadow-brand-100' : 'border-stone-200'
            }`}
          >
            {t.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                PHỔ BIẾN NHẤT
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-2">{t.name}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{t.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-stone-900">{t.price}</span>
                <span className="text-stone-400 text-sm">{t.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {t.features.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-stone-600">
                  <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(t.tier)}
              disabled={user?.tier === t.tier}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                user?.tier === t.tier
                ? 'bg-stone-100 text-stone-400 cursor-default'
                : t.popular
                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200'
                : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {user?.tier === t.tier ? 'Đang sử dụng' : t.button}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-[2.5rem] p-12 bg-stone-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-400 font-bold uppercase tracking-widest text-xs">
            <Shield className="w-4 h-4" />
            An tâm tuyệt đối
          </div>
          <h2 className="text-3xl font-bold">Bạn cần một giải pháp tùy chỉnh?</h2>
          <p className="text-stone-400 max-w-xl">Chúng tôi cung cấp các gói dịch vụ riêng biệt cho các hợp tác xã lớn, tích hợp IoT và cảm biến đất đai.</p>
        </div>
        <button className="px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shrink-0">
          Liên hệ Đội ngũ Kỹ thuật
        </button>
      </div>
    </div>
  );
}
