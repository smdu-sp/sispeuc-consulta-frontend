/** @format */

'use server';

import { authOptions } from '@/shared/auth/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { baseURL } from '../utils/base-url';

export async function DesativarUsuario(id: string) {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/login');

	const desativado = await fetch(`${baseURL}usuarios/desativar/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session?.access_token}`,
		},
	});

	const dataResponse = await desativado.json();

	if (desativado.status === 200)
		return {
			ok: true,
			error: null,
			data: dataResponse,
			status: 200,
		};
	if (!dataResponse)
		return {
			ok: false,
			error: 'Erro ao desativar usuário.',
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
