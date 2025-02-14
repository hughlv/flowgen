import { NextRequest, NextResponse } from 'next/server';
import { createClient, getUser } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) throw new Error('Not authenticated');
    return NextResponse.json(user);
  } catch (e) {
    console.error(`Failed GET /user:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await request.json();

    const { data, error } = await supabase.from('users').upsert(user);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /user:`, JSON.stringify((e as Error).message));
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
