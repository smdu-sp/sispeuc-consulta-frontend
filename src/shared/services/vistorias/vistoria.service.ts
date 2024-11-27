'use server'

import { authOptions } from "@/shared/auth/authOptions";
import { getServerSession } from "next-auth";

import { VistoriaPaginationDTO, VistoriaResponseDTO } from "@/types/vistorias/vistorias.dto";

const api_url: string = 'http://localhost:3000/vistorias';

export const createVistoria = async (request: FormData) => {
    const session = await getServerSession(authOptions);
    const response: Response = await fetch(`${api_url}/criar-vistoria`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${session?.access_token}`
        },
        body: request
    });
    if (response.status != 201) throw new Error('erro ao tentar registrar a vistoria');
    const data: VistoriaResponseDTO = await response.json();
    return data;
};

export const getAllVistorias = async (
    pagina: number = 1, limite: number = 10, busca: string = '', status: string = 'false'
): Promise<VistoriaPaginationDTO> => {
    const session = await getServerSession(authOptions);
    const request_url: string = `${api_url}/buscar-vistorias?pagina=${pagina}&limite=${limite}&busca=${busca}&status=${status}`;
    const response: Response = await fetch(request_url, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
        }
    });
    if (response.status != 200) throw new Error('erro ao tentar buscar as vistorias');
    const data: VistoriaPaginationDTO = await response.json();
    return data;
};

export const getOneVistoria = async (id: string): Promise<VistoriaResponseDTO> => {
    const session = await getServerSession(authOptions);
    const response: Response = await fetch(`${api_url}/buscar-vistoria/${id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
        }
    });
    if (response.status != 200) throw new Error('erro ao tentar buscar a vistoria');
    const data: VistoriaResponseDTO = await response.json();
    return data;
};

export const updateVistoria = async (
    id: string, request: FormData
): Promise<VistoriaResponseDTO> => {
    const session = await getServerSession(authOptions);
    const response: Response = await fetch(`${api_url}/atualizar-vistoria/${id}`, {
        method: 'PATCH',
        headers: { 
            'Authorization': `Bearer ${session?.access_token}`
        },
        body: request
    });
    if (response.status != 200) throw new Error('erro ao tentar atualizar a vistoria');
    const data: VistoriaResponseDTO = await response.json();
    return data;
};

export const deleteVistoria = async (id: number): Promise<VistoriaResponseDTO> => {
    const session = await getServerSession(authOptions);
    const response: Response = await fetch(`${api_url}/excluir-vistoria/${id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${session?.access_token}`
        },
    });
    if (response.status != 200) throw new Error('erro ao tentar excluir a vistoria');
    const data: VistoriaResponseDTO = await response.json();
    return data;
};

export const deleteFileOnVistoria = async (fileId: number) => {
    const session = await getServerSession(authOptions);
    const response: Response = await fetch(`${api_url}/excluir-anexo/${fileId}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${session?.access_token}`
        },
    });
    if (response.status != 200) 
        throw new Error('erro ao tentar excluir o anexo da vistoria');
};
