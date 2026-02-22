import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Brain, Calendar, Info, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

const commodities = ["Cà phê", "Hồ tiêu", "Gạo", "Cao su", "Heo hơi", "Sầu riêng"];

export default function PricePrediction() {
  const { token, user } = useAuth();
  const [selected, setSelected] = useState(commodities[0]);
  const [history, setHistory] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [selected]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prices?commodity=${encodeURIComponent(selected)}`);
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    if (user?.tier === 'free') {
      alert("Vui lòng nâng cấp tài khoản Premium để sử dụng tính năng dự báo AI chuyên sâu.");
      return;
    }
    
    setPredicting(true);
    try {
      const res = await fetch('/api/ai/predict-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          commodity: selected,
          historicalData: history.slice(-30)
        })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (e) {
      console.error(e);
    } finally {
      setPredicting(false);
    }
  };

  const combinedData = [
    ...history.map(h => ({ ...h, type: 'Lịch sử' })),
    ...(prediction?.predictions?.map((p: any) => ({ ...p, commodity: selected, type: 'Dự báo' })) || [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-stone-900">Dự báo Giá Nông sản</h1>
          <p className="text-stone-500 mt-2">Phân tích xu hướng thị trường bằng trí tuệ nhân tạo.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {commodities.map(c => (
            <button
              key={c}
              onClick={() => setSelected(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selected === c 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-white text-stone-600 border border-stone-200 hover:border-brand-500'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 h-[450px]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                Biểu đồ Biến động Giá
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-brand-500"></span>
                  <span>Lịch sử</span>
                </div>
                {prediction && (
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span>Dự báo AI</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 'Giá']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  {prediction && (
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      data={prediction.predictions}
                      stroke="#f97316" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      fillOpacity={1} 
                      fill="url(#colorPredict)" 
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-brand-100 rounded-xl text-brand-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Giá Hiện tại</p>
                <p className="text-xl font-bold">
                  {history.length > 0 ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(history[history.length-1].price) : '---'}
                </p>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Dự báo 7 ngày</p>
                <p className="text-xl font-bold">
                  {prediction ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prediction.predictions[6]?.price || 0) : '---'}
                </p>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Độ tin cậy</p>
                <p className="text-xl font-bold">
                  {prediction ? `${(prediction.confidence * 100).toFixed(0)}%` : '---'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 bg-brand-900 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Phân tích AI</h3>
              <p className="text-brand-100 text-sm mb-6">Sử dụng mô hình Gemini 3.1 Pro để phân tích xu hướng thị trường nông sản Việt Nam.</p>
              
              <button
                onClick={handlePredict}
                disabled={predicting || loading}
                className="w-full py-4 bg-white text-brand-900 font-bold rounded-2xl hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {predicting ? (
                  <div className="w-5 h-5 border-2 border-brand-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Chạy Dự báo AI
                  </>
                )}
              </button>
              
              {user?.tier === 'free' && (
                <p className="text-[10px] text-center mt-3 text-brand-200">Yêu cầu tài khoản Premium</p>
              )}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
          </div>

          {prediction && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-3xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-brand-600 font-bold">
                <AlertCircle className="w-5 h-5" />
                Khuyến nghị
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-sm font-bold text-stone-800 mb-1">Hành động:</p>
                <p className="text-lg text-brand-700 font-bold uppercase">{prediction.recommendation}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800 mb-2">Phân tích chi tiết:</p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {prediction.analysis}
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100">
                <div className="flex justify-between items-center text-xs text-stone-400">
                  <span>Xu hướng:</span>
                  <span className={`font-bold uppercase ${prediction.trend === 'up' ? 'text-green-500' : prediction.trend === 'down' ? 'text-red-500' : 'text-blue-500'}`}>
                    {prediction.trend === 'up' ? 'Tăng trưởng' : prediction.trend === 'down' ? 'Giảm giá' : 'Ổn định'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {!prediction && (
            <div className="glass rounded-3xl p-8 text-center space-y-4 border-dashed border-2 border-stone-200 bg-transparent">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-stone-300" />
              </div>
              <p className="text-stone-400 text-sm">Chưa có dữ liệu dự báo. Nhấn nút "Chạy Dự báo AI" để bắt đầu phân tích.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
