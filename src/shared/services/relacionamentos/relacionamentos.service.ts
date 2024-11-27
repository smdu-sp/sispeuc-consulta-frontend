'use server'

import { authOptions } from "@/shared/auth/authOptions";
import { ImovelResponseDto } from "@/types/cadastros/cadastros.dto";
import { VistoriaResponseDTO } from "@/types/vistorias/vistorias.dto";
import { getServerSession } from "next-auth";

const api_url: string = 'http://localhost:3000/relacionamentos';

export const relacionarImovelProcesso = async (
  idProcesso: number, idImovel: number
): Promise<ImovelResponseDto[]> => {
  const session = await getServerSession(authOptions);
  const url: string = `${api_url}/relacionar-processo-imovel/${idProcesso}?idImovel=${idImovel}`;
  const response: Response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  if (response.status != 200) throw new Error('Não foi possível associar o processo e o imóvel');
  const data: ImovelResponseDto[] = await response.json();
  return data;
};

export const relacionarImovelVistoria = async (
  idImovel: number, idVistoria: number
): Promise<VistoriaResponseDTO[]> => {
  const session = await getServerSession(authOptions);
  const url: string = `${api_url}/relacionar-imovel-vistoria/${idImovel}?idVistoria=${idVistoria}`;
  const response: Response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  if (response.status != 200) throw new Error('Não foi possível associar o imóvel e a vistoria');
  const data: VistoriaResponseDTO[] = await response.json();
  return data;
};
