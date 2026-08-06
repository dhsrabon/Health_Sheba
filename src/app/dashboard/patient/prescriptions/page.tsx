'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Plus, Pill, Calendar, User, Search, 
  ArrowLeft, CheckCircle2, Loader2, Save, Link2, Printer
} from 'lucide-react';

interface Medicine { name: string; dosage: string; duration: string; }
interface Prescription {
  _id: string;
  patientId: { _id: string; name: string };
  doctorId?: { _id: string; name: string };
  appointmentId?: string;
  medicines: Medicine[];
  notes?: string;
  createdAt: string;
}
interface Patient { _id: string; name: string; email: string; }

export default function PrescriptionsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  
  const [prescriptionsList, setPrescriptionsList] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]); 
  
  // 🌟 নতুন স্টেট: ভিউ করার জন্য সিলেক্টেড প্রেসক্রিপশন
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  
  // ফর্ম স্টেট
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [linkedApptId, setLinkedApptId] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([{ name: '', dosage: '', duration: '' }]);
  const [notes, setNotes] = useState('');

  // 🔄 ডাটাবেজ থেকে ডাটা ফেচ করা
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://healthsheba-server.vercel.app/api';
      const headers = { 'Authorization': `Bearer ${token}` };

      const profileRes = await fetch(`${apiUrl}/users/profile`, { headers });
      if (!profileRes.ok) throw new Error("Profile fetch failed");
      const profile = await profileRes.json();
      setRole(profile.role);

      const presRes = await fetch(`${apiUrl}/prescriptions`, { headers });
      if (presRes.ok) {
        const presData = await presRes.json();
        setPrescriptionsList(presData);
      }

      if (profile.role === 'Doctor') {
        const apptRes = await fetch(`${apiUrl}/appointments`, { headers });
        if (apptRes.ok) {
          const appointments = await apptRes.json();
          const patientMap = new Map();
          appointments.forEach((appt: any) => {
            if (appt.patientId && appt.patientId._id) {
              patientMap.set(appt.patientId._id, appt.patientId);
            }
          });
          setPatients(Array.from(patientMap.values()));
        }
      }
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const urlParams = new URLSearchParams(window.location.search);
    const apptId = urlParams.get('apptId');
    const patId = urlParams.get('patientId');

    if (apptId && patId) {
      setIsWriting(true);
      setSelectedPatientId(patId);
      setLinkedApptId(apptId);
    }
  }, []);

  const addMedicineRow = () => setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  const updateMedicine = (index: number, field: string, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field as keyof Medicine]: value };
    setMedicines(updated);
  };

  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return alert("Please select a patient first!");

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://healthsheba-server.vercel.app/api';
      
      const payload = {
        patientId: selectedPatientId,
        appointmentId: linkedApptId,
        medicines: medicines,
        notes: notes
      };

      const res = await fetch(`${apiUrl}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Prescription successfully linked and sent to the patient!");
        setIsWriting(false);
        setSelectedPatientId('');
        setLinkedApptId(null);
        setMedicines([{ name: '', dosage: '', duration: '' }]);
        setNotes('');
        window.history.replaceState(null, '', '/dashboard/prescriptions'); 
        fetchData();
      } else {
        alert("Failed to save prescription. Check backend setup.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* হেডার সেকশন */}
      {!selectedRx && (
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              {role === 'Doctor' ? 'Manage Prescriptions' : 'My Prescriptions'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {role === 'Doctor' ? 'Write and manage patient prescriptions securely.' : 'View and download your digital prescriptions.'}
            </p>
          </div>
          
          {role === 'Doctor' && !isWriting && (
            <button 
              onClick={() => setIsWriting(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" /> Write New
            </button>
          )}
        </div>
      )}

      {/* 📄 ১. ভিউ মোড: ডিজিটাল প্রেসক্রিপশন পেপার */}
      {selectedRx ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 print:hidden">
            <button 
              onClick={() => setSelectedRx(null)} 
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to List
            </button>
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Rx
            </button>
          </div>

          {/* 🖨️ প্রিন্ট করার জন্য মূল প্রেসক্রিপশন ডিজাইন */}
          <div className="p-8 sm:p-12 md:px-16" id="prescription-paper">
            
            {/* Header: Doctor Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-blue-600 pb-6 mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-blue-900">
                  Dr. {selectedRx.doctorId?.name || 'Unknown'}
                </h2>
                <p className="text-gray-500 font-medium mt-1">MBBS, Specialist</p>
              </div>
              <div className="sm:text-right">
                <h3 className="text-xl font-bold text-gray-900">MediDesk E-Clinic</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Date: {new Date(selectedRx.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Patient Details */}
            <div className="bg-blue-50/50 rounded-2xl p-5 mb-8 flex justify-between items-center border border-blue-100">
              <div>
                <p className="text-xs text-blue-500 uppercase font-bold tracking-wider mb-1">Patient Details</p>
                <p className="font-bold text-gray-900 text-lg">{selectedRx.patientId?.name || 'Unknown'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-500 uppercase font-bold tracking-wider mb-1">Rx ID</p>
                <p className="font-mono text-gray-600 text-sm uppercase">{selectedRx._id.slice(-6)}</p>
              </div>
            </div>

            {/* Medicines List */}
            <div className="mb-10">
              <h1 className="text-5xl font-serif font-black text-blue-900 mb-8 italic">Rx</h1>
              <div className="space-y-6">
                {selectedRx.medicines.map((med, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-3">
                    <div>
                      <p className="font-bold text-gray-900 text-xl flex items-center gap-2">
                        <Pill className="w-5 h-5 text-blue-500"/> {med.name}
                      </p>
                      <p className="text-gray-500 font-medium mt-1">
                        Dosage: <span className="font-bold text-gray-800">{med.dosage}</span>
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="inline-block font-bold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100">
                        {med.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            {selectedRx.notes && (
              <div className="mt-8 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                <p className="text-xs text-orange-600 uppercase font-bold tracking-wider mb-3">
                  Doctor's Notes & Advice
                </p>
                <p className="text-gray-800 font-medium whitespace-pre-wrap leading-relaxed">
                  {selectedRx.notes}
                </p>
              </div>
            )}

            {/* Footer Signature */}
            <div className="mt-20 pt-8 flex justify-end">
              <div className="text-center">
                <div className="border-t-2 border-gray-300 pt-2 px-10">
                  <p className="font-bold text-gray-900">Doctor's Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) 
      
      /* 📝 ২. রাইট মোড: প্রেসক্রিপশন লেখার ফর্ম (ডাক্তারদের জন্য) */
      : isWriting && role === 'Doctor' ? (
        <form onSubmit={handleSavePrescription} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">New Prescription</h2>
              {linkedApptId && (
                <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mt-2 border border-indigo-100">
                  <Link2 className="w-3 h-3" /> Auto-linked to Appointment
                </span>
              )}
            </div>
            <button type="button" onClick={() => setIsWriting(false)} className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Patient Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <select 
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  disabled={linkedApptId !== null} 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all appearance-none disabled:bg-blue-50 disabled:border-blue-100 disabled:text-blue-900 disabled:font-bold disabled:cursor-not-allowed"
                >
                  <option value="" disabled>-- Choose a registered patient --</option>
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                  {linkedApptId && !patients.find(p => p._id === selectedPatientId) && (
                     <option value={selectedPatientId}>Loading patient data...</option>
                  )}
                </select>
              </div>
            </div>

            <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-900 flex items-center gap-2"><Pill className="w-4 h-4" /> Prescribed Medicines</h3>
                <button type="button" onClick={addMedicineRow} className="text-sm text-blue-600 font-bold hover:underline">+ Add Medicine</button>
              </div>
              
              {medicines.map((med, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input type="text" placeholder="Medicine Name (e.g. Napa)" value={med.name} onChange={(e) => updateMedicine(index, 'name', e.target.value)} required className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                  <input type="text" placeholder="Dosage (e.g. 1-0-1)" value={med.dosage} onChange={(e) => updateMedicine(index, 'dosage', e.target.value)} required className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                  <input type="text" placeholder="Duration (e.g. 7 Days)" value={med.duration} onChange={(e) => updateMedicine(index, 'duration', e.target.value)} required className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes / Tests (Optional)</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write any advice or diet plans here..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"></textarea>
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
            {isSaving ? 'Sending Prescription...' : 'Save & Issue Prescription'}
          </button>
        </form>
      ) : (
        /* 📋 ৩. লিস্ট মোড: সব প্রেসক্রিপশনের লিস্ট */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search prescriptions..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none w-64" />
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {prescriptionsList.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No prescriptions found in the database.</p>
            ) : (
              prescriptionsList.map((rx) => (
                <div key={rx._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 hover:bg-blue-50/50 transition-colors rounded-2xl border border-gray-100 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {role === 'Doctor' ? `Patient: ${rx.patientId?.name || 'Unknown'}` : `Dr. ${rx.doctorId?.name || 'Unknown'}`}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3.5 h-3.5" /> Date: {new Date(rx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Issued
                    </span>
                    {/* 🔴 এখানে onClick ফাংশন যোগ করা হলো */}
                    <button 
                      onClick={() => setSelectedRx(rx)}
                      className="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}