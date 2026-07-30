'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  MapPin, 
  Users, 
  Heart, 
  CalendarCheck, 
  Shield, 
  Bot, 
  Lock, 
  UserSearch, 
  CalendarPlus, 
  Video, 
  FlaskConical, 
  Pill,
  ChevronRight
} from 'lucide-react';

export default function HeroBanner(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full bg-[#f4f7fe] overflow-hidden pt-4 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* ================= TOP SECTION (Grid) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ----- LEFT COLUMN (Text & Search) ----- */}
          <div className={`lg:col-span-7 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Priority Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-6 hover:shadow-md transition-shadow mt-4 lg:mt-0">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-700">Your Health, Our Priority</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-5xl lg:text-[70px] font-extrabold text-[#111827] leading-[1.1] tracking-tight mb-6">
              Better Healthcare <br className="hidden sm:block" />
              For A <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Better You</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
              Book appointments, consult doctors online, manage your health records and more — all in one secure place.
            </p>

            {/* Comprehensive Search Bar */}
            <div className="bg-white p-3 rounded-2xl shadow-xl shadow-blue-900/5 border border-white flex flex-col sm:flex-row items-center gap-3 w-full max-w-3xl hover:shadow-2xl hover:shadow-blue-900/10 transition-shadow duration-300">
              
              {/* Speciality Search */}
              <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 sm:border-r border-slate-100">
                <Search className="w-6 h-6 text-cyan-500 shrink-0" />
                <div className="w-full">
                  <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">Search Doctors, Specialties...</p>
                  <input 
                    type="text" 
                    placeholder="e.g. Cardiologist, Dental" 
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-600 outline-none placeholder-slate-400 text-sm p-0"
                  />
                </div>
              </div>

              {/* Location Search */}
              <div className="flex-1 w-full flex items-center gap-3 px-4 py-2">
                <MapPin className="w-6 h-6 text-blue-500 shrink-0" />
                <div className="w-full">
                  <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">Near Location</p>
                  <select className="w-full bg-transparent border-none focus:ring-0 text-slate-600 outline-none text-sm p-0 cursor-pointer appearance-none">
                    <option>Dhaka, Bangladesh</option>
                    <option>Chittagong, Bangladesh</option>
                    <option>Sylhet, Bangladesh</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 shrink-0">
                Search Now
              </button>
            </div>

            {/* Stats Row */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-blue-100/50 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">1200+</h4>
                  <p className="text-xs font-medium text-slate-500">Expert Doctors</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-emerald-100/50 p-3 rounded-full group-hover:bg-emerald-100 transition-colors">
                  <Heart className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">50K+</h4>
                  <p className="text-xs font-medium text-slate-500">Happy Patients</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-purple-100/50 p-3 rounded-full group-hover:bg-purple-100 transition-colors">
                  <CalendarCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">30K+</h4>
                  <p className="text-xs font-medium text-slate-500">Appointments</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-orange-100/50 p-3 rounded-full group-hover:bg-orange-100 transition-colors">
                  <Shield className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">100%</h4>
                  <p className="text-xs font-medium text-slate-500">Secure & Safe</p>
                </div>
              </div>
            </div>

          </div>

          {/* ----- RIGHT COLUMN (Hero Image & Floating Cards) ----- */}
          <div className={`lg:col-span-5 relative w-full h-[500px] lg:h-[600px] mt-10 lg:mt-0 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            
            <div className="absolute inset-0 flex justify-center items-end">
              <div className="w-[85%] h-[85%] bg-gradient-to-b from-blue-400 to-blue-600 rounded-full relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                
                {/* --- ONLINE DOCTOR IMAGE --- */}
                <img 
                  src="https://png.pngtree.com/png-clipart/20230918/ourmid/pngtree-photo-men-doctor-physician-chest-smiling-png-image_10132895.png" 
                  alt="Expert Healthcare Professional" 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-auto max-h-[110%] object-contain drop-shadow-2xl z-10"
                />
              </div>
            </div>

            {/* Floating Card 1: AI Assistant */}
            <div className="absolute top-16 left-0 sm:-left-4 bg-white p-3 rounded-2xl shadow-xl border border-white flex items-center gap-3 animate-[bounce_4s_infinite] hover:scale-105 transition-transform cursor-pointer z-20">
              <div className="bg-cyan-100 p-2 rounded-full">
                <Bot className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="pr-2">
                <p className="text-sm font-bold text-slate-900">AI Health Assistant</p>
                <p className="text-[10px] font-medium text-slate-500">Get instant health insights</p>
              </div>
            </div>

            {/* Floating Card 2: Live Consultations */}
            <div className="absolute top-8 right-0 sm:-right-8 bg-white p-3.5 rounded-2xl shadow-xl border border-white animate-[bounce_5s_infinite_reverse] hover:scale-105 transition-transform cursor-pointer z-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-xs font-bold text-slate-900">Live Consultations</p>
              </div>
              <p className="text-[10px] text-slate-500 mb-2">Talk to doctors online</p>
              <div className="flex -space-x-2">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" alt="user" />
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" alt="user" />
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" alt="user" />
                <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center z-10">
                  <span className="text-[8px] font-bold text-blue-600">+</span>
                </div>
              </div>
            </div>

          

            {/* Floating Card 4: Your Data */}
            <div className="absolute bottom-10 right-4 sm:-right-4 bg-white p-4 rounded-2xl shadow-xl border border-white flex flex-col items-center justify-center gap-2 animate-[pulse_4s_infinite] z-20">
              <div className="bg-blue-50 p-3 rounded-full">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">Your Data</p>
                <p className="text-[10px] text-slate-500">is 100% Protected</p>
              </div>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM BAR (Quick Services) ================= */}
        <div className={`mt-12 lg:mt-16 w-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-4 border border-slate-50 transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 divide-x divide-transparent lg:divide-slate-100">
            
            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                <UserSearch className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">Find Doctors</h4>
                <p className="text-[11px] text-slate-500">Browse specialists near you</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors hidden sm:block" />
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                <CalendarPlus className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">Book Appointment</h4>
                <p className="text-[11px] text-slate-500">Schedule appointments with ease</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors hidden sm:block" />
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="bg-purple-50 text-purple-600 p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">Video Consultation</h4>
                <p className="text-[11px] text-slate-500">Consult doctors from home</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors hidden sm:block" />
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="bg-orange-50 text-orange-600 p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">Lab Tests</h4>
                <p className="text-[11px] text-slate-500">Book tests & get reports online</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors hidden sm:block" />
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="bg-rose-50 text-rose-600 p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">Medicines</h4>
                <p className="text-[11px] text-slate-500">Order medicines online</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors hidden sm:block" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}