'use server'

import { GeosampaCollectionDTO, GeosampaFeatureDTO } from "@/types/integracoes/integracoes.dto";

const api_url: string = 'http://localhost:3000/geosampa';

export const getOneLote = async (id: string): Promise<GeosampaFeatureDTO> => {
  const request_url: string = `${api_url}/lote/${id}`;
  const response: Response = await fetch(request_url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', }
  });
  if (response.status != 200) throw new Error(`erro ao tentar buscar o lote de id ${id}`);
  const data: GeosampaFeatureDTO = await response.json();
  return data;
};

export const getAllLotesInQuadra = async (id: string): Promise<GeosampaCollectionDTO> => {
  const response: Response = await fetch(`${api_url}/lotes-na-quadra/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', }
  });
  if (response.status != 200) throw new Error(`erro ao tentar buscar os lotes na quadra de id ${id}`);
  const data: GeosampaCollectionDTO = await response.json();
  return data;
};

export const getAllQuadrasInSetor = async (id: string): Promise<GeosampaCollectionDTO> => {
  const response: Response = await fetch(`${api_url}/quadras-no-setor/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', }
  });
  if (response.status != 200) throw new Error(`erro ao tentar buscar as quadras no setor de id ${id}`);
  const data: GeosampaCollectionDTO = await response.json();
  return data;
};
