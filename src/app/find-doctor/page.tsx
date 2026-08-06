'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Stethoscope, CalendarDays, Clock, Filter, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  image?: string;
  hospitalName?: string;
  chamberNo?: string;
  consultationFee: number;
  availability: { day: string; slots: string[] }[];
}

export default function FindDoctorPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch('/api/users?role=doctor', { headers });
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const uniqueSpecialties = Array.from(new Set(doctors.map(d => d.specialty).filter(Boolean)));
  const uniqueHospitals = Array.from(new Set(doctors.map(d => d.hospitalName).filter(Boolean)));
  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesName = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? doc.specialty === selectedSpecialty : true;
    const matchesHospital = selectedHospital ? doc.hospitalName === selectedHospital : true;
    const matchesDay = selectedDay ? doc.availability?.some(a => a.day === selectedDay && a.slots.length > 0) : true;
    
    return matchesName && matchesSpecialty && matchesHospital && matchesDay;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Find Your Specialist</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Book appointments with the best doctors in top hospitals. Filter by specialty, hospital, or available days.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search doctor by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-gray-700 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Stethoscope className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <select 
                value={selectedSpecialty} 
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer text-sm font-medium text-gray-700"
              >
                <option value="">All Specialties</option>
                {uniqueSpecialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <select 
                value={selectedHospital} 
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer text-sm font-medium text-gray-700"
              >
                <option value="">All Hospitals</option>
                {uniqueHospitals.map(hosp => <option key={hosp} value={hosp}>{hosp}</option>)}
              </select>
            </div>

            <div className="relative">
              <CalendarDays className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <select 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer text-sm font-medium text-gray-700"
              >
                <option value="">Any Day</option>
                {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No doctors found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedSpecialty(''); setSelectedHospital(''); setSelectedDay('');}}
              className="mt-4 text-blue-600 font-semibold hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doc => (
              <div key={doc._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full">
                
                <div className="space-y-5">
                  {/* 🟢 আপডেট করা প্রিমিয়াম এভাটার ও ইনফো সেকশন */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl overflow-hidden border-4 border-white shadow-md">
                      {doc.image ? (
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        doc.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors">
                        Dr. {doc.name}
                      </h3>
                      <p className="text-sm font-semibold text-blue-500 mt-1">{doc.specialty || 'General Physician'}</p>
                    </div>
                  </div>

                  {/* ডিটেইলস সেকশন */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {doc.hospitalName && (
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 shrink-0 text-gray-400 mt-0.5" />
                        <span className="leading-tight">{doc.hospitalName} {doc.chamberNo && <span className="text-gray-400">| Room: {doc.chamberNo}</span>}</span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <CalendarDays className="w-4 h-4 shrink-0 text-gray-400 mt-0.5" />
                      <div className="flex flex-wrap gap-1.5">
                        {doc.availability?.filter(a => a.slots.length > 0).length > 0 ? (
                          doc.availability.filter(a => a.slots.length > 0).map((a, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-600">
                              {a.day.slice(0,3)}
                            </span>
                          ))
                        ) : (
                          <span className="text-red-400 text-xs font-medium">Not Available</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="w-4 h-4 shrink-0 text-gray-400" />
                      <span className="font-bold text-gray-900 text-base">৳ {doc.consultationFee || 500} <span className="text-gray-400 font-medium text-xs">/ visit</span></span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => router.push('/dashboard/patient/book-appointment')}
                  className="mt-6 w-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Book Appointment <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}