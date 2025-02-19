import { authOptions } from '@/shared/auth/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    login: string;
};

export async function GET(
  _: NextRequest,
  { params }: { params: Params }
) {
    const baseURL = process.env.API_URL || 'http://localhost:3000/';
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');
    const login = params.login;
    if (!login || login === '') return NextResponse.json({
        ok: false,
        error: "Não foi possível buscar o usuário, login vazio.",
        data: null,
        status: 400
    });
    try {
        const usuarioNovo = await fetch(`${baseURL}usuarios/buscar-novo/${login}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
        });
        const data = await usuarioNovo.json();
        if (usuarioNovo.status === 200)
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