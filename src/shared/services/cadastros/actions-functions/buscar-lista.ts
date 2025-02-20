/** @format */

'use server';

import { baseURL } from "@/shared/utils/base-url";



export async function FetchBuscarListaCadastro(
	listaSql: string[],
	access_token: string,
) {
	const cadastros = await fetch(`${baseURL}cadastros/buscar-lista-sql`, {
		method: 'POST',
		body: JSON.stringify({ listaSql: listaSql }),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
	});
	const dataResponse = await cadastros.json();

	if (cadastros.status === 200)
		return {
			ok: true,
			error: null,
			data: dataResponse,
			status: 200,
		};
	if (!dataResponse)
		return {
			ok: false,
			error: 'Erro ao buscar cadastros.',
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
