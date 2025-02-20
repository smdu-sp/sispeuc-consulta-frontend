/** @format */

import { baseURL } from '../utils/base-url';

export async function FetchBuscarPorId(id: string, access_token: string) {
	if (!id || id === '')
		return {
			ok: false,
			error: 'Não foi possível buscar o usuário, ID vazio.',
			data: null,
			status: 400,
		};

	try {
		const usuarios = await fetch(`${baseURL}usuarios/buscar-por-id/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		});
		const data = await usuarios.json();
		if (usuarios.status === 200)
			return {
				ok: true,
				error: null,
				data: data,
				status: 200,
			};
		return {
			ok: false,
			error: data.message,
			data: null,
			status: data.statusCode,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar o usuário',
			data: null,
			status: 400,
		};
	}
}
