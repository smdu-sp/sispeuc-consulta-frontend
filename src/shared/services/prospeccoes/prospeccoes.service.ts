'use server'

import { authOptions } from "@/shared/auth/authOptions";
import { getServerSession } from "next-auth";

import { ProspeccoesQuantificarResponseDTO, ProspeccoesRequestDTO, ProspeccoesRequestEmMassaDTO, ProspeccoesResponseDTO } from "@/types/prospeccoes/prospeccoes.dto";

const api_url: string = 'http://localhost:3000/prospeccoes';

export const createProspeccao = async (
  request: ProspeccoesRequestDTO
): Promise<ProspeccoesResponseDTO> => {
  const session = await getServerSession(authOptions);
  const response: Response = await fetch(`${api_url}/criar-imovel`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    },
    body: JSON.stringify({ ...request })
  });
  if (response.status != 201) throw new Error('erro ao tentar registrar a prospecção');
  const data: ProspeccoesResponseDTO = await response.json();
  return data;
};

export const createProspeccaoEmMassa = async (
  request: ProspeccoesRequestEmMassaDTO
): Promise<ProspeccoesResponseDTO[]> => {
  const session = await getServerSession(authOptions);
  const response: Response = await fetch(`${api_url}/criar-imoveis`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    },
    body: JSON.stringify({ ...request })
  });
  if (response.status != 201) throw new Error('erro ao tentar registrar as prospecções');
  const data: ProspeccoesResponseDTO[] = await response.json();
  return data;
};

export const getAllProspeccoes = async (
  limit: number = 10, offset: number = 0, orderBy: string = '', order: string = ''
): Promise<ProspeccoesResponseDTO[]> => {
  const session = await getServerSession(authOptions);
  const request_url: string = `${api_url}/buscar-imoveis?limit=${limit}&offset=${offset}&orderBy=${orderBy}&order=${order}`;
  const response: Response = await fetch(request_url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  if (response.status != 200) throw new Error('erro ao tentar buscar as prospecções');
  const data: ProspeccoesResponseDTO[] = await response.json();
  return data;
};

export const getAllNoPagProspeccoes = async (): Promise<ProspeccoesResponseDTO[]> => {
  const session = await getServerSession(authOptions);
  const request_url: string = `${api_url}/buscar-todos-imoveis`;
  const response: Response = await fetch(request_url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  if (response.status != 200) throw new Error('erro ao tentar buscar as prospecções');
  const data: ProspeccoesResponseDTO[] = await response.json();
  return data;
};

export const getOneProspeccao = async (id: string): Promise<ProspeccoesResponseDTO> => {
  const session = await getServerSession(authOptions);
  const response: Response = await fetch(`${api_url}/buscar-imovel/${id}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  if (response.status != 200) throw new Error('erro ao tentar buscar a prospecção');
  const data: ProspeccoesResponseDTO = await response.json();
  return data;
};

export const updateProspeccao = async (
  id: string, request: Partial<ProspeccoesRequestDTO>
): Promise<ProspeccoesResponseDTO> => {
  const session = await getServerSession(authOptions);
  const response: Response = await fetch(`${api_url}/atualizar-imovel/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    },
    body: JSON.stringify({ ...request })
  });
  if (response.status != 200) throw new Error('erro ao tentar atualizar a prospecção');
  const data: ProspeccoesResponseDTO = await response.json();
  return data;
};

export const deleteProspeccao = async (id: string): Promise<ProspeccoesResponseDTO> => {
  const session = await getServerSession(authOptions);
  const response: Response = await fetch(`${api_url}/excluir-imovel/${id}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${session?.access_token}`
    },
  });
  if (response.status != 200) throw new Error('erro ao tentar excluir a prospecção');
  const data: ProspeccoesResponseDTO = await response.json();
  return data;
};

export const quantificarImoveis = async (): Promise<ProspeccoesQuantificarResponseDTO> => {
  const session = await getServerSession(authOptions);
  const request_url: string = `${api_url}/quantificar-imoveis`;
  const response: Response = await fetch(request_url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  if (response.status != 200) throw new Error('erro ao tentar buscar a quantificação das prospecções');
  const data: ProspeccoesQuantificarResponseDTO = await response.json();
  return data;
}
