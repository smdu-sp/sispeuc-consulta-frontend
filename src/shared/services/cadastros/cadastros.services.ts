/** @format */

'use server';

import { authOptions } from '@/shared/auth/authOptions';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

export async function Logout() {
	await signOut({ redirect: false });
	window.location.href = '/login';
}

export interface IPaginadoCadastros {
	data: ICadastros[];
	total: number;
	pagina: number;
	limite: number;
}

export interface IAssuntos {
	id_prata_assunto: number;
	id_prata_processo?: number;
	sistema?: string;
	processo?: string;
	protocolo?: string;
	codigoAssunto?: string;
	dtInclusaoAssunto?: Date;
	assuntoCod?: string;
	assunto?: string;
	aditivo?: string;
	tipoRequerimento?: string;
	situacaoAssunto?: string;
	numDocIrregularidade?: string;
	dtEmissaoDocumento?: Date;
	statusDocumento?: string;
	subprefeitura?: string;
	distrito?: string;
	dtcarga?: Date;

	cadastro?: ICadastros;
}

export interface IEnderecos {
	id_prata_endereco: number;
	id_prata_assunto: number;
	sistema?: string;
	processo?: string;
	protocolo?: string;
	codigoAssunto?: string;
	codlog?: string;
	logradouro?: string;
	numero?: string;
	bairro?: string;
	cep?: string;
	subprefeitura?: string;
	distrito?: string;
	dtcarga?: Date;
	complemento?: string;
}

export interface ICadastros {
	id_prata_sql_incra: number;
	id_prata_assunto: number;
	sistema?: string;
	processo?: string;
	protocolo?: string;
	codigoAssunto?: string;
	sql_incra?: string;
	tipoSql_incra?: string;
	dtcarga?: Date;

	assunto?: IAssuntos;
	endereco?: IEnderecos;
}

export interface IListaSql {
	sql: string;
	processos?: {
		processo?: string;
		sistema?: string;
		assunto?: string;
		situacao?: string;
		dataInclusao?: string;
		dataEncerramento?: string;
	}[];
}

const baseURL = process.env.API_URL || 'http://localhost:3000/';

async function buscarLista(listaSql: string[]) {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/login');

	const cadastros = await fetch(`${baseURL}cadastros/buscar-lista-sql`, {
		method: 'POST',
		body: JSON.stringify({ listaSql: listaSql }),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session?.access_token}`,
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

//GET REQUESTS//
async function listaSistemas(): Promise<{ sistema: string }[]> {
	const session = await getServerSession(authOptions);
	const sistemas = await fetch(`${baseURL}cadastros/lista-sistemas`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session?.access_token}`,
		},
	}).then((response) => {
		if (response.status === 401) Logout();
		return response.json();
	});
	return sistemas;
}

async function buscarTudo(
	pagina: number = 1,
	limite: number = 10,
	busca: string = '',
	sistema: string = '',
): Promise<IPaginadoCadastros> {
	const session = await getServerSession(authOptions);
	const cadastros = await fetch(
		`${baseURL}cadastros/buscar-tudo?pagina=${pagina}&limite=${limite}&busca=${busca}&sistema=${sistema}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session?.access_token}`,
			},
		},
	).then((response) => {
		if (response.status === 401) Logout();
		return response.json();
	});
	return cadastros;
}

export { buscarTudo, buscarLista, listaSistemas };
