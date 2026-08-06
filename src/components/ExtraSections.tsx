'use client';

import { ShieldCheck, Bot, Lock, Headset, Star, Quote } from 'lucide-react';

export default function ExtraSections() {
  const features = [
    {
      icon: ShieldCheck,
      title: "100% Verified Doctors",
      desc: "Every doctor on our platform is highly qualified, certified, and manually verified by our team.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "hover:border-emerald-200"
    },
    {
      icon: Bot,
      title: "AI Symptom Checker",
      desc: "Get instant AI-driven health insights to understand which specialist you should consult.",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "hover:border-cyan-200"
    },
    {
      icon: Lock,
      title: "Secure Patient Data",
      desc: "Your medical records, prescriptions, and personal data are heavily encrypted and safe.",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "hover:border-purple-200"
    },
    {
      icon: Headset,
      title: "24/7 Support",
      desc: "Our dedicated support team is always available to assist you with your healthcare needs.",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-200"
    }
  ];

  const testimonials = [
    {
      name: "Rahim Uddin",
      location: "Dhaka",
      text: "Health_Sheba made it incredibly easy to find a good cardiologist. The booking process was seamless, and the doctor was amazing! Highly recommended.",
      avatar: "R",
      color: "bg-blue-100 text-blue-700"
    },
    {
      name: "Sabina Yasmin",
      location: "Chittagong",
      text: "I love the AI symptom checker! It gave me a very clear idea of what specialist I needed to see before I even booked the appointment. Saved me a lot of time.",
      avatar: "S",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      name: "Kamrul Islam",
      location: "Sylhet",
      text: "Very secure and professional platform. I can keep all my past prescriptions and medical records in one place without worrying about losing them.",
      avatar: "K",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <div className="w-full font-sans">
      
      {/* ================= WHY CHOOSE US (Features) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Health_Sheba?</h2>
          <p className="text-gray-500 text-base">Experience a smarter, safer, and faster way to manage your healthcare needs with our cutting-edge features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg ${feature.border} transition-all duration-300 hover:-translate-y-1 group`}
            >
              <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PATIENT TESTIMONIALS ================= */}
      <section className="w-full bg-[#f8fafc] py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-gray-500 text-base">Don't just take our word for it. Here is what people have to say about their experience with Health_Sheba.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((review, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative hover:shadow-xl transition-all duration-300 group"
              >
                {/* Quote Icon Background */}
                <Quote className="absolute top-6 right-6 w-12 h-12 text-gray-100 group-hover:text-blue-50 transition-colors pointer-events-none" />
                
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-8 relative z-10 italic">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black ${review.color}`}>
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-xs text-gray-400">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}