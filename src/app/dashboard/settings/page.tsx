'use client';

import { useState, useEffect } from 'react';
import { 
  User, DollarSign, Clock, Save, Loader2, Plus, Trash2, CalendarDays, Upload
} from 'lucide-react';

const DAYS_OF_WEEK = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function SettingsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(''); 
  const [specialty, setSpecialty] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [consultationFee, setConsultationFee] = useState<number>(500);
  
  const [availability, setAvailability] = useState(
    DAYS_OF_WEEK.map(day => ({ day, slots: [] as string[] }))
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://healthsheba-server.vercel.app/api';
        
        const res = await fetch(`${apiUrl}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setRole(data.role);
          setName(data.name || '');
          setPhone(data.phone || '');
          setImage(data.image || ''); 
          setSpecialty(data.specialty || '');
          setHospitalName(data.hospitalName || '');
          setConsultationFee(data.consultationFee || 500);
          
          if (data.availability && data.availability.length > 0) {
            const updatedAvailability = DAYS_OF_WEEK.map(day => {
              const found = data.availability.find((a: any) => a.day === day);
              return found ? { day, slots: found.slots } : { day, slots: [] };
            });
            setAvailability(updatedAvailability);
          }
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🟢 পিসি থেকে ছবি সিলেক্ট করে প্রসেস করার ফাংশন
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        alert("Please select an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSlot = (dayIndex: number) => {
    const newAvail = [...availability];
    newAvail[dayIndex].slots.push('10:00 AM');
    setAvailability(newAvail);
  };

  const updateSlot = (dayIndex: number, slotIndex: number, value: string) => {
    const newAvail = [...availability];
    newAvail[dayIndex].slots[slotIndex] = value;
    setAvailability(newAvail);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const newAvail = [...availability];
    newAvail[dayIndex].slots.splice(slotIndex, 1);
    setAvailability(newAvail);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://healthsheba-server.vercel.app/api';
      
      const payload = {
        name, phone, image, specialty, hospitalName, consultationFee,
        availability: availability.filter(a => a.slots.length > 0)
      };

      const res = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Profile and Schedule updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-blue-100">
          {image ? (
            <img src={image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-500 text-sm">Manage your personal information {role === 'Doctor' && 'and clinical schedule'}.</p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
            </div>
            
            {/* 🟢 পিসি থেকে ছবি সিলেক্ট করার অপশন */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
              <div className="flex items-center gap-4">
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-700 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <Upload className="w-5 h-5" />
                  Browse from PC
                </label>
                <input 
                  type="file" 
                  id="image-upload" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                {image && <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">Image Selected!</span>}
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">Please upload a square image (JPG, PNG). Maximum size: 2MB.</p>
            </div>

          </div>
        </div>

        {role === 'Doctor' && (
          <>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" /> Professional Details & Fees
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Specialty</label>
                  <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Cardiologist" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hospital / Clinic</label>
                  <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="e.g. Dhaka Medical" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Consultation Fee (৳)</label>
                  <input type="number" value={consultationFee} onChange={(e) => setConsultationFee(Number(e.target.value))} required className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-indigo-600" /> Weekly Schedule (Time Slots)
                </h2>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Add your available time slots for each day. Patients will see these slots while booking.</p>

              <div className="space-y-4">
                {availability.map((dayObj, dayIndex) => (
                  <div key={dayObj.day} className="flex flex-col md:flex-row md:items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-32 flex items-center gap-2">
                      <span className="font-bold text-gray-700">{dayObj.day}</span>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      {dayObj.slots.length === 0 ? (
                        <p className="text-sm text-gray-400 italic py-2">No slots added (Off day)</p>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {dayObj.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 pr-2 shadow-sm">
                              <Clock className="w-4 h-4 text-gray-400 ml-2" />
                              <input 
                                type="text" 
                                value={slot}
                                onChange={(e) => updateSlot(dayIndex, slotIndex, e.target.value)}
                                placeholder="e.g. 10:00 AM"
                                className="w-24 px-2 py-1 outline-none text-sm font-semibold text-gray-700"
                              />
                              <button type="button" onClick={() => removeSlot(dayIndex, slotIndex)} className="text-red-400 hover:text-red-600 p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button type="button" onClick={() => addSlot(dayIndex)} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1 shrink-0">
                      <Plus className="w-4 h-4" /> Add Slot
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:bg-blue-400 shadow-lg">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
            {isSaving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}