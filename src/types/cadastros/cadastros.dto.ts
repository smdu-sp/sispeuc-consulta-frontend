import { UUID } from "crypto";

export interface CadastrosRequestDTO {
  processo: ProcessoRequestDTO,
  imovel: ImovelRequestDto[]
}

export interface ProcessoRequestDTO {
  autuacaoSei: string,
  imovelContiguidade: boolean,
  areaConstruidaTotal: number,
  areaLoteTotal: number,
  prospeccaoOrigem: string,
  prospeccaoTipologia: string,
  prospeccaoData: Date,
  estado: string
}

export interface ProcessoResponseDTO {
  id: number,
  autuacaoSei: string,
  imovelContiguidade: boolean,
  estado: string,
  areaConstruidaTotal: number,
  areaLoteTotal: number,
  prospeccaoOrigem: string,
  prospeccaoTipologia: string,
  prospeccaoData: Date,
  usuarioId: UUID,
  criadoEm: Date,
  atualizadoEm: Date,
  arquivado: boolean
}

export interface ImovelRequestDto {
  sqlSetor?: number;
  sqlQuadra?: number;
  sqlLote?: number;
  sqlDigito?: number;
  sqlPai: number;
  sqlFilho: number;

  registroNotasReferencia?: string;
  
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoReferencia?: string;
  enderecoDistrito?: string;
  enderecoCep?: string;
  enderecoSubprefeitura?: string;
  enderecoSubprefeituraSigla?: string;
  enderecoMacroarea?: string;
  enderecoMacroareaSigla?: string;
  enderecoZona?: string;
  enderecoZonaSigla?: string;
  areaConstruidaTotalRegistrada?: number;
  areaLoteTotalRegistrada?: number;
  areaCoeficienteAproveitamento?: number;
  areaCoeficienteAproveitamentoMinimo?: number;
  geoEpsg?: number;
  decretoNumero?: string;
  decretoTipo?: string;
  tombamentoCompresp?: string;
  tombamentoCondephat?: string;
  tombamentoIphan?: string;
  usuarioId: string;
}

export interface ImovelResponseDto {
  id: number,
  sqlSetor?: number;
  sqlQuadra?: number;
  sqlLote?: number;
  sqlDigito?: number;
  sqlPai: number;
  sqlFilho: number;
  registroNotasReferencia?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoReferencia?: string;
  enderecoDistrito?: string;
  enderecoCep?: string;
  enderecoSubprefeitura?: string;
  enderecoSubprefeituraSigla?: string;
  enderecoMacroarea?: string;
  enderecoMacroareaSigla?: string;
  enderecoZona?: string;
  enderecoZonaSigla?: string;
  areaConstruidaTotalRegistrada?: number;
  areaLoteTotalRegistrada?: number;
  areaCoeficienteAproveitamento?: number;
  areaCoeficienteAproveitamentoMinimo?: number;
  geoEpsg?: number;
  decretoNumero?: string;
  decretoTipo?: string;
  tombamentoCompresp?: string;
  tombamentoCondephat?: string;
  tombamentoIphan?: string;
  usuarioId: string;
  criadoEm: Date,
  atualizadoEm: Date,
  deletado: boolean,
  imovelProcessoId: number
}

export interface CadastrosResponseDTO {
  id: number,
  autuacaoSei: string,
  autuacaoData: Date,
  imovelContiguidade: boolean,
  areaConstruidaTotal: number,
  areaLoteTotal: number,
  prospeccaoOrigem: string,
  prospeccaoTipologia: string,
  prospeccaoData: Date,
  estado: string,
  usuarioId: string,
  criadoEm: Date,
  atualizadoEm: Date,
  arquivado: boolean,
  ProcessoImovel: {
    id: number,
    seiId?: number, 
    sqlId?: number,
    sqlSetor?: number;
    sqlQuadra?: number;
    sqlLote?: number;
    sqlDigito?: number;
    sqlPai: number;
    sqlFilho: number;
    registroNotasReferencia?: string;
    enderecoLogradouro?: string;
    enderecoNumero?: string;
    enderecoComplemento?: string;
    enderecoReferencia?: string;
    enderecoDistrito?: string;
    enderecoCep?: string;
    enderecoSubprefeitura?: string;
    enderecoSubprefeituraSigla?: string;
    enderecoMacroarea?: string;
    enderecoMacroareaSigla?: string;
    enderecoZona?: string;
    enderecoZonaSigla?: string;
    areaConstruidaTotalRegistrada?: number;
    areaLoteTotalRegistrada?: number;
    areaCoeficienteAproveitamento?: number;
    areaCoeficienteAproveitamentoMinimo?: number;
    geoEpsg?: number;
    decretoNumero?: string;
    decretoTipo?: string;
    tombamentoCompresp?: string;
    tombamentoCondephat?: string;
    tombamentoIphan?: string;
    usuarioId: string;
    criadoEm: Date,
    atualizadoEm: Date,
    deletado: boolean,
    imovelProcessoId: number
  }[]
}

export interface CadastroPaginationDTO {
  total: number,
  pagina: number,
  limite: number,
  data: CadastrosResponseDTO[]
}
