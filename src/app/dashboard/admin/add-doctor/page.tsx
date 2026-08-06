'use client';

import { useState } from 'react';
import { 
  UserPlus, Mail, Lock, Phone, Stethoscope, Building, 
  Banknote, Briefcase, Loader2, CheckCircle2, CalendarDays, 
  Clock, Plus, Trash2, Image as ImageIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const DAYS_OF_WEEK = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function AddDoctorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    image: '', // 🟢 এখানে আমরা কনভার্ট করা Base64 ছবি রাখব
    specialty: '',
    experience: '',
    hospitalName: '',
    consultationFee: ''
  });

  const [fileName, setFileName] = useState(''); // ছবি সিলেক্ট হলে নাম দেখানোর জন্য

  const [availability, setAvailability] = useState(
    DAYS_OF_WEEK.map(day => ({ day, slots: [] as string[] }))
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔴 স্মার্ট ট্রিকস: ছবি ব্রাউজ করে Base64 (Text) এ কনভার্ট করা
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name); // ফাইলের নাম সেভ করা হচ্ছে দেখানোর জন্য
      const reader = new FileReader();
      reader.onloadend = () => {
        // ছবিকে স্ট্রিং/টেক্সট এ রূপান্তর করে formData তে রাখা হচ্ছে
        setFormData({ ...formData, image: reader.result as string });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://healthsheba-server.vercel.app/api';

      // 🟢 JSON হিসেবেই ডাটা যাচ্ছে (কোনো এরর আসবে না!)
      const res = await fetch(`${apiUrl}/users/add-doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          experience: Number(formData.experience),
          consultationFee: Number(formData.consultationFee),
          availability: availability.filter(a => a.slots.length > 0)
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('Successfully added a new doctor!');
        setFormData({
          name: '', email: '', password: '', phone: '', image: '', specialty: '', experience: '', hospitalName: '', consultationFee: ''
        });
        setFileName('');
        setAvailability(DAYS_OF_WEEK.map(day => ({ day, slots: [] })));
      } else {
        setErrorMessage(data.message || 'Failed to add doctor.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
          <p className="text-sm text-gray-500">Register a new doctor to the hospital system.</p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" /> {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          {errorMessage}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <div className="relative">
                <UserPlus className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Dr. John Doe" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@example.com" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Temporary Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input required type="text" name="password" value={formData.password} onChange={handleChange} placeholder="Set a strong password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+8801XXXXXXXXX" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            {/* 🟢 Browse Image Option */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Profile Image (Optional)</label>
              <div className="relative flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all
                  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" 
                />
              </div>
              {fileName && <p className="text-xs font-medium text-emerald-600 mt-1">✓ Selected: {fileName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Specialty</label>
              <div className="relative">
                <Stethoscope className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input required type="text" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="e.g. Cardiologist" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Experience (Years)</label>
              <div className="relative">
                <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input required type="number" min="0" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Current Hospital / Clinic</label>
              <div className="relative">
                <Building className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input required type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="e.g. Dhaka Medical College" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Consultation Fee (৳)</label>
              <div className="relative">
                <Banknote className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input required type="number" min="0" name="consultationFee" value={formData.consultationFee} onChange={handleChange} placeholder="e.g. 1000" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>
          </div>

          {/* Weekly Schedule Section */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Weekly Schedule & Time Slots</h2>
            </div>
            <div className="space-y-4">
              {availability.map((dayObj, dayIndex) => (
                <div key={dayObj.day} className="flex flex-col md:flex-row md:items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="w-32 flex items-center gap-2 pt-1">
                    <span className="font-bold text-gray-700">{dayObj.day}</span>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {dayObj.slots.length === 0 ? (
                      <p className="text-sm text-gray-400 italic py-1">No slots added</p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {dayObj.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1 pr-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                            <Clock className="w-4 h-4 text-gray-400 ml-2" />
                            <input 
                              type="text" 
                              value={slot}
                              onChange={(e) => updateSlot(dayIndex, slotIndex, e.target.value)}
                              placeholder="e.g. 10:00 AM"
                              className="w-24 px-2 py-1 outline-none text-sm font-semibold text-gray-700 bg-transparent"
                            />
                            <button type="button" onClick={() => removeSlot(dayIndex, slotIndex)} className="text-red-400 hover:text-red-600 p-1 transition-colors">
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

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 text-lg"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              {isLoading ? 'Adding Doctor...' : 'Register Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}