'use client';

import { Popover, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { 
  HeartPulse, 
  Stethoscope, 
  Brain, 
  Baby, 
  User, 
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  BrainCircuit
} from 'lucide-react';

const specialties = [
  { name: 'Cardiology', description: 'Heart & Blood Vessels', href: '/specialties/cardiology', icon: HeartPulse },
  { name: 'Neurology', description: 'Brain & Nervous System', href: '/specialties/neurology', icon: Brain },
  { name: 'Pediatrics', description: 'Infants & Children', href: '/specialties/pediatrics', icon: Baby },
  { name: 'General Surgery', description: 'Comprehensive Care', href: '/specialties/surgery', icon: Stethoscope },
];

export default function Navbar() {
  const { scrollDirection, isTop } = useScrollDirection();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardRoute, setDashboardRoute] = useState('/dashboard/patient');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'Doctor') {
          setDashboardRoute('/dashboard/doctor');
        } else if (user.role === 'Admin') {
          setDashboardRoute('/dashboard/admin');
        } else {
          setDashboardRoute('/dashboard/patient');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrollDirection === 'down' && !isTop ? '-translate-y-full' : 'translate-y-0'
      } ${
        isTop 
          ? 'bg-white/80 py-4' 
          : 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' 
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* 🔴 নতুন লোগো সেকশনটি এখানে মার্জ করা হয়েছে */}
          <div className="flex justify-start lg:w-0 lg:flex-1 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo Icon with Pulse Animation */}
              <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:-translate-y-0.5 transition-all duration-300">
                <HeartPulse className="h-6 w-6 text-white group-hover:animate-pulse" strokeWidth={2.5} />
                {/* Active Green Dot */}
                <div className="absolute -top-1 -right-1 bg-white p-0.5 rounded-full">
                  <div className="bg-green-500 w-2.5 h-2.5 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tighter flex items-baseline">
                  <span className="text-slate-900">Health</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 ml-0.5">
                    Sheba
                  </span>
                  <span className="text-blue-600 text-3xl leading-none font-black">.</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-1">
                  Digital Healthcare
                </span>
              </div>
            </Link>
          </div>
          {/* 🔴 লোগো সেকশন শেষ */}

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link href="/" className="px-3 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
              Home
            </Link>

          
            <Link href="/find-doctor" className="px-3 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all whitespace-nowrap">
              Find a Doctor
            </Link>

            <Link href="/symptom-checker" className="flex items-center gap-1.5 px-3 py-2 ml-1 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-all whitespace-nowrap">
              <BrainCircuit className="w-4 h-4" />
              AI Symptom Checker
            </Link>
          </nav>

          <div className="hidden md:flex items-center justify-end flex-1 lg:w-0 gap-3">

            {isLoggedIn ? (
              <Link href={dashboardRoute} className="flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 transition-all whitespace-nowrap bg-blue-50 border border-blue-100 px-2 py-1.5 pr-4 rounded-full hover:shadow-sm hover:border-blue-200">
                <div className="bg-blue-600 p-1.5 rounded-full shadow-sm">
                  <LayoutDashboard className="h-4 w-4 text-white" />
                </div>
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-all whitespace-nowrap bg-white border border-gray-100 px-2 py-1.5 pr-4 rounded-full hover:shadow-sm hover:border-gray-200">
                <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-blue-50">
                  <User className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                </div>
                Sign In
              </Link>
            )}

            <Link 
              href="/dashboard/patient/book-appointment"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 whitespace-nowrap"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Appointment
            </Link>
            
          </div>
        </div>
      </div>
    </header>
  );
}