'use client';

import { useState, useEffect } from 'react';
import { Star, Building2, Calendar, ArrowRight, Loader2, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Doctor {
  _id: string;
  name: string;
  image?: string;
  specialty?: string;
  hospitalName?: string;
  chamberNo?: string;
}

export default function TopDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/users?role=doctor');
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

  const handleBookingClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard/patient/book-appointment');
    } else {
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
          onClick={() => router.push('/find-doctor')}
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
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center text-center justify-between group"
              >
                <div className="w-full">
                  <div className="relative w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black uppercase mx-auto mb-4 overflow-hidden border-4 border-white shadow-md">
                    {doc.image ? (
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      initials
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    Dr. {doc.name.replace(/^Dr\.\s*/i, '')}
                  </h3>

                  <p className="text-sm text-blue-600 font-semibold mt-0.5">
                    {doc.specialty || 'General Specialist'}
                  </p>

                  <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-600 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                  </div>

                  <p className="text-xs text-gray-500 flex flex-col items-center justify-center gap-1 mt-3">
                    <span className="flex items-center gap-1 font-medium"><Building2 className="w-3.5 h-3.5" /> {doc.hospitalName || 'MediDesk Clinic'}</span>
                    {doc.chamberNo && <span className="text-gray-400">Room: {doc.chamberNo}</span>}
                  </p>
                </div>

                <div className="w-full mt-6 pt-4 border-t border-gray-50">
                  <button
                    onClick={handleBookingClick}
                    className="w-full py-3 px-4 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300"
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