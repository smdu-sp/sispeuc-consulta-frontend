/** @format */

import { baseURL } from '../utils/base-url';

export async function FetchBuscarTudo(access_token: string) {
	try {
		const usuarios = await fetch(`${baseURL}usuarios/buscar-tudo`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		});
		const data = await usuarios.json();
		console.log(data);
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
			error: 'Não foi possível buscar a lista de usuários.',
			data: null,
			status: 400,
		};
	}
}
