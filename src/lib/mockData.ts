export interface DoctorProfile {
  _id: string;
  name: string;
  email: string;
  specialty: string;
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
  },
  {
    _id: "doc-102",
    name: "Farhan Ahmed",
    email: "farhan.ahmed@healthsheba.dev",
    specialty: "Dermatology",
  },
  {
    _id: "doc-103",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@healthsheba.dev",
    specialty: "Neurology",
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