import { NextRequest, NextResponse } from "next/server";
import { doctors } from "../../../lib/mockData";

export function GET(request: NextRequest) {
	const role = request.nextUrl.searchParams.get("role");

	if (role?.toLowerCase() === "doctor") {
		return NextResponse.json(doctors);
	}

	return NextResponse.json(doctors);
}
