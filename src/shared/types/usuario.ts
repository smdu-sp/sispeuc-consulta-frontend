/** @format */

export interface IUsuario {
	id: string;
	nome: string;
	login: string;
	email: string;
	permissao: string;
	status: boolean;
	ultimologin: Date;
	criadoEm: Date;
	atualizadoEm?: Date;
}

export interface ICreateUsuario {
	nome: string;
	email: string;
	login: string;
	permissao: string;
}

export interface IUpdateUsuario {
	id?: string;
	permissao?: string;
	status?: boolean;
}

export interface IPaginadoUsuario {
	data: IUsuario[];
	total: number;
	pagina: number;
	limite: number;
}

export interface IRespostaUsuario {
	ok: boolean;
	error: string | null;
	data: IUsuario | IPaginadoUsuario | null;
	status: number;
}
