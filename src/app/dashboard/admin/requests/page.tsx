'use client';

import { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, Loader2, Mail, BriefcaseMedical, 
  CircleDollarSign, Stethoscope, Building2, Hash, Eye, X 
} from 'lucide-react';

interface DoctorRequest {
  _id: string;
  name: string;
  email: string;
  specialty?: string;
  experience?: string;
  consultationFee?: number;
  hospitalName?: string;
  chamberNo?: string;
  status: string;
}

export default function DoctorRequestsPage() {
  const [requests, setRequests] = useState<DoctorRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Modal-এর জন্য State
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRequest | null>(null);

  // 🔄 ব্যাকএন্ড থেকে পেন্ডিং রিকোয়েস্টগুলো নিয়ে আসা
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://healthsheba-server.vercel.app/api';
        
        const res = await fetch(`${apiUrl}/users/pending-doctors`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // ✅/❌ ডাক্তারের স্ট্যাটাস আপডেট করা (Approve বা Reject)
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://healthsheba-server.vercel.app/api';
      
      const res = await fetch(`${apiUrl}/users/doctor-status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // সফল হলে লিস্ট থেকে ওই ডাক্তারকে সরিয়ে দেওয়া হবে
        setRequests(prev => prev.filter(req => req._id !== id));
        // Modal বন্ধ করে দেওয়া হবে
        setSelectedDoctor(null);
      } else {
        alert('Failed to update status!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Server error occurred.');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 🌟 Header Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Doctor Registration Requests
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve new doctors joining the platform.</p>
        </div>
        <div className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-sm border border-orange-100">
          {requests.length} Pending
        </div>
      </div>

      {/* 📋 Requests List (Compact Cards) */}
      {requests.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No pending requests</h3>
          <p className="text-gray-500 text-sm">All doctor registrations have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requests.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-6 flex-1 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase mx-auto mb-4">
                  {doctor.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-blue-600 font-medium mb-1">{doctor.specialty || 'Specialty Not Added'}</p>
              </div>

              {/* View Details Button */}
              <div className="border-t border-gray-100 p-3">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" /> View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🖼️ Modal (Pop-up) for Doctor Details */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Review Application</h2>
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Details) */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase shrink-0">
                  {selectedDoctor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{selectedDoctor.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                    <Mail className="w-4 h-4" /> {selectedDoctor.email}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5"/> Specialty</p>
                    <p className="font-semibold text-gray-900">{selectedDoctor.specialty || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><BriefcaseMedical className="w-3.5 h-3.5"/> Experience</p>
                    <p className="font-semibold text-gray-900">{selectedDoctor.experience ? `${selectedDoctor.experience} Years` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Building2 className="w-3.5 h-3.5"/> Hospital</p>
                    <p className="font-semibold text-gray-900">{selectedDoctor.hospitalName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Hash className="w-3.5 h-3.5"/> Chamber No</p>
                    <p className="font-semibold text-gray-900">{selectedDoctor.chamberNo || 'N/A'}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><CircleDollarSign className="w-3.5 h-3.5"/> Consultation Fee</p>
                  <p className="font-bold text-blue-600 text-lg">${selectedDoctor.consultationFee || 0}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
              <button
                onClick={() => handleStatusUpdate(selectedDoctor._id, 'Rejected')}
                disabled={processingId === selectedDoctor._id}
                className="flex-1 py-3.5 font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" /> Reject
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedDoctor._id, 'Approved')}
                disabled={processingId === selectedDoctor._id}
                className="flex-1 py-3.5 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {processingId === selectedDoctor._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Approve Doctor
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}