'use server'

import { authOptions } from "@/shared/auth/authOptions";
import { AuditoriaResponseDTO } from "@/types/auditorias/auditorias.dto";
import { getServerSession } from "next-auth";

const api_url: string = 'http://localhost:3000/auditorias';

export const getAllAuditorias = async (
  limit: number = 10, offset: number = 0, orderBy: string = '', order: string = ''
): Promise<AuditoriaResponseDTO[]> => {
  const session = await getServerSession(authOptions);
  const request_url: string = `${api_url}/buscar-alteracoes?limit=${limit}&offset=${offset}&orderBy=${orderBy}&order=${order}`;
  const response: Response = await fetch(request_url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  if (response.status != 200) throw new Error('erro ao tentar buscar as vistorias');
  const data: AuditoriaResponseDTO[] = await response.json();
  return data;
};

export const getOneAuditoria = async (id: string): Promise<AuditoriaResponseDTO> => {
  const session = await getServerSession(authOptions);
  const response: Response = await fetch(`${api_url}/buscar-alteracao/${id}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  if (response.status != 200) throw new Error('erro ao tentar buscar a vistoria');
  const data: AuditoriaResponseDTO = await response.json();
  return data;
};
