import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    const expected = process.env.ADMIN_PIN || "1234";
    return NextResponse.json({ ok: pin === expected });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
