export interface CepResponseDTO {
  cep: string;
  logradouro: string;
  complemento: string
  unidade: string,
  bairro: string,
  localidade: string,
  uf: string,
  estado: string,
  regiao: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string
}


export const getCep = async (cep: string): Promise<CepResponseDTO> => {
  const response: Response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', }
  });
  if (response.status != 200) throw new Error(`erro ao tentar buscar o cep: ${cep}`);
  const data: CepResponseDTO = await response.json();
  return data;
};
