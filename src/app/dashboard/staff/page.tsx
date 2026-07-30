'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarClock, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Clock,
  X,
  Loader2
} from 'lucide-react';

interface Appointment {
  _id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

export default function StaffDashboard() {
  const [requests, setRequests] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/appointments/pending');
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingAppointments();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });

      if (res.ok) {
        setRequests(requests.filter(req => req._id !== id));
      }
    } catch (error) {
      console.error("Failed to approve appointment", error);
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedRequest(id);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim() || !selectedRequest) return;

    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${selectedRequest}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected', reason: rejectReason })
      });

      if (res.ok) {
        setRequests(requests.filter(req => req._id !== selectedRequest));
        setIsRejectModalOpen(false);
        setRejectReason('');
      }
    } catch (error) {
      console.error("Failed to reject appointment", error);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8 pt-8">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinic Reception & Management 🏥</h1>
        <p className="text-gray-600 mt-1">Manage daily patient queues, appointments, and inquiries.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Today's Queue</p>
            <p className="text-2xl font-bold text-gray-900">24 Patients</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-l-amber-400">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
            <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Offline Payments</p>
            <p className="text-2xl font-bold text-gray-900">$1,250</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pending Appointments</h2>
            <p className="text-sm text-gray-500 mt-1">Review requests and manage doctor schedules.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading requests...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="py-4 px-6 font-medium">Req ID</th>
                  <th className="py-4 px-6 font-medium">Patient Name</th>
                  <th className="py-4 px-6 font-medium">Doctor</th>
                  <th className="py-4 px-6 font-medium">Requested Slot</th>
                  <th className="py-4 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-500">#{req._id.slice(-6)}</td>
                    <td className="py-4 px-6 font-bold text-gray-900">{req.patientName}</td>
                    <td className="py-4 px-6 text-gray-600">{req.doctorName}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{req.date} - {req.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openRejectModal(req._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                        <button 
                          onClick={() => handleApprove(req._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg font-medium transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">
                      No pending appointment requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-500" />
                Reject Appointment
              </h3>
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRejectSubmit} className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                You are rejecting Request <span className="font-bold text-gray-900">#{selectedRequest?.slice(-6)}</span>. 
                Please provide a mandatory explanation for the patient.
              </p>
              
              <textarea
                required
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Type the reason here (e.g., Doctor is on emergency leave)..."
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              />
              
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectReason.trim()}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}