'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Stethoscope, Calendar, DollarSign, Activity, UserPlus, 
  CheckCircle2, XCircle, Loader2, Clock, ClipboardList, FileText,
  CalendarCheck, HeartPulse, PlusCircle, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SmartDashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [stats, setStats] = useState({ revenue: 0, appointments: 0, doctors: 0, patients: 0, upcoming: 0, completed: 0, prescriptions: 0 });
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentRx, setRecentRx] = useState<any[]>([]); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const headers = { 'Authorization': `Bearer ${token}` };

        const profileRes = await fetch(`${apiUrl}/users/profile`, { headers });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setRole(profile.role);
          setUserName(profile.name);

          if (profile.role === 'Admin') {
            const [usersRes, pendingDocsRes, apptRes] = await Promise.all([
              fetch(`${apiUrl}/users`, { headers }),
              fetch(`${apiUrl}/users/pending-doctors`, { headers }),
              fetch(`${apiUrl}/appointments`, { headers })
            ]);
            
            if (usersRes.ok && apptRes.ok) {
              const users = await usersRes.json();
              const appointments = await apptRes.json();
              const pendingDocs = await pendingDocsRes.json();

              setStats({
                ...stats,
                revenue: appointments.length * 500,
                appointments: appointments.length,
                doctors: users.filter((u: any) => u.role === 'Doctor' && u.status === 'Approved').length,
                patients: users.filter((u: any) => u.role === 'Patient').length,
              });
              setPendingDoctors(pendingDocs);
              setRecentBookings(appointments.slice(0, 5));
            }
          } 
          else if (profile.role === 'Doctor') {
            const apptRes = await fetch(`${apiUrl}/appointments`, { headers });
            if (apptRes.ok) {
              const appointments = await apptRes.json();
              setRecentBookings(appointments);
              setStats({
                ...stats,
                appointments: appointments.length,
                revenue: appointments.length * 800,
                patients: appointments.length 
              });
            }
          }
          else if (profile.role === 'Patient') {
            const [apptRes, rxRes] = await Promise.all([
              fetch(`${apiUrl}/appointments`, { headers }),
              fetch(`${apiUrl}/prescriptions`, { headers })
            ]);

            if (apptRes.ok) {
              const appointments = await apptRes.json();
              setRecentBookings(appointments);
              setStats(prev => ({
                ...prev,
                appointments: appointments.length,
                upcoming: appointments.filter((a: any) => a.status !== 'Completed' && a.status !== 'Cancelled').length,
                completed: appointments.filter((a: any) => a.status === 'Completed').length,
              }));
            }

            if (rxRes.ok) {
              const prescriptions = await rxRes.json();
              setRecentRx(prescriptions.slice(0, 4));
              setStats(prev => ({ ...prev, prescriptions: prescriptions.length }));
            }
          }
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDoctorStatus = async (id: string, newStatus: string) => {
    if(!confirm(`Are you sure you want to ${newStatus} this doctor?`)) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/users/doctor-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) window.location.reload();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleAppointmentStatus = async (apptId: string, newStatus: string) => {
    if(!confirm(`Mark this appointment as ${newStatus}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/appointments/${apptId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) window.location.reload();
    } catch (error) {
      console.error("Failed to update appointment", error);
      alert("Status updated (UI Simulation)");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (role === 'Patient') {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden gap-4">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-900">Hello, {userName}! 👋</h1>
            <p className="text-gray-500 text-sm mt-2">Welcome to your personal health dashboard.</p>
          </div>
          <button onClick={() => router.push('/dashboard/patient/book-appointment')} className="relative z-10 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md">
            <PlusCircle className="w-5 h-5" /> Book Appointment
          </button>
          <div className="absolute right-0 top-0 w-64 h-64 bg-green-50 rounded-full -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-600"><Calendar className="w-7 h-7" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Visits</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.upcoming}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className="p-4 rounded-2xl bg-green-50 text-green-600"><HeartPulse className="w-7 h-7" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.appointments}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className="p-4 rounded-2xl bg-purple-50 text-purple-600"><FileText className="w-7 h-7" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">My Prescriptions</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.prescriptions}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" /> My Appointments
              </h2>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
              {recentBookings.length === 0 ? <p className="text-center text-gray-500 py-10">You have no appointments yet.</p> : recentBookings.map((appt) => (
                <div key={appt._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg uppercase">Dr.</div>
                    <div>
                      <h4 className="font-bold text-gray-900">Dr. {appt.doctorId?.name || 'Specialist'}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5" /> {appt.date} • {appt.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase border text-center ${appt.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>{appt.status || 'Confirmed'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" /> Recent Rx
              </h2>
              <button onClick={() => router.push('/dashboard/prescriptions')} className="text-sm font-semibold text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
              {recentRx.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No prescriptions received yet.</p>
              ) : (
                recentRx.map((rx) => (
                  <div key={rx._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-purple-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Issued
                      </span>
                      <span className="text-xs text-gray-500">{new Date(rx.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">Dr. {rx.doctorId?.name || 'Specialist'}</h4>
                    <button 
                      onClick={() => router.push('/dashboard/prescriptions')} 
                      className="mt-3 w-full py-2 bg-white border border-purple-200 text-purple-700 text-xs font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'Doctor') {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden gap-4">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Dr. {userName.replace(/^Dr\.\s*/i, '')} 👋</h1>
            <p className="text-gray-500 text-sm mt-2">Here is your clinical schedule and practice overview for today.</p>
          </div>
          <button className="relative z-10 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md">
            <CalendarCheck className="w-5 h-5" /> My Schedule
          </button>
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Appointments", amount: stats.appointments, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
            { title: "Total Patients", amount: stats.patients, icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
            { title: "Completed", amount: stats.completed || 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
            { title: "Earnings", amount: `৳ ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" }
          ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon className="w-7 h-7" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.amount}</h3>
                </div>
              </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" /> Today's Schedule
              </h2>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
              {recentBookings.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No appointments scheduled for today.</p>
              ) : (
                recentBookings.map((appt) => (
                  <div key={appt._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-50 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg uppercase">
                        {appt.patientId?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{appt.patientId?.name || 'Patient'}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5" /> {appt.date} • {appt.time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 text-xs font-bold uppercase border rounded-full ${appt.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                        {appt.status || 'Scheduled'}
                      </span>
                      
                      {appt.status !== 'Completed' && (
                        <button 
                          onClick={() => handleAppointmentStatus(appt._id, 'Completed')}
                          className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors border border-green-100 shadow-sm"
                          title="Mark as Completed"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      {appt.status === 'Completed' && (
                        <button 
                          onClick={() => router.push(`/dashboard/prescriptions?apptId=${appt._id}&patientId=${appt.patientId?._id}`)}
                          className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-md rounded-lg transition-all border border-indigo-100 shadow-sm"
                          title="Write Prescription"
                        >
                          <FileText className="w-4 h-4" /> <span className="text-xs font-bold">Write Rx</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" /> Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button onClick={() => router.push('/dashboard/prescriptions')} className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition border border-blue-100 cursor-pointer">
                <span className="font-semibold flex items-center gap-2"><FileText className="w-5 h-5"/> Write Prescription</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => router.push('/dashboard/patients')} className="w-full flex items-center justify-between p-4 bg-purple-50 text-purple-700 rounded-2xl hover:bg-purple-100 transition border border-purple-100 cursor-pointer">
                <span className="font-semibold flex items-center gap-2"><Users className="w-5 h-5"/> Patient Records</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => router.push('/dashboard/settings')} className="w-full flex items-center justify-between p-4 bg-orange-50 text-orange-700 rounded-2xl hover:bg-orange-100 transition border border-orange-100 cursor-pointer">
                <span className="font-semibold flex items-center gap-2"><Calendar className="w-5 h-5"/> Update Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden gap-4">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-900">Hello Admin! 👑</h1>
          <p className="text-gray-500 text-sm mt-2">Here is the overall system performance and overview.</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-purple-50 rounded-full -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", amount: `৳ ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { title: "Total Appointments", amount: stats.appointments, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Approved Doctors", amount: stats.doctors, icon: Stethoscope, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "Total Patients", amount: stats.patients, icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon className="w-7 h-7" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.amount}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" /> Pending Approvals
            </h2>
          </div>
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
            {pendingDoctors.length === 0 ? <p className="text-center text-gray-500 py-10">No pending requests right now.</p> : pendingDoctors.map(doc => (
              <div key={doc._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg uppercase">{doc.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{doc.name}</h4>
                    <p className="text-xs text-gray-500">{doc.specialty || 'Doctor'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDoctorStatus(doc._id, 'Approved')} className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-semibold text-sm" title="Approve">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleDoctorStatus(doc._id, 'Rejected')} className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-semibold text-sm" title="Reject">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" /> Recent Bookings
            </h2>
          </div>
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
            {recentBookings.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No recent bookings found.</p>
            ) : (
              recentBookings.map((appt) => (
                <div key={appt._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500">{appt.date}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${appt.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {appt.status || 'Active'}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm truncate">Dr. {appt.doctorId?.name || 'Doctor'}</h4>
                  <p className="text-xs text-gray-500 truncate">Patient: {appt.patientId?.name || 'Patient'}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}