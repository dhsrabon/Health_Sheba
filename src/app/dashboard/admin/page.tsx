'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  Activity, 
  UserPlus, 
  ArrowUpRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  // 💡 পরবর্তীতে এগুলো API থেকে ডাইনামিক ডাটা দিয়ে রিপ্লেস করবেন
  const stats = [
    { title: "Total Revenue", amount: "৳ 45,231", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { title: "Total Appointments", amount: "1,204", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Registered Doctors", amount: "142", icon: Stethoscope, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Total Patients", amount: "3,420", icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 🌟 Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your platform today.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
          <Activity className="w-4 h-4" /> Generate Report
        </button>
      </div>

      {/* 📊 Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.amount}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 📋 Main Dashboard Content (2 Columns) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 🩺 Doctor Approval Requests (Left Column - Takes up 2/3 space) */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Pending Doctor Approvals
            </h2>
            <Link href="/dashboard/admin/requests" className="text-sm text-blue-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Mock Request Item 1 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">AJ</div>
                <div>
                  <h4 className="font-bold text-gray-900">Dr. Ahmed Jalal</h4>
                  <p className="text-xs text-gray-500">Cardiologist • Dhaka Medical College</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition" title="Approve">
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition" title="Reject">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mock Request Item 2 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">SR</div>
                <div>
                  <h4 className="font-bold text-gray-900">Dr. Sarah Rahman</h4>
                  <p className="text-xs text-gray-500">Neurologist • Square Hospital</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition" title="Approve">
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition" title="Reject">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 📅 Recent Bookings (Right Column - Takes up 1/3 space) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Recent Bookings
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Mock Booking 1 */}
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <p className="text-sm font-bold text-gray-900">Patient: Hasibul Islam</p>
              <p className="text-xs text-gray-500 mt-1">Dr. Michael Chen (Neurologist)</p>
              <p className="text-xs font-semibold text-blue-600 mt-1">Today, 10:30 AM</p>
            </div>
            <hr className="border-gray-50" />
            
            {/* Mock Booking 2 */}
            <div className="border-l-4 border-green-500 pl-4 py-1">
              <p className="text-sm font-bold text-gray-900">Patient: Nusrat Jahan</p>
              <p className="text-xs text-gray-500 mt-1">Dr. Sarah Jenkins (Cardiologist)</p>
              <p className="text-xs font-semibold text-green-600 mt-1">Today, 02:15 PM</p>
            </div>
            <hr className="border-gray-50" />

            {/* Mock Booking 3 */}
            <div className="border-l-4 border-orange-500 pl-4 py-1">
              <p className="text-sm font-bold text-gray-900">Patient: Kamrul Hasan</p>
              <p className="text-xs text-gray-500 mt-1">Dr. James Wilson (Surgeon)</p>
              <p className="text-xs font-semibold text-orange-600 mt-1">Tomorrow, 11:00 AM</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}