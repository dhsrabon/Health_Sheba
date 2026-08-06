export interface DoctorProfile {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  image?: string;
  hospitalName?: string;
  chamberNo?: string;
  consultationFee?: number;
  availability?: { day: string; slots: string[] }[];
  status?: string;
}

export interface AppointmentRecord {
  _id: string;
  doctorId: {
    _id: string;
    name: string;
    email: string;
  };
  patientId: {
    name: string;
    email: string;
  };
  date: string;
  time: string;
  reason: string;
  status: string;
  createdAt: string;
}

export const doctors: DoctorProfile[] = [
  {
    _id: "doc-101",
    name: "Ayesha Rahman",
    email: "ayesha.rahman@healthsheba.dev",
    specialty: "Cardiology",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    hospitalName: "HealthSheba Heart Center",
    chamberNo: "B-201",
    consultationFee: 1200,
    status: "Approved",
    availability: [
      { day: "Saturday", slots: ["10:00 AM", "11:30 AM", "4:00 PM"] },
      { day: "Monday", slots: ["9:30 AM", "1:00 PM"] },
      { day: "Wednesday", slots: ["3:00 PM", "5:00 PM"] },
    ],
  },
  {
    _id: "doc-102",
    name: "Farhan Ahmed",
    email: "farhan.ahmed@healthsheba.dev",
    specialty: "Dermatology",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
    hospitalName: "HealthSheba Skin Clinic",
    chamberNo: "C-114",
    consultationFee: 1000,
    status: "Approved",
    availability: [
      { day: "Sunday", slots: ["11:00 AM", "2:30 PM"] },
      { day: "Tuesday", slots: ["10:30 AM", "4:30 PM"] },
      { day: "Thursday", slots: ["12:00 PM", "3:30 PM"] },
    ],
  },
  {
    _id: "doc-103",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@healthsheba.dev",
    specialty: "Neurology",
    image: "https://images.unsplash.com/photo-1594824475445-4b30a1c1f8f2?auto=format&fit=crop&w=600&q=80",
    hospitalName: "HealthSheba Neuro Care",
    chamberNo: "A-302",
    consultationFee: 1500,
    status: "Approved",
    availability: [
      { day: "Saturday", slots: ["9:00 AM", "12:30 PM"] },
      { day: "Tuesday", slots: ["2:00 PM", "5:00 PM"] },
      { day: "Friday", slots: ["10:00 AM"] },
    ],
  },
];

declare global {
  var healthshebaAppointments: AppointmentRecord[] | undefined;
}

export function getAppointmentsStore() {
  if (!globalThis.healthshebaAppointments) {
    globalThis.healthshebaAppointments = [];
  }

  return globalThis.healthshebaAppointments;
}