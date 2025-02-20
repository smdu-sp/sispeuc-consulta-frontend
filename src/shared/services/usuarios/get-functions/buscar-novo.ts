/** @format */

import { baseURL } from "@/shared/utils/base-url";



export async function FetchBuscarNovo(login: string, access_token: string) {
	if (!login || login === '')
		return {
			ok: false,
			error: 'Não foi possível buscar o usuário, login vazio.',
			data: null,
			status: 400,
		};
	try {
		const usuarioNovo = await fetch(`${baseURL}usuarios/buscar-novo/${login}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		});
		const data = await usuarioNovo.json();
		if (usuarioNovo.status === 200)
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
