'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  UploadCloud, FileText, X, Search, CheckCircle, 
  Loader2, Image as ImageIcon, Wallet, UserCog
} from 'lucide-react';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dueAmount?: number;
}

export default function StaffPatientsRecordPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('Lab Report');
  
  const [dragActive, setDragActive] = useState(false);
  const [fileData, setFileData] = useState(''); 
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid'); 
  
  const [isUploading, setIsUploading] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/patients');
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const openUploadModal = async (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
    setAmount('Loading...'); 

    try {
      const res = await fetch(`http://localhost:5000/api/patients/${patient._id}/due`);
      if (res.ok) {
        const data = await res.json();
        setAmount(data.totalDue > 0 ? data.totalDue.toString() : '');
      } else {
        setAmount('');
      }
    } catch (error) {
      console.error("Failed to fetch due", error);
      setAmount('');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setFileData('');
    setFileName('');
    setAmount('');
    setPaymentStatus('Unpaid');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !fileData) {
      alert("Please select a file first!");
      return;
    }
    
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/records/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          title,
          recordType,
          fileData,
          amount: Number(amount) || 0,
          paymentStatus,
          date: new Date()
        })
      });

      if (res.ok) {
        alert('Patient info & payment updated successfully!');
        closeModal();
        fetchPatients(); 
      } else {
        alert('Failed to update info.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p._id?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Patient Directory & Records</h1>
            <p className="text-gray-500 font-medium mt-1">Select a patient to view details or update info.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" placeholder="Search by name or ID..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-72 shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading patients...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                    <th className="py-4 px-6">Patient Info</th>
                    <th className="py-4 px-6">Contact</th>
                    <th className="py-4 px-6">Due Balance</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {patient.name ? patient.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{patient.name}</p>
                            <p className="text-xs text-gray-400 font-mono">ID: {patient._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {patient.phone || patient.email || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        {patient.dueAmount && patient.dueAmount > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                            <span className="font-extrabold text-sm mr-1">৳</span> {patient.dueAmount} Due
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                            <CheckCircle className="w-3 h-3" /> Paid
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openUploadModal(patient)}
                          className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold py-2 px-4 rounded-xl transition-all text-sm"
                        >
                          <UserCog className="w-4 h-4" /> Update Info
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-blue-600" /> Update Patient Info
                </h3>
                <p className="text-xs text-gray-500 mt-1">Patient: <span className="font-bold text-gray-900">{selectedPatient.name}</span></p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Report Title</label>
                  <input 
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Blood Test"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Record Type</label>
                  <select
                    value={recordType} onChange={(e) => setRecordType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="X-Ray">X-Ray / MRI</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Document">Other Document</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload File (Image/PDF)</label>
                <div 
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                  
                  {fileData ? (
                    <>
                      <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                      <p className="text-sm font-bold text-gray-900">{fileName}</p>
                      <p className="text-xs text-gray-500 mt-1">Click or drag to replace file</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm font-bold text-gray-900">Drag & Drop file here</p>
                      <p className="text-xs text-gray-500 mt-1">or <span className="text-blue-600 hover:underline">browse from your computer</span></p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-600" /> Billing & Payment
                </h4>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-600 mb-2">Service Fee (Amount)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-sm">৳</span>
                      <input 
                        type="number" required value={amount} onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <button
                      type="button"
                      onClick={() => setPaymentStatus(prev => prev === 'Paid' ? 'Unpaid' : 'Paid')}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all border flex items-center justify-center gap-2 ${
                        paymentStatus === 'Paid' 
                          ? 'bg-green-100 border-green-200 text-green-700' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <CheckCircle className={`w-4 h-4 ${paymentStatus === 'Paid' ? 'text-green-600' : 'text-gray-400'}`} />
                      {paymentStatus === 'Paid' ? 'Cash Collected (Paid)' : 'Collect Cash Now'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading || !fileData} className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20">
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                  {isUploading ? 'Saving Info...' : 'Save & Update Info'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}