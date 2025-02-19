import { authOptions } from '@/shared/auth/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
 

export async function GET(
) {
  const baseURL = process.env.API_URL || 'http://localhost:3000/';
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  try {
    const usuarios = await fetch(`${baseURL}usuarios/buscar-tudo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const data = await usuarios.json();
    console.log(data);
    if (usuarios.status === 200)
        return NextResponse.json({
            ok: true,
            error: null,
            data: data,
            status: 200,
        });
    return NextResponse.json({
        ok: false,
        error: data.message,
        data: null,
        status: data.statusCode,
    });
  } catch (error) {
    return NextResponse.json({
        ok: false,
        error: "Não foi possível buscar a lista de usuários.",
        data: null,
        status: 400,
    });
  }
}