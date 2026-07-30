'use client';

import Link from 'next/link';
import { Calendar, Clock, FileText, Video, CheckCircle, FilePlus, Users, Activity } from 'lucide-react';

// ডামি ডাটা: আজকের অ্যাপয়েন্টমেন্ট শিডিউল
const todayAppointments = [
  { 
    id: 1, 
    patientName: 'Alice Johnson', 
    time: '09:00 AM', 
    type: 'Video Consult', 
    status: 'In Progress', 
    avatar: 'AJ' 
  },
  { 
    id: 2, 
    patientName: 'Robert Smith', 
    time: '10:30 AM', 
    type: 'In-person', 
    status: 'Upcoming', 
    avatar: 'RS' 
  },
  { 
    id: 3, 
    patientName: 'Emma Davis', 
    time: '11:00 AM', 
    type: 'Video Consult', 
    status: 'Upcoming', 
    avatar: 'ED' 
  },
];

export default function DoctorDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good Morning, Dr. Jenkins 🩺</h1>
          <p className="text-gray-600 mt-1">Here is your schedule and overview for today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <Calendar className="w-4 h-4" /> View Calendar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Upcoming</p>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Reports</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Today's Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Today's Appointments</h2>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {todayAppointments.length} Left
              </span>
            </div>
            
            <div className="divide-y divide-gray-50">
              {todayAppointments.map((appt) => (
                <div key={appt.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Patient Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {appt.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{appt.patientName}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                          <Clock className="w-3.5 h-3.5" /> {appt.time}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                          {appt.type === 'Video Consult' ? <Video className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />} 
                          {appt.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Vault
                    </button>
                    <button className="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
                      <FilePlus className="w-4 h-4" /> Prescription
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Notes / Reminders */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
            <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
            <h3 className="text-lg font-bold mb-2 relative z-10">Next Consultation</h3>
            <p className="text-blue-100 text-sm mb-6 relative z-10">Starting in 15 minutes</p>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 relative z-10 mb-4">
              <p className="font-bold text-lg">Alice Johnson</p>
              <p className="text-sm text-blue-100">Video Consult</p>
            </div>
            
            <button className="w-full bg-white text-blue-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-bold transition-colors relative z-10 flex items-center justify-center gap-2">
              <Video className="w-4 h-4" /> Join Call
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}