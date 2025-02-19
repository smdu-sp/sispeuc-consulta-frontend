import { authOptions } from '@/shared/auth/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
 
type Params = {
  id: string;
};

export async function GET(
  _: NextRequest,
  { params }: { params: Params }
) {
  const baseURL = process.env.API_URL || 'http://localhost:3000/';
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const id = params.id;
  if (!id || id === '') return NextResponse.json({
    ok: false,
    error: "Não foi possível buscar o usuário, ID vazio.",
    data: null,
    status: 400
  });
  try {
    const usuarios = await fetch(`${baseURL}usuarios/buscar-por-id/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const data = await usuarios.json();
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
        error: "Não foi possível buscar o usuário",
        data: null,
        status: 400,
    });
  }
}