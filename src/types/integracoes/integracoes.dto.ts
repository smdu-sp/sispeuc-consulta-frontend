export interface GeosampaGeometryDTO {
  type: string;
  coordinates: number[][][];
}

export interface GeosampaPropertiesDTO {
  cd_identificador: number;
  cd_identificador_original_lote: number;
  cd_setor_fiscal: string;
  cd_tipo_quadra: string;
  tx_tipo_quadra: string;
  cd_quadra_fiscal: string;
  cd_subquadra_fiscal: string;
  cd_condominio: string;
  cd_tipo_lote: string;
  tx_tipo_lote: string;
  cd_lote: string;
  cd_situacao: number;
  cd_digito_sql: string;
  cd_logradouro: string;
  nm_logradouro_completo: string;
  cd_numero_porta: string;
  tx_complemento_endereco: string;
  tx_situ_lote: string;
  cd_tipo_uso_imovel: string;
  dc_tipo_uso_imovel: string;
  cd_tipo_terreno_imovel: number;
  qt_area_terreno: number;
  qt_area_construida: number;
}

export interface GeosampaFeatureDTO {
  type: string;
  id: string;
  geometry: GeosampaGeometryDTO;
  geometry_name: string;
  properties: GeosampaPropertiesDTO;
}

export interface GeosampaCollectionDTO {
  type: string;
  features: GeosampaFeatureDTO[];
}
