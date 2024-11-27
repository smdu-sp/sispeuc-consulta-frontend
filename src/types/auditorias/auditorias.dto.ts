export interface AuditoriaResponseDTO {
  id: number,
  nomeRota: string,
  registroId: string,
  usuarioId: string,
  acaoTipo: string,
  registroTipo: string,
  alteracao: AuditoriaAlteracaoDTO,
  criadoEm: Date
}

interface AuditoriaAlteracaoDTO {
  servico: boolean,
  tipoUso: string,
  comercio: boolean,
  imovelId: number,
  descricao: string,
  industria: boolean,
  processoId: number,
  unifamiliar: boolean,
  dataVistoria: Date
  tipoVistoria: string,
  multifamiliar: boolean,
  tipoTipologia: string,
  qtdePavimentos: number,
  usoPodaVegetacao: boolean,
  usoFachadaBoaCondicao: boolean,
  areaLoteTotalConstatada: number,
  usoEsquadriaBoaCondicao: boolean,
  indiceOcupacaoConstatado: number,
  areaConstruidaNaoComputavel: number,
  areaCoberturaTotalConstatada: number,
  areaConstruidaTotalConstatada: number
}
