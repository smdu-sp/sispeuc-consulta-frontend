import { authOptions } from '@/shared/auth/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
 
export async function GET() {
  const baseURL = process.env.API_URL || 'http://localhost:3000/';
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  try {
    const alvaraTipos = await fetch(`${baseURL}usuarios/lista-completa`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const data = await alvaraTipos.json();
    return NextResponse.json({
      ok: true,
      error: null,
      data: data,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      ok: false,
      error: error,
      data: null,
      status: 500,
    });
  }
}