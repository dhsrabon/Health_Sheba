import { NextRequest, NextResponse } from "next/server";
import { doctors, getAppointmentsStore, type AppointmentRecord } from "../../../lib/mockData";

export function GET() {
	return NextResponse.json(getAppointmentsStore());
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const doctorId = String(body?.doctorId || "").trim();
		const date = String(body?.date || "").trim();
		const time = String(body?.time || "").trim();
		const reason = String(body?.reason || "").trim();

		if (!doctorId || !date || !time || !reason) {
			return NextResponse.json(
				{ message: "doctorId, date, time and reason are required." },
				{ status: 400 }
			);
		}

		const doctor = doctors.find((item) => item._id === doctorId);
		if (!doctor) {
			return NextResponse.json({ message: "Selected doctor was not found." }, { status: 404 });
		}

		const appointment: AppointmentRecord = {
			_id: crypto.randomUUID(),
			doctorId: {
				_id: doctor._id,
				name: doctor.name,
				email: doctor.email,
			},
			patientId: {
				name: "Patient User",
				email: "patient@healthsheba.dev",
			},
			date,
			time,
			reason,
			status: "Scheduled",
			createdAt: new Date().toISOString(),
		};

		const store = getAppointmentsStore();
		store.unshift(appointment);

		return NextResponse.json(
			{ message: "Appointment booked successfully.", appointment },
			{ status: 201 }
		);
	} catch {
		return NextResponse.json(
			{ message: "Invalid appointment payload." },
			{ status: 400 }
		);
	}
}
