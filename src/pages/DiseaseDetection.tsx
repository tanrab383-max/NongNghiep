import React, { useState, useRef } from 'react';
import { Camera, Upload, Search, CheckCircle, AlertTriangle, Pill, RefreshCw, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

export default function DiseaseDetection() {
  const { token } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/detect-disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image })
      });
      const data = await res.json();
      setResult(data.diagnosis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-stone-900">Nhận diện Bệnh Cây trồng</h1>
        <p className="text-stone-500">Chụp ảnh lá hoặc thân cây bị bệnh để AI chẩn đoán và đưa ra phác đồ điều trị.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <motion.div 
            layout
            className="glass rounded-[2rem] p-4 aspect-square relative overflow-hidden flex flex-center items-center justify-center border-2 border-dashed border-stone-200"
          >
            {image ? (
              <img src={image} alt="Upload" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-10 h-10 text-stone-300" />
                </div>
                <div>
                  <p className="font-bold text-stone-800">Chưa có hình ảnh</p>
                  <p className="text-sm text-stone-400">Tải lên hoặc chụp ảnh cây trồng</p>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </motion.div>

          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-4 bg-white border border-stone-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Tải ảnh lên
            </button>
            <button 
              onClick={handleDetect}
              disabled={!image || loading}
              className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Chẩn đoán AI
                </>
              )}
            </button>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h4 className="font-bold text-stone-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-600" />
              Hướng dẫn chụp ảnh
            </h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</div>
                Chụp cận cảnh bộ phận bị bệnh (lá, thân, quả).
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</div>
                Đảm bảo đủ ánh sáng và ảnh không bị mờ.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</div>
                Tránh chụp quá nhiều vật thể xung quanh.
              </li>
            </ul>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-[2rem] p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-stone-900">Kết quả Chẩn đoán</h3>
                <span className="px-3 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded-full uppercase">Hoàn tất</span>
              </div>

              <div className="markdown-body">
                <Markdown>{result}</Markdown>
              </div>

              <div className="pt-6 border-t border-stone-100 flex gap-4">
                <button className="flex-1 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <Pill className="w-4 h-4" />
                  Mua thuốc gợi ý
                </button>
                <button className="flex-1 py-3 bg-white border border-stone-200 text-stone-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  Lưu lịch sử
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4 border-2 border-dashed border-stone-200 rounded-[2rem]"
            >
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-stone-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-400">Đang chờ dữ liệu</h3>
                <p className="text-stone-300 text-sm">Vui lòng tải ảnh lên và nhấn nút Chẩn đoán AI để xem kết quả.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
