'use client';

import { useState, useEffect } from 'react';
import { FileText, UploadCloud, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface MedicalRecord {
  _id: string;
  title: string;
  recordType: string;
  fileData: string;
  date: string;
  paymentStatus?: string;
  amount?: number;
}

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload States
  const [title, setTitle] = useState('');
  const [fileData, setFileData] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // পেশেন্টের নিজস্ব রিপোর্টগুলো ব্যাকএন্ড থেকে আনা হচ্ছে
  const fetchMyRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://healthsheba-server.vercel.app/api/records/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (error) {
      console.error("Failed to fetch records", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecords();
  }, []);

  // পেশেন্ট নিজে আপলোড করতে চাইলে
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFileData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePatientUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileData) return alert('Please provide title and file');
    
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://healthsheba-server.vercel.app/api/records/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title, 
          fileData, 
          recordType: 'Document',
          amount: 0, // পেশেন্ট নিজে আপলোড করলে কোনো টাকা লাগবে না
          paymentStatus: 'Paid' 
        })
      });

      if (res.ok) {
        alert('Record uploaded successfully!');
        setTitle('');
        setFileData('');
        // নতুন ডাটা শো করানোর জন্য রিফ্রেশ করা হচ্ছে
        fetchMyRecords(); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // 🟢 Date সুন্দর করে দেখানোর ফাংশন (যেমন: 30 Jul, 2026)
  const formatDate = (isoString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(isoString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">My Medical Records</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Upload Form */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <UploadCloud className="w-5 h-5 text-blue-600" /> Upload New Record
              </h2>
              
              <form onSubmit={handlePatientUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Document Title</label>
                  <input 
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Previous Blood Test"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Select File (Image/PDF)</label>
                  <input 
                    type="file" required accept="image/*,.pdf" onChange={handleFileChange}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                <button 
                  type="submit" disabled={isUploading || !fileData} 
                  className="w-full mt-4 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                  {isUploading ? 'Uploading...' : 'Upload Record'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Uploaded Documents List */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Uploaded Documents</h2>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading your records...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No medical records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((record) => (
                  <div key={record._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-red-50 p-2.5 rounded-xl text-red-500">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-1">{record.title}</h3>
                          {/* 🟢 সুন্দর Date ফরম্যাট */}
                          <p className="text-xs text-gray-500 mt-0.5">{formatDate(record.date)} • {record.recordType}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                      {/* 🟢 Payment Status (Paid / Due) পেশেন্ট দেখতে পাবে */}
                      {record.paymentStatus === 'Paid' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                          <CheckCircle className="w-3 h-3" /> Paid
                        </span>
                      ) : record.amount && record.amount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
                          <AlertCircle className="w-3 h-3" /> $ {record.amount} Due
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                          Self Uploaded
                        </span>
                      )}

                      <a 
                        href={record.fileData} 
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        View File <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}