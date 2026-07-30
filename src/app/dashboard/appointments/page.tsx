'use client';

import { useState, useEffect, Suspense } from 'react';
import { CalendarDays, Clock, Loader2, FileText, CheckCircle2, X, CreditCard, Wallet } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Appointment {
  _id: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  paymentStatus?: string;
  totalFee?: number;
  paidAmount?: number;
  dueAmount?: number;
  doctorId: { name: string; email: string };
}

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPayingDue, setIsPayingDue] = useState<string | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const fetchAppointments = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Failed to load appointments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const duePaymentStatus = searchParams.get('due_payment');
    const tId = searchParams.get('transaction_id');
    const appId = searchParams.get('appointment_id');

    if (paymentStatus === 'success' && tId) {
      setTransactionId(tId);
      setModalMessage('Your appointment has been successfully booked with an advance payment.');
      setShowSuccessModal(true);
      
      const pendingData = localStorage.getItem('pendingAppointment');
      if (pendingData) {
        const savePaidAppointment = async () => {
          try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            await fetch(`${apiUrl}/appointments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: pendingData
            });
            localStorage.removeItem('pendingAppointment');
            fetchAppointments();
          } catch (err) {
            console.error("Error saving appointment:", err);
          }
        };
        savePaidAppointment();
      }
      window.history.replaceState(null, '', '/dashboard/appointments');
    } 
    else if (duePaymentStatus === 'success' && tId && appId) {
      setTransactionId(tId);
      setModalMessage('Your due amount has been successfully cleared!');
      setShowSuccessModal(true);
      
      const clearDuePayment = async () => {
        try {
          const token = localStorage.getItem('token');
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          await fetch(`${apiUrl}/appointments/${appId}/payment-status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          fetchAppointments();
        } catch (err) {
          console.error("Error updating due payment:", err);
        }
      };
      clearDuePayment();
      window.history.replaceState(null, '', '/dashboard/appointments');
    } else {
      fetchAppointments();
    }
  }, [searchParams]);

  const handlePayDue = async (appointmentId: string, doctorName: string, dueAmount: number) => {
    setIsPayingDue(appointmentId);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${apiUrl}/payments/pay-due`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appointmentId, doctorName, dueAmount })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; 
      } else {
        alert("Failed to initialize due payment.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPayingDue(null);
    }
  };

  const handlePayCash = async (appointmentId: string) => {
    setIsPayingDue(appointmentId);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${apiUrl}/appointments/${appointmentId}/pay-cash`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Successfully selected 'Pay Cash at Clinic'. Please pay the due amount at the clinic reception.");
        fetchAppointments();
      } else {
        alert("Failed to update payment method.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPayingDue(null);
    }
  };

  const formatDate = (isoString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(isoString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10 relative">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-blue-600" /> My Appointments
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : appointments.length === 0 ? (
        <div className="bg-white p-12 text-center text-gray-500 rounded-3xl">No appointments found.</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">
                    Dr. {appt.doctorId?.name || 'Specialist'}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> {formatDate(appt.date)}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {appt.time}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 mt-2">
                  <FileText className="w-4 h-4 text-gray-400" /> Reason: <span className="font-normal text-gray-600">{appt.reason}</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                {appt.paymentStatus === 'Paid' || appt.paymentStatus === 'Fully Paid' ? (
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100 w-full text-center shadow-sm">
                    ✅ Paid
                  </span>
                ) : appt.paymentStatus === 'Pay at Clinic' ? (
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 w-full text-center shadow-sm">
                    💵 Pay Cash at Clinic
                  </span>
                ) : (
                  <>
                    <div className="w-full text-right">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Status: <span className="text-blue-600">{appt.paymentStatus || 'Partially Paid'}</span></p>
                      <p className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        Due: ৳ {appt.dueAmount ?? 400}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full mt-1">
                      <button 
                        onClick={() => handlePayDue(appt._id, appt.doctorId?.name || 'Doctor', appt.dueAmount ?? 400)}
                        disabled={isPayingDue === appt._id}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
                      >
                        {isPayingDue === appt._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                        Pay Due Online
                      </button>
                      
                      <button 
                        onClick={() => handlePayCash(appt._id)}
                        disabled={isPayingDue === appt._id}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 py-2 px-3 rounded-lg border border-gray-200 transition-colors"
                      >
                        <Wallet className="w-3.5 h-3.5" /> or Pay Cash at Clinic
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative">
            <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><X className="w-5 h-5" /></button>
            <div className="flex justify-center mb-6"><div className="bg-green-100 p-4 rounded-full"><CheckCircle2 className="w-16 h-16 text-green-500" /></div></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-500 mb-6 text-sm">{modalMessage}</p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8 text-left">
              <p className="text-xs text-gray-400 mb-1 font-semibold uppercase">Transaction ID</p>
              <p className="font-mono text-xs font-bold text-gray-800 break-all">{transactionId}</p>
            </div>
            <button onClick={() => setShowSuccessModal(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

// 💡 মেইন কম্পোনেন্টকে Suspense দিয়ে Wrap করে দেওয়া হলো
export default function PatientAppointmentsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <AppointmentsContent />
    </Suspense>
  );
}