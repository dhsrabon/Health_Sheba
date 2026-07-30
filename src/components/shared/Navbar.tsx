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
          
          <div className="flex justify-start lg:w-0 lg:flex-1 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                Health<span className="text-blue-600">Sheba</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link href="/" className="px-3 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
              Home
            </Link>

            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`
                      ${open ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}
                      group inline-flex items-center gap-1 px-3 py-2 text-sm font-bold rounded-full focus:outline-none transition-all
                    `}
                  >
                    <span>Specialties</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-2"
                  >
                    <Popover.Panel className="absolute z-10 -ml-4 mt-4 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                      <div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-gray-100 border border-gray-100">
                        <div className="relative grid gap-2 bg-white/95 backdrop-blur-xl p-4">
                          {specialties.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-start rounded-2xl p-4 hover:bg-gray-50 transition-colors group/item"
                            >
                              <div className="bg-blue-50 p-2.5 rounded-xl group-hover/item:bg-blue-100 group-hover/item:text-blue-700 transition-colors">
                                <item.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                <p className="mt-0.5 text-xs text-gray-500 font-medium">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>

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