'use client';

import { useState, useEffect } from 'react';
import { 
  Video, 
  Stethoscope,
  CalendarCheck,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  status: string;
  experience: string;
  image: string;
}

export default function EmergencyPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 সরাসরি ব্যাকএন্ডের মেইন API থেকে সব ডাক্তার ফেচ করা হচ্ছে
  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data); // ডাটাবেসের সব ডাক্তার এখানে সেভ হচ্ছে
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-sm font-bold mb-3 border border-blue-200">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              Our Specialists
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              All Available Doctors
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-lg">
              Book an appointment with our experienced doctors.
            </p>
          </div>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-bold text-lg">Loading doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-32 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <p className="text-gray-500 font-bold text-lg">No doctors found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <div key={doc._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
                
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {doc.status || 'Available Now'}
                  </span>
                </div>

                <div className="flex flex-col items-center text-center mt-4">
                  <img 
                    src={doc.image || `https://ui-avatars.com/api/?name=${doc.name.replace(' ', '+')}&background=3b82f6&color=fff`} 
                    alt={doc.name} 
                    className="w-28 h-28 rounded-full border-4 border-gray-50 shadow-md mb-5 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <h3 className="text-xl font-black text-gray-900">{doc.name}</h3>
                  <p className="text-blue-600 font-bold text-sm mt-1 bg-blue-50 px-3 py-1 rounded-full">{doc.specialty}</p>
                  <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5 mt-3">
                    <Stethoscope className="w-4 h-4 text-gray-400" /> {doc.experience || 'Experienced'}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col gap-3">
                  <Link 
                    href={`/book-appointment/${doc._id}`} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
                  >
                    <CalendarCheck className="w-5 h-5" /> Book Appointment
                  </Link>
                  <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-3 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-sm">
                    <Video className="w-5 h-5" /> Online Consult
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}