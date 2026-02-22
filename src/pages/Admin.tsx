import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Database, Activity, ShieldCheck, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function Admin() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-stone-900">Admin Dashboard</h1>
        <p className="text-stone-500">Quản lý hệ thống AgriAI Platform.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Tổng User", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Doanh thu (tháng)", value: "45.2M", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { label: "AI Scans", value: "8,421", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Model Status", value: "Active", icon: ShieldCheck, color: "text-brand-600", bg: "bg-brand-50" }
        ].map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-3xl space-y-2">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-stone-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-[2rem] p-8 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-600" />
            Dữ liệu Giá mới nhất
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="pb-4 font-bold text-stone-400 uppercase tracking-wider">Nông sản</th>
                  <th className="pb-4 font-bold text-stone-400 uppercase tracking-wider">Giá (VND)</th>
                  <th className="pb-4 font-bold text-stone-400 uppercase tracking-wider">Khu vực</th>
                  <th className="pb-4 font-bold text-stone-400 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {["Cà phê", "Hồ tiêu", "Sầu riêng", "Gạo"].map((item) => (
                  <tr key={item} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 font-bold text-stone-800">{item}</td>
                    <td className="py-4 text-stone-600">125,000</td>
                    <td className="py-4 text-stone-600">Tây Nguyên</td>
                    <td className="py-4">
                      <button className="text-brand-600 font-bold hover:underline">Sửa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-8 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-stone-600" />
            Cấu hình AI Model
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-800">Vision Model</p>
                <p className="text-xs text-stone-500">Gemini 3 Flash (v1.0)</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">ONLINE</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-800">Prediction Model</p>
                <p className="text-xs text-stone-500">Gemini 3.1 Pro (v1.0)</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">ONLINE</span>
            </div>
            <button className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all">
              Train Model (Manual Trigger)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
