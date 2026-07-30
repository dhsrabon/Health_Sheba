'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Clock, User, Loader2, FileText, CheckCircle, XCircle } from 'lucide-react';

interface Appointment {
  _id: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  patientId: { name: string; email: string };
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null); // কোন আইডি আপডেট হচ্ছে তা ট্র্যাক করার জন্য

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        const res = await fetch(`${apiUrl}/appointments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error("Failed to load appointments");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // 🔄 স্ট্যাটাস আপডেট করার ফাংশন
  const handleStatusUpdate = async (apptId: string, newStatus: string) => {
    setUpdatingId(apptId);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const res = await fetch(`${apiUrl}/appointments/${apptId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // UI-তে রিয়েল-টাইম আপডেট দেখানো (পেজ রিলোড ছাড়াই)
        setAppointments((prev) => 
          prev.map((appt) => 
            appt._id === apptId ? { ...appt, status: newStatus } : appt
          )
        );
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Server error while updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  // স্ট্যাটাস অনুযায়ী কালার বের করার ফাংশন
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">{status}</span>;
      case 'Completed':
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {status}</span>;
      case 'Cancelled':
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> {status}</span>;
      default:
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-100">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-purple-600" />
          Patient Appointments
        </h1>
        <p className="text-gray-500 text-sm mt-1">View and manage scheduled visits from your patients.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
          <p className="text-gray-500 text-sm">Loading schedule...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-500">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium">No patient appointments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Left Side: Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {appt.patientId?.name || 'Patient'}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> {appt.date}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {appt.time}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" /> Symptoms/Reason: <span className="font-normal text-gray-600">{appt.reason}</span>
                </p>
              </div>

              {/* Right Side: Actions / Status */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                {getStatusBadge(appt.status)}
                
                {/* 
                  স্ট্যাটাস যদি Scheduled থাকে, শুধুমাত্র তখনই আপডেট করার বাটনগুলো দেখাবে।
                  Completed বা Cancelled হয়ে গেলে আর বাটন দেখাবে না। 
                */}
                {appt.status === 'Scheduled' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusUpdate(appt._id, 'Completed')}
                      disabled={updatingId === appt._id}
                      className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {updatingId === appt._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Mark Done
                    </button>
                    
                    <button
                      onClick={() => handleStatusUpdate(appt._id, 'Cancelled')}
                      disabled={updatingId === appt._id}
                      className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {updatingId === appt._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                      Cancel
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}