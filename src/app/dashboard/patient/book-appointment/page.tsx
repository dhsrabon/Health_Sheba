'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, FileText, Loader2, CheckCircle2, CreditCard 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  availability: { day: string; slots: string[] }[];
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [dayName, setDayName] = useState('');

  // 🟢 ডাক্তারদের লিস্ট আনা
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        const res = await fetch(`${apiUrl}/users/doctors`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const approvedDoctors = await res.json();
          setDoctors(approvedDoctors);
        }
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // 🟢 তারিখ অনুযায়ী স্লট বের করা
  useEffect(() => {
    if (selectedDoctorId && date) {
      const doctor = doctors.find(d => d._id === selectedDoctorId);
      if (doctor && doctor.availability) {
        
        const selectedDateObj = new Date(date + 'T00:00:00');
        const calculatedDay = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' }); 
        setDayName(calculatedDay);

        const dayAvailability = doctor.availability.find(a => a.day === calculatedDay);
        
        if (dayAvailability && dayAvailability.slots.length > 0) {
          setAvailableSlots(dayAvailability.slots);
        } else {
          setAvailableSlots([]); 
        }
      }
    } else {
      setAvailableSlots([]);
      setDayName('');
    }
    setSelectedSlot(''); 
  }, [selectedDoctorId, date, doctors]);

  const selectedDoctorInfo = doctors.find(d => d._id === selectedDoctorId);

  // 💳 পেমেন্ট এবং বুকিং হ্যান্ডেলার
  const handlePaymentAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) return alert("Please select a doctor!");
    if (!date) return alert("Please select a date!");
    if (!selectedSlot) return alert("Please select a time slot!");

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const totalFee = selectedDoctorInfo?.consultationFee || 500;
      const advancePayment = totalFee * 0.20; // ২০% অগ্রিম
      const dueAmount = totalFee - advancePayment; // ৮০% বকেয়া

      // ডাটাবেজে সেভ করার জন্য লোকাল স্টোরেজে ডিটেইলস রাখা
      localStorage.setItem('pendingAppointment', JSON.stringify({
        doctorId: selectedDoctorId,
        date: date,
        time: selectedSlot,
        reason: reason,
        totalFee: totalFee,
        paidAmount: advancePayment,
        dueAmount: dueAmount,
        status: 'Partially Paid'
      }));

      // পেমেন্ট রিকোয়েস্ট পাঠানো
      const res = await fetch(`${apiUrl}/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          doctorName: selectedDoctorInfo?.name || 'Unknown Doctor',
          advanceAmount: advancePayment, 
          totalFee: totalFee,
          appointmentDate: date 
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; 
      } else {
        alert("Payment initialization failed!");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong while connecting to payment gateway.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  // বাটনে দেখানোর জন্য অগ্রিম টাকার হিসাব
  const advanceFeeToShow = selectedDoctorInfo ? selectedDoctorInfo.consultationFee * 0.20 : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
          <Calendar className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book a New Appointment</h1>
          <p className="text-gray-500 text-sm">Select your preferred doctor and a convenient time slot.</p>
        </div>
      </div>

      <form onSubmit={handlePaymentAndBook} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        
        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Select Doctor</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select 
              required
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>-- Choose a Doctor --</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.name} - {doc.specialty || 'General'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Select Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="date" 
              required
              value={date}
              min={new Date().toISOString().split('T')[0]} 
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Available Time Slots</label>
          
          {!selectedDoctorId || !date ? (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-gray-500 text-sm">
              Please select a doctor and date to view available slots.
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center text-red-600 text-sm font-semibold">
              Sorry, Dr. {selectedDoctorInfo?.name} is not available on {dayName}s. Please choose another date.
            </div>
          ) : (
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
              <p className="text-xs text-blue-600 font-bold mb-3 uppercase tracking-wider">Slots for {dayName}</p>
              <div className="flex flex-wrap gap-3">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      selectedSlot === slot 
                        ? 'bg-blue-600 text-white shadow-md scale-105' 
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm'
                    }`}
                  >
                    <Clock className="w-4 h-4" /> {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for Visit / Symptoms</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea 
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* 🔴 স্মার্ট পেমেন্ট সেকশন (ডাক্তার বা স্লট সিলেক্ট না থাকলে বাটন গাইড করবে) */}
        <div className="pt-4 mt-4 border-t border-gray-100 space-y-4">
          
          {/* টাকার ছোট্ট হিসাব - শুধুমাত্র ডাক্তার সিলেক্ট করা থাকলেই দেখাবে */}
          {selectedDoctorInfo && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-600 font-semibold">Total Consultation Fee:</span>
              <span className="text-gray-900 font-bold text-base">৳ {selectedDoctorInfo.consultationFee}</span>
            </div>
          )}

          {/* স্মার্ট পেমেন্ট বাটন */}
          <button 
            type="submit" 
            disabled={isSubmitting || !selectedDoctorId || !date || !selectedSlot}
            className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
              !selectedDoctorId || !date || !selectedSlot 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : !selectedDoctorId ? (
              <span>Please Select a Doctor First</span>
            ) : !date ? (
              <span>Please Select a Date</span>
            ) : !selectedSlot ? (
              <span>Please Select a Time Slot</span>
            ) : (
              <>
                <CreditCard className="w-5 h-5" /> 
                Pay 20% Advance (৳ {advanceFeeToShow})
              </>
            )}
          </button>

          {/* বকেয়া (Due) টাকার মেসেজ - শুধুমাত্র ডাক্তার সিলেক্ট করা থাকলে দেখাবে */}
          {selectedDoctorInfo && (
            <p className="text-center text-sm text-gray-500 font-medium">
              Remaining Due <span className="text-red-500 font-bold">৳ {selectedDoctorInfo.consultationFee - advanceFeeToShow}</span> to be paid at the clinic.
            </p>
          )}
        </div>

      </form>
    </div>
  );
}