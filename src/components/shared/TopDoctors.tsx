'use client';

import { useState, useEffect } from 'react';
import { Star, Building2, Calendar, ArrowRight, Loader2, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation'; // 🔴 রিডাইরেক্ট করার জন্য ইমপোর্ট করা হলো

interface Doctor {
  _id: string;
  name: string;
  specialty?: string;
  hospitalName?: string;
  chamberNo?: string;
}

export default function TopDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // 🔴 রাউটার ইনিশিয়ালাইজ

  // 🔄 ডাটাবেজ থেকে রিয়েল অ্যাপ্রুভড ডাক্তারদের নিয়ে আসা
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/users/doctors`);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error("Failed to load doctors", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // 🛡️ লগইন স্ট্যাটাস চেক করে রাউটিং করার ফাংশন
  const handleBookingClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // টোকেন থাকলে সরাসরি বুকিং পেজে যাবে
      router.push('/dashboard/patient/book-appointment');
    } else {
      // টোকেন না থাকলে লগইন পেজে যাবে
      router.push('/login');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Top Rated Specialists</h2>
          <p className="text-gray-500 text-sm mt-1">Find and book appointments with our highly recommended doctors.</p>
        </div>
        <button 
          onClick={handleBookingClick}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer"
        >
          See all doctors <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-500 shadow-sm">
          <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-900">No approved specialists available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((doc) => {
            const initials = doc.name ? doc.name.replace('Dr.', '').trim().charAt(0) : 'D';

            return (
              <div 
                key={doc._id} 
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col items-center text-center justify-between"
              >
                <div>
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase mx-auto mb-4">
                    {initials}
                  </div>

                  <h3 className="font-bold text-lg text-gray-900">
                    Dr. {doc.name.replace(/^Dr\.\s*/i, '')}
                  </h3>

                  <p className="text-sm text-blue-600 font-medium mt-0.5">
                    {doc.specialty || 'General Specialist'}
                  </p>

                  <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-600 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                  </div>

                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-2">
                    <Building2 className="w-3.5 h-3.5" /> 
                    {doc.hospitalName ? `${doc.hospitalName} (${doc.chamberNo || 'Room N/A'})` : 'MediDesk Clinic'}
                  </p>
                </div>

                <div className="w-full mt-6 pt-4 border-t border-gray-50">
                  {/* 🔴 এখানে Link এর বদলে onClick ইভেন্ট বসানো হয়েছে */}
                  <button
                    onClick={handleBookingClick}
                    className="w-full py-3 px-4 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Calendar className="w-4 h-4" /> Book Appointment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}