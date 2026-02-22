import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Trash2, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function Chat() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Xin chào! Tôi là AgriAI Assistant. Tôi có thể giúp gì cho bạn về kỹ thuật canh tác, sâu bệnh hay giá cả nông sản hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'bot', text: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4">
      <header className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">AgriAI Assistant</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-stone-500 font-medium">Đang trực tuyến</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'bot', text: 'Xin chào! Tôi là AgriAI Assistant. Tôi có thể giúp gì cho bạn?' }])}
          className="p-2 text-stone-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 glass rounded-[2.5rem] overflow-hidden flex flex-col border-stone-200/50">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-stone-900 text-white' : 'bg-brand-100 text-brand-600'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-tr-none' 
                    : 'bg-white border border-stone-100 text-stone-800 shadow-sm rounded-tl-none'
                  }`}>
                    <div className="markdown-body">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-stone-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 bg-stone-50/50 border-t border-stone-100">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi về kỹ thuật trồng sầu riêng, giá cà phê..."
              className="w-full py-4 pl-6 pr-16 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 shadow-md shadow-brand-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-center mt-3 text-stone-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI có thể đưa ra thông tin chưa chính xác. Hãy kiểm tra lại với chuyên gia.
          </p>
        </div>
      </div>
    </div>
  );
}
