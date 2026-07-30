'use client';

import { HeartPulse, Brain, Apple, Moon, ShieldCheck } from 'lucide-react';

const tips = [
  {
    id: 1,
    title: 'Heart Health',
    description: '30 minutes of daily cardio can significantly reduce the risk of cardiovascular diseases.',
    doctor: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    icon: HeartPulse,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50',
  },
  {
    id: 2,
    title: 'Mental Clarity',
    description: 'Practice mindfulness for 10 minutes a day to lower stress levels and improve daily focus.',
    doctor: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    icon: Brain,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    id: 3,
    title: 'Balanced Diet',
    description: 'Incorporate at least 3 servings of colorful, leafy vegetables into your daily meals.',
    doctor: 'Dr. Emily Carter',
    specialty: 'Nutritionist',
    icon: Apple,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    id: 4,
    title: 'Quality Sleep',
    description: 'Maintain a consistent sleep schedule by going to bed at the exact same time every night.',
    doctor: 'Dr. James Wilson',
    specialty: 'General Physician',
    icon: Moon,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
];

export default function HealthTips() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Doctor's Advice & Health Tips</h2>
          <p className="text-gray-600">
            Stay informed and healthy with quick tips provided by our verified medical professionals.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip) => (
            <div 
              key={tip.id} 
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon */}
              <div className={`w-12 h-12 ${tip.bgColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <tip.icon className={`w-6 h-6 ${tip.iconColor}`} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                "{tip.description}"
              </p>
              
              {/* Doctor Info */}
              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                  {tip.doctor.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-gray-900">{tip.doctor}</p>
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-xs text-blue-600 font-medium">{tip.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}