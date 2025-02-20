/** @format */

'use server';

import { authOptions } from '@/shared/auth/authOptions';
import { baseURL } from '@/shared/utils/base-url';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';


export async function AutorizarUsuario(id: string) {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/login');
	const autorizado = await fetch(`${baseURL}usuarios/autorizar/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session?.access_token}`,
		},
	});

	const dataResponse = await autorizado.json();

	if (autorizado.status === 200)
		return {
			ok: true,
			error: null,
			data: dataResponse,
			status: 200,
		};
	if (!dataResponse)
		return {
			ok: false,
			error: 'Erro ao autorizar usuário.',
			data: null,
			status: 500,
		};
	return {
		ok: false,
		error: dataResponse.message,
		data: null,
		status: dataResponse.statusCode,
	};
}
