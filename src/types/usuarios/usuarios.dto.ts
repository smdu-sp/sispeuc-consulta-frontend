export interface UsuariosRequestDTO {
  nome: string;
  login: string;
  email: string;
  permissao?: string;
  status?: number;
}

export interface UsuariosResponseDTO {
  id: string,
  nome: string,
  login: string,
  email: string,
  permissao: string,
  status: number,
  ultimologin: Date,
  criadoEm: Date,
  atualizadoEm: Date
}

export interface UsuariosPaginadoResponseDTO {
  total: number,
  pagina: number,
  limite: number,
  data: UsuariosResponseDTO[]
}
