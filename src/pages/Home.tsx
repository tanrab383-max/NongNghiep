import React from 'react';
import { ArrowRight, Shield, Zap, Globe, Users, Award, Leaf, Brain, TrendingUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/agriculture/1920/1080?blur=2" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-transparent to-stone-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-bold"
            >
              <Zap className="w-4 h-4" />
              NỀN TẢNG NÔNG NGHIỆP AI SỐ 1 VIỆT NAM
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-serif font-bold text-stone-900 leading-[1.1]"
            >
              Canh tác thông minh, <span className="text-brand-600 italic">Lợi nhuận</span> bền vững.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-stone-600 leading-relaxed max-w-xl"
            >
              AgriAI giúp bạn chẩn đoán bệnh cây tức thì, dự báo chính xác giá thị trường và tư vấn kỹ thuật chuyên sâu bằng trí tuệ nhân tạo.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link 
                to="/prices" 
                className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 flex items-center gap-2"
              >
                Bắt đầu ngay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/subscription" 
                className="px-8 py-4 bg-white border border-stone-200 text-stone-900 rounded-2xl font-bold text-lg hover:bg-stone-50 transition-all"
              >
                Xem bảng giá
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-stone-900">Tính năng Đột phá</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">Chúng tôi mang đến bộ công cụ AI toàn diện nhất để hỗ trợ người nông dân trong kỷ nguyên số.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Dự báo Giá AI",
              desc: "Phân tích dữ liệu lớn để dự đoán xu hướng giá cà phê, hồ tiêu, sầu riêng... với độ chính xác cao.",
              icon: TrendingUp,
              color: "bg-orange-500",
              link: "/prices"
            },
            {
              title: "Nhận diện Bệnh",
              desc: "Chụp ảnh lá cây và nhận kết quả chẩn đoán bệnh cùng phác đồ điều trị chỉ trong 3 giây.",
              icon: Search,
              color: "bg-brand-600",
              link: "/disease"
            },
            {
              title: "Trợ lý Nông nghiệp",
              desc: "Chatbot AI am hiểu kỹ thuật canh tác Việt Nam, sẵn sàng giải đáp mọi thắc mắc 24/7.",
              icon: Brain,
              color: "bg-blue-600",
              link: "/chat"
            }
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] space-y-6 card-hover group"
            >
              <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <f.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900">{f.title}</h3>
              <p className="text-stone-500 leading-relaxed">{f.desc}</p>
              <Link to={f.link} className="flex items-center gap-2 text-brand-600 font-bold group-hover:gap-3 transition-all">
                Khám phá ngay
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-stone-900 py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Người dùng", value: "50,000+" },
              { label: "Độ chính xác AI", value: "94%" },
              { label: "Nông sản hỗ trợ", value: "12+" },
              { label: "Tỉnh thành", value: "63" }
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <p className="text-4xl md:text-6xl font-serif font-bold text-white">{s.value}</p>
                <p className="text-stone-400 text-sm uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/10 blur-[120px] rounded-full"></div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900">Sẵn sàng nâng tầm nông sản Việt?</h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">Tham gia cùng hàng ngàn nông dân hiện đại đang sử dụng AgriAI để làm giàu từ mảnh vườn của mình.</p>
            <div className="pt-4">
              <Link 
                to="/auth" 
                className="px-12 py-5 bg-stone-900 text-white rounded-2xl font-bold text-xl hover:bg-stone-800 transition-all shadow-2xl"
              >
                Đăng ký Miễn phí
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100/50 blur-3xl rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100/50 blur-3xl rounded-full -ml-32 -mb-32"></div>
        </div>
      </section>
    </div>
  );
}
