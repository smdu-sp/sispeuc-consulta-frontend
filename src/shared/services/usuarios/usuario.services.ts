'use server'

import { authOptions } from "@/shared/auth/authOptions";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export async function Logout() {
    
}

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

const baseURL = process.env.API_URL || 'http://localhost:3000/';

async function listaCompleta(): Promise<IUsuario[]> {
    const session = await getServerSession(authOptions);
    const usuarios = await fetch(`${baseURL}usuarios/lista-completa`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return usuarios;
}

async function buscarTudo(
    status: number = 1, pagina: number = 1, limite: number = 10, busca: string = '', permissao: string = ''
): Promise<IPaginadoUsuario> {
    const session = await getServerSession(authOptions);
    const usuarios = await fetch(`${baseURL}usuarios/buscar-tudo?status=${status}&pagina=${pagina}&limite=${limite}&busca=${busca}&permissao=${permissao}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return usuarios;
}

async function buscarPorId(id: string): Promise<IUsuario> {
    const session = await getServerSession(authOptions);
    const usuario = await fetch(`${baseURL}usuarios/buscar-por-id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return usuario;
}

async function autorizar(id: string): Promise<{ autorizado: boolean }> {
    const session = await getServerSession(authOptions);
    const autorizado = await fetch(`${baseURL}usuarios/autorizar/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    })
    return autorizado;
}

async function criar(data: ICreateUsuario): Promise<IRespostaUsuario> {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
    const response: Response = await fetch(`${baseURL}usuarios/criar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }, body: JSON.stringify(data)
    })
    const dataResponse = await response.json();
    if (response.status === 201)
        return { 
            ok: true,
            error: null,
            data: dataResponse,
            status: 201
        }
    if (!dataResponse)
        return {
            ok: false,
            error: "Erro ao criar novo usuário.",
            data: null,
            status: 500
        }
    return {
        ok: false,
        error: dataResponse.message,
        data: null,
        status: dataResponse.statusCode
    }
}

async function atualizar(id: string, data: IUpdateUsuario): Promise<IRespostaUsuario> {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
    const response: Response = await fetch(`${baseURL}usuarios/atualizar/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }, body: JSON.stringify(data)
    });
    const dataResponse = await response.json();
    if (response.status === 200)
        return { 
            ok: true,
            error: null,
            data: dataResponse,
            status: 200
        }
    if (!dataResponse)
        return {
            ok: false,
            error: "Erro ao atualizar usuário.",
            data: null,
            status: 500
        }
    return {
        ok: false,
        error: dataResponse.message,
        data: null,
        status: dataResponse.statusCode
    }
}

async function desativar(id: string): Promise<{ desativado: boolean }> {
    const session = await getServerSession(authOptions);
    const desativado = await fetch(`${baseURL}usuarios/desativar/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    });
    return desativado;
}

async function validaUsuario(): Promise<IUsuario> {
    const session = await getServerSession(authOptions);
    const usuario = await fetch(`${baseURL}usuarios/valida-usuario`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return usuario;
}

async function buscarNovo(login: string): Promise<{ id?: string, login?: string, nome?: string, email?: string, unidade_id?: string, message?: string }> {
    const session = await getServerSession(authOptions);
    const usuario = await fetch(`${baseURL}usuarios/buscar-novo?login=${login}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status === 403) return { message: 'Usuário já cadastrado.'}
        if (response.status !== 200) return;
        return response.json();
    })
    return usuario;
}

export { 
    atualizar,
    autorizar,
    buscarNovo,
    buscarPorId,
    buscarTudo,
    criar,
    desativar,
    listaCompleta,
    validaUsuario
};
