'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Loader2, ArrowRight } from 'lucide-react';

interface Patient {
  _id: string;
  name: string;
  email: string;
}

export default function WritePrescriptionPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // পেশেন্টদের লিস্ট ফেচ করা
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        const res = await fetch(`${apiUrl}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          // শুধু পেশেন্ট রোল ফিল্টার করা
          setPatients(data.filter((u: any) => u.role === 'Patient'));
        }
      } catch (error) {
        console.error("Failed to load patients");
      }
    };
    fetchPatients();
  }, []);

  // মেডিসিন রো যোগ করা
  const addMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  };

  // মেডিসিন রো রিমুভ করা
  const removeMedicineRow = (index: number) => {
    const list = [...medicines];
    list.splice(index, 1);
    setMedicines(list);
  };

  // ইনপুট হ্যান্ডেলার
  const handleMedicineChange = (index: number, field: string, value: string) => {
    const list: any = [...medicines];
    list[index][field] = value;
    setMedicines(list);
  };

  // ফর্ম সাবমিট
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const res = await fetch(`${apiUrl}/prescriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ patientId, diagnosis, medicines, advice })
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ type: 'success', text: 'প্রেসক্রিপশন সফলভাবে সেভ হয়েছে!' });
        setPatientId('');
        setDiagnosis('');
        setAdvice('');
        setMedicines([{ name: '', dosage: '', duration: '' }]);
      } else {
        setMsg({ type: 'error', text: data.message || 'প্রেসক্রিপশন তৈরি করা যায়নি।' });
      }
    } catch (error) {
      setMsg({ type: 'error', text: 'সার্ভারের সাথে কানেক্ট করা যাচ্ছে না।' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-600" />
          Write Digital Prescription (Rx)
        </h1>
        <p className="text-gray-500 text-sm mt-1">Generate a digital prescription for your patient.</p>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        
        {/* Patient Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            <option value="" disabled>Choose patient...</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
            ))}
          </select>
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis / Disease</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
            placeholder="e.g. Viral Fever / Hypertension"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Medicines List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Medicines</label>
            <button
              type="button"
              onClick={addMedicineRow}
              className="flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          </div>

          <div className="space-y-3">
            {medicines.map((med, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Napa Extra)"
                  value={med.name}
                  onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                  required
                  className="flex-2 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 1-0-1)"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                  required
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 5 days)"
                  value={med.duration}
                  onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                  required
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm"
                />
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicineRow(index)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Advice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor's Advice</label>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            rows={3}
            placeholder="e.g. Drink plenty of water, take rest."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-purple-500 focus:border-purple-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          {isLoading ? 'Saving Prescription...' : 'Save & Issue Prescription'}
        </button>

      </form>
    </div>
  );
}