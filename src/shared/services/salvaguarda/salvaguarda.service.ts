'use server'

const api_url: string = 'http://localhost:3000';

// pode receber id, entityId, descrição e um arquivo
export const enviarArquivo = async (data: FormData): Promise<string> => {
  const url: string = `${api_url}/enviar-arquivo`;
  const response: Response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data
  });
  if (response.status != 201) throw new Error('Erro ao salvar arquivo');
  const file_url: string = await response.json();
  return file_url;
}

export const enviarArquivos = async (data: FormData): Promise<string[]> => {
  const url: string = `${api_url}/enviar-arquivos`;
  const response: Response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data
  });
  if (response.status != 201) throw new Error('Erro ao salvar os arquivos');
  const file_urls: string[] = await response.json();
  return file_urls;
}

export const obterArquivos = async (filename: string): Promise<string> => {
  const url: string = `${api_url}/obter-arquivos/${filename}`;
  const response: Response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (response.status != 200) throw new Error('Erro ao buscar arquivos');
  const file_url: string = await response.json();
  return file_url;
};

export const deleteArquivo = async (filename: string): Promise<void> => {
  const url: string = `${api_url}/excluir/${filename}`;
  const response: Response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  if (response.status != 200) throw new Error('Erro ao deletar o arquivo');
}
