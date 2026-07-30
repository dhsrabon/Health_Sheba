'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  FileText, 
  Settings, 
  LogOut, 
  HeartPulse,
  Users
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); 

  const [userName, setUserName] = useState('Loading...');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.name);
          // রোলটি ছোট হাতের অক্ষরে সেভ করছি যাতে চেক করতে সুবিধা হয়
          setUserRole(data.role?.toLowerCase() || ''); 
        }
      } catch (error) {
        console.error("Failed to load user info");
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  // 🟢 ইউজার রোল অনুযায়ী ডাইনামিক মেনু তৈরি করা হচ্ছে
  const getSidebarLinks = () => {
    // যদি ইউজার স্টাফ হয় (আপনার স্ক্রিনশটে বানান stuff ছিল, তাই দুটোর জন্যই চেক রাখা হলো)
    if (userRole === 'staff' || userRole === 'stuff') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarCheck },
        { name: 'Patient Records', href: '/dashboard/staff/patients', icon: Users }, // স্টাফদের নতুন পেজ
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ];
    }

    // 🟢 যদি ইউজার পেশেন্ট বা অন্য কেউ হয় (ডিফল্ট মেনু)
    return [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarCheck },
      { name: 'Medical Records', href: '/dashboard/records', icon: FileText }, // পেশেন্টদের পেজ
      { name: 'Prescriptions', href: '/dashboard/patient/prescriptions', icon: FileText },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];
  };

  const sidebarLinks = getSidebarLinks();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-100 h-full">
      <div className="h-20 flex items-center px-6 border-b border-gray-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Health_Sheba</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm uppercase">
            {userName !== 'Loading...' ? userName.charAt(0) : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}