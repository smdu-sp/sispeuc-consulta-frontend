/** @format */

import { baseURL } from '../utils/base-url';

export async function FetchListaCompleta(access_token: string) {
	try {
		const alvaraTipos = await fetch(`${baseURL}usuarios/lista-completa`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		});
		const data = await alvaraTipos.json();
		return {
			ok: true,
			error: null,
			data: data,
			status: 200,
		};
	} catch (error) {
		console.log(error);
		return {
			ok: false,
			error: error,
			data: null,
			status: 500,
		};
	}
}
