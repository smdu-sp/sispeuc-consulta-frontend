'use server'

import { authOptions } from "@/shared/auth/authOptions";
import { VitalidadeErrorDTO, VitalidadeSuccessDTO } from "@/types/vitalidade/vitalidade.dto";
import { getServerSession } from "next-auth";

const api_url: string = 'http://localhost:3000/vitalidade';

export const validarVitalidade = async (): Promise<VitalidadeSuccessDTO | VitalidadeErrorDTO> => {
  const session = await getServerSession(authOptions);
  const response: Response = await fetch(api_url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  return await response.json();
};
