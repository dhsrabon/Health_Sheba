'use client';

import { useState } from 'react';
import { 
  BrainCircuit, 
  Activity, 
  AlertTriangle, 
  Stethoscope, 
  HeartPulse, 
  Loader2, 
  ArrowRight,
  XCircle // 🟢 নতুন আইকন যুক্ত করা হয়েছে
} from 'lucide-react';
import Link from 'next/link';

interface AIResult {
  diseases: string[];
  firstAid: string[];
  doctor: string;
}

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null); // 🟢 নতুন Error State

  // 🤖 Real Gemini AI Logic
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null); // আগের এরর ক্লিয়ার করা

    try {
      // 🟢 সরাসরি লোকালহোস্ট লিংক দেওয়া হলো, যাতে .env এর কারণে কোনো কনফিউশন না হয়
      const res = await fetch('http://localhost:5000/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms })
      });

      const data = await res.json();
      console.log("📥 Frontend Received Data:", data); // কনসোলে ডাটা চেক করার জন্য

      if (res.ok) {
        setResult(data); 
      } else {
        // ব্যাকএন্ড থেকে আসা এরর সুন্দরভাবে সেট করা
        setError(data.message || "AI could not analyze the symptoms at this moment.");
      }
    } catch (err: any) {
      console.error("🔥 Frontend Error:", err);
      setError("Failed to connect to the server. Is your backend running?");
    } finally {
      setIsLoading(false); // 🟢 এটি যেকোনো পরিস্থিতিতেই লোডিং বন্ধ করবে
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-3xl shadow-inner">
              <BrainCircuit className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">AI Symptom Checker</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            Describe your symptoms in your own words, and our AI will analyze possible conditions, suggest first aid, and recommend the right specialist.
          </p>
        </div>

        {/* Input Section */}
        <form onSubmit={handleAnalyze} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">How are you feeling today?</label>
            <textarea
              required
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., I have a severe headache since morning, feeling slightly dizzy and nauseous..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none resize-none text-gray-700 font-medium transition-all"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading || !symptoms.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Analyze with AI
              </>
            )}
          </button>
        </form>

        {/* 🔴 Error Message Box (নতুন যুক্ত করা হয়েছে) */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-medium animate-in fade-in duration-300">
            <XCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* ⚠️ Disclaimer */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <p>
            <strong>Disclaimer:</strong> This AI tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician in medical emergencies.
          </p>
        </div>

        {/* 🟢 Results Section */}
        {result && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 text-center">AI Analysis Result</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Possible Diseases */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-50 p-2 rounded-xl text-red-500"><Activity className="w-5 h-5" /></div>
                  <h3 className="font-bold text-lg text-gray-900">Possible Conditions</h3>
                </div>
                <ul className="space-y-3">
                  {result.diseases.map((disease, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> {disease}
                    </li>
                  ))}
                </ul>
              </div>

              {/* First Aid */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-50 p-2 rounded-xl text-green-600"><HeartPulse className="w-5 h-5" /></div>
                  <h3 className="font-bold text-lg text-gray-900">First Aid / Home Care</h3>
                </div>
                <ul className="space-y-3">
                  {result.firstAid.map((aid, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></span> {aid}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Doctor Recommendation */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-blue-100 font-medium text-sm mb-1">Recommended Specialist</p>
                  <h3 className="text-2xl font-bold">{result.doctor}</h3>
                </div>
              </div>
              
              <Link 
                href={`/doctors`} 
                className="w-full md:w-auto bg-white text-blue-600 hover:bg-gray-50 font-bold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Find a {result.doctor} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}