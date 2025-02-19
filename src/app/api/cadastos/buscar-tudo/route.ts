/** @format */

import { authOptions } from '@/shared/auth/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const baseURL = process.env.API_URL || 'http://localhost:3000/';

	const session = await getServerSession(authOptions);
	if (!session) redirect('/login');

	try {
		const searchParams = request.nextUrl.searchParams;
		const pagina = searchParams.get('pagina');
		const limite = searchParams.get('limite');
		const busca = searchParams.get('busca');
		const sistema = searchParams.get('sistema');

		const cadastros = await fetch(
			`${baseURL}usuarios/buscar-tudo?pagina=${pagina}&limite=${limite}&busca=${busca}&sistema=${sistema}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		);

		const data = await cadastros.json();
		console.log(data);

		if (cadastros.status === 200)
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
			error: 'Não foi possível buscar a lista de usuários.',
			data: null,
			status: 400,
		});
	}
}
