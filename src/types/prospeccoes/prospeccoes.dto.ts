import { boolean } from "zod"

export interface ProspeccoesRequestDTO {
  seiId: number,
  sqlId: number,
  sqlSetor: number,
  sqlQuadra: number,
  sqlLote: number,
  sqlDigito: number,
  sqlPai: number,
  sqlFilho: number,
  registroNotasReferencia: string,
  enderecoLogradouro: string,
  enderecoNumero: string,
  enderecoComplemento: string,
  enderecoReferencia: string,
  enderecoDistrito: string,
  enderecoCep: string,
  enderecoSubprefeitura: string,
  enderecoSubprefeituraSigla: string,
  enderecoMacroarea: string,
  enderecoMacroareaSigla: string,
  enderecoZona: string,
  enderecoZonaSigla: string,
  areaConstruidaTotalRegistrada: number,
  areaLoteTotalRegistrada: number,
  areaCoeficienteAproveitamento: number,
  areaCoeficienteAproveitamentoMinimo: number,
  geoEpsg: number,
  decretoNumero: string,
  decretoTipo: string,
  tombamentoCompresp: string,
  tombamentoCondephat: string,
  tombamentoIphan: string
}

export interface ProspeccoesRequestEmMassaDTO {
  records: ProspeccoesRequestDTO[]
}

export interface ProspeccoesResponseDTO {
  id: number,
  seiId: number,
  sqlId: number,
  sqlSetor: number,
  sqlQuadra: number,
  sqlLote: number,
  sqlDigito: number,
  sqlPai: number,
  sqlFilho: number,
  registroNotasReferencia: string,
  enderecoLogradouro: string,
  enderecoNumero: string,
  enderecoComplemento: string,
  enderecoReferencia: string,
  enderecoDistrito: string,
  enderecoCep: string,
  enderecoSubprefeitura: string,
  enderecoSubprefeituraSigla: string,
  enderecoMacroarea: string,
  enderecoMacroareaSigla: string,
  enderecoZona: string,
  enderecoZonaSigla: string,
  areaConstruidaTotalRegistrada: number,
  areaLoteTotalRegistrada: number,
  areaCoeficienteAproveitamento: number,
  areaCoeficienteAproveitamentoMinimo: number,
  geoEpsg: number,
  decretoNumero: string,
  decretoTipo: string,
  tombamentoCompresp: string,
  tombamentoCondephat: string,
  tombamentoIphan: string,
  usuarioId: string,
  criadoEm: Date,
  atualizadoEm: Date,
  deletado: boolean,
  imovelProcessoId: number
}

export interface ProspeccoesQuantificarResponseDTO {
  Total: number,
  "Em prospecção": number,
  "Em preenchimento": number,
  "Candidato a vistoria": number
}
