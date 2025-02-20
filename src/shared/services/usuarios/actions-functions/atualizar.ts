/** @format */

'use server';

import { authOptions } from '@/shared/auth/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { IUpdateUsuario, IRespostaUsuario } from '../../../types/usuario';
import { baseURL } from '@/shared/utils/base-url';

export async function AtualizarUsuario(
	id: string,
	data: IUpdateUsuario,
): Promise<IRespostaUsuario> {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/login');
	const response: Response = await fetch(`${baseURL}usuarios/atualizar/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session?.access_token}`,
		},
		body: JSON.stringify(data),
	});
	const dataResponse = await response.json();
	if (response.status === 200)
		return {
			ok: true,
			error: null,
			data: dataResponse,
			status: 200,
		};
	if (!dataResponse)
		return {
			ok: false,
			error: 'Erro ao atualizar usuário.',
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
