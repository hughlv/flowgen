import { getSession } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(request: NextRequest) {
  try {
    const {
      data: { session },
    } = await getSession();

    if (!session || !session.access_token) {
      throw new Error('No session or access token found');
    }

    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/v1/admin/models`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const models = await res.json();
    return NextResponse.json(models);
  } catch (e) {
    console.error(`Failed GET /models:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
