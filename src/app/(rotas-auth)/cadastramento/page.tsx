'use client'

import Content from '@/components/Content';
import { useEffect, useState, useContext, useRef } from 'react';
import { Box, Button, Input, Tooltip, Typography, useTheme, IconButton, Dropdown, MenuButton, Menu, MenuItem, ListItemDecorator, ListDivider, Checkbox, Stack, Snackbar, Divider } from '@mui/joy';
import 'react-material-symbols/rounded';
import * as React from 'react';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useRouter, useSearchParams } from 'next/navigation';
import * as cadastroServices from '@/shared/services/cadastros/cadastros.service';
import { CadastroPaginationDTO, CadastrosResponseDTO } from '@/types/cadastros/cadastros.dto';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AlertsContext } from "@/providers/alertsProvider";
import { Check, DeleteForever, Edit, MoreVert } from '@mui/icons-material';
import { MenuList } from '@mui/material';
import ViewWeekSharpIcon from '@mui/icons-material/ViewWeekSharp';
import WarningIcon from '@mui/icons-material/Warning';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { set } from 'zod';

export default function Cadastramento() {
  const [autuacaoSei, setAutuacaoSei] = useState<boolean>(true);
  const [imovelContiguidade, setImovelContiguidade] = useState<boolean>(true);
  const [areaConstruidaTotal, setAreaConstruidaTotal] = useState<boolean>(true);
  const [areaLoteTotal, setAreaLoteTotal] = useState<boolean>(true);
  const [prospeccaoOrigem, setProspeccaoOrigem] = useState<boolean>(true);
  const [prospeccaoTipologia, setProspeccaoTipologia] = useState<boolean>(true);
  const [prospeccaoData, setProspeccaoData] = useState<boolean>(false);
  const [estado, setEstado] = useState<boolean>(false);

  const [sqlSetor, setSqlSetor] = useState<boolean>(true);
  const [sqlQuadra, setSqlQuadra] = useState<boolean>(true);
  const [sqlLote, setSqlLote] = useState<boolean>(true);
  const [sqlDigito, setSqlDigito] = useState<boolean>(false);
  const [sqlPai, setSqlPai] = useState<boolean>(false);
  const [sqlFilho, setSqlFilho] = useState<boolean>(false);

  const [registroNotasReferencia, setRegistroNotasReferencia] = useState<boolean>(false);
  const [enderecoLogradouro, setEnderecoLogradouro] = useState<boolean>(true);
  const [enderecoNumero, setEnderecoNumero] = useState<boolean>(true);
  const [enderecoComplemento, setEnderecoComplemento] = useState<boolean>(true);
  const [enderecoReferencia, setEnderecoReferencia] = useState<boolean>(false);
  const [enderecoDistrito, setEnderecoDistrito] = useState<boolean>(false);
  const [enderecoCep, setEnderecoCep] = useState<boolean>(true);
  const [enderecoSubprefeitura, setEnderecoSubprefeitura] = useState<boolean>(false);
  const [enderecoSubprefeituraSigla, setEnderecoSubprefeituraSigla] = useState<boolean>(false);
  const [enderecoMacroarea, setEnderecoMacroarea] = useState<boolean>(false);
  const [enderecoMacroareaSigla, setEnderecoMacroareaSigla] = useState<boolean>(false);
  const [enderecoZona, setEnderecoZona] = useState<boolean>(false);
  const [enderecoZonaSigla, setEnderecoZonaSigla] = useState<boolean>(false);

  const [areaConstruidaTotalRegistrada, setAreaConstruidaTotalRegistrada] = useState<boolean>(false);
  const [areaLoteTotalRegistrada, setAreaLoteTotalRegistrada] = useState<boolean>(false);
  const [areaCoeficienteAproveitamento, setAreaCoeficienteAproveitamento] = useState<boolean>(false);
  const [areaCoeficienteAproveitamentoMinimo, setAreaCoeficienteAproveitamentoMinimo] = useState<boolean>(false);

  const [geoEpsg, setGeoEpsg] = useState<boolean>(false);
  const [decretoNumero, setDecretoNumero] = useState<boolean>(true);
  const [decretoTipo, setDecretoTipo] = useState<boolean>(true);
  const [tombamentoCompresp, setTombamentoCompresp] = useState<boolean>(false);
  const [tombamentoCondephat, setTombamentoCondephat] = useState<boolean>(false);
  const [tombamentoIphan, setTombamentoIphan] = useState<boolean>(false);

  const [confirma, setConfirma] = useState(false)
  const [id, setId] = useState('')
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [pagina, setPagina] = useState(searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1);
  const [limite, setLimite] = useState(searchParams.get('limite') ? Number(searchParams.get('limite')) : 10);
  const [total, setTotal] = useState(searchParams.get('total') ? Number(searchParams.get('total')) : 1);
  const [status, setStatus] = useState<string>(searchParams.get('status') ? searchParams.get('status') + '' : 'false');
  const [busca, setBusca] = useState(searchParams.get('busca') || '');

  const router = useRouter();
  const [rows, setRows] = useState<CadastrosResponseDTO[]>([]);
  const searchParam = useSearchParams();
  const { setAlert } = useContext(AlertsContext);


  const getProcessos = async () => {
    await cadastroServices.getAllProcessos(pagina, limite, busca, status).then((response: CadastroPaginationDTO) => {
      setRows(response.data);
      setTotal(response.total);
    })
  };

  const confirmaOperacao = async () => {
    await cadastroServices.deleteCadastro(id)
      .then((response) => {
        if (response) {
          setAlert('Processo Deletado!', 'Processo deletado com sucesso!', 'warning', 3000, WarningIcon);
          setConfirma(false)
          getProcessos()
        }
      })
  }

  const tableRef = useRef<HTMLTableElement>(null);
  const [tableSize, setTableSize] = useState(0);
  useEffect(() => {
    setTableSize(tableRef.current?.offsetWidth || 0);
    const updateSize = () => {
      if (tableRef.current) {
        setTableSize(tableRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [tableSize]);

  const notificacao = () => {
    const att = searchParam.get('att');
    const add = searchParam.get('add');
    if (att === '0') {
      setAlert('Processo Atualizado!', 'Processo atualizado com sucesso!', 'success', 3000, Check);
    }
    if (add === '0') {
      setAlert('Processo Criado!', 'Processo criado com sucesso!', 'success', 3000, Check);

    }
  }



  useEffect(() => {
    getProcessos();
    notificacao();
  }, []);

  const [openRows, setOpenRows] = React.useState<any>({});

  const handleRowToggle = (id: any) => {
    setOpenRows((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  return (
    <Content
      breadcrumbs={[{ label: 'Cadastramento', href: '/cadastramento' }]}
      titulo="Cadastramento"
      pagina="Cadastramento"
    >
      <Snackbar
        variant="solid"
        color="danger"
        size="lg"
        invertedColors
        open={confirma}
        onClose={() => { setConfirma(false); setId('') }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ maxWidth: 360 }}
      >
        <div>
          <Typography level="title-lg">Deletar Vistoria!</Typography>
          <Typography sx={{ mt: 1, mb: 2 }} level="title-md">Tem certeza que deseja deletar esta vistoria?</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="solid" color="primary" onClick={() => confirmaOperacao()}>
              Sim
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setConfirma(false)}
            >
              Não
            </Button>
          </Stack>
        </div>
      </Snackbar>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', gap: 3, mb: 5 }}>
        <Button
          onClick={() => { router.push('/cadastramento/detalhes') }}
          sx={{ bgcolor: 'text.primary', color: 'background.body', '&:hover': { bgcolor: 'text.primary', color: 'background.body' } }}
          startDecorator={<AddIcon sx={{ height: 20, width: 20 }} />}
        >
          Criar Cadastro
        </Button>
      </Box>
      <Sheet sx={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, boxShadow: 'xs' }}>
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          {/* <Select
            placeholder="Selecione um tipo"
            indicator={<KeyboardArrowDown />}
            sx={{
              width: 350,
            }}
          >
            <Option value={0}>Ativos</Option>
            <Option value={1}>Deletados</Option>
          </Select> */}
          <Input
            startDecorator={<SearchIcon sx={{ width: 20, height: 20 }} />}
            placeholder={'Pesquise por SQL'}
            sx={{ width: '100%' }}
            value={busca}
            onChange={(e) => { setBusca(e.target.value) }}
            onKeyDown={(e) => { if (e.key === 'Enter') { getProcessos() } }}
          />
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
              sx={{ width: 40 }}
            >
              <ViewWeekSharpIcon sx={{ height: 20, width: 20 }} />
            </MenuButton>
            <Menu placement="bottom-end">
              <MenuList sx={{ fontWeight: 'bold', pl: 2 }}>Tabela Principal</MenuList>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: '50%' }}>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAutuacaoSei(!autuacaoSei)} checked={autuacaoSei} label="Autuação SEI" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setImovelContiguidade(!imovelContiguidade)} checked={imovelContiguidade} label="Imóvel contiguidade" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaConstruidaTotal(!areaConstruidaTotal)} checked={areaConstruidaTotal} label="Area construída total" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaLoteTotal(!areaLoteTotal)} checked={areaLoteTotal} label="Area lote total" /></MenuList>
                </Box>
                <Box sx={{ width: '50%' }}>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setProspeccaoTipologia(!prospeccaoTipologia)} checked={prospeccaoTipologia} label="Tipologia prospecção" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setProspeccaoData(!prospeccaoData)} checked={prospeccaoData} label="Data prospecção" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEstado(!estado)} checked={estado} label="Estado" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setProspeccaoOrigem(!prospeccaoOrigem)} checked={prospeccaoOrigem} label="Origem prospeccao" /></MenuList>
                </Box>
              </Box>
              <ListDivider />
              <MenuList sx={{ p: 2, fontWeight: 'bold' }}>Tabela de Informações</MenuList>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setSqlSetor(!sqlSetor)} checked={sqlSetor} label="SQL Setor" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setSqlQuadra(!sqlQuadra)} checked={sqlQuadra} label="SQL Quadra" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setSqlLote(!sqlLote)} checked={sqlLote} label="SQL Lote" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setSqlDigito(!sqlDigito)} checked={sqlDigito} label="SQL Digito" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setSqlPai(!sqlPai)} checked={sqlPai} label="SQL Pai" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setSqlFilho(!sqlFilho)} checked={sqlFilho} label="SQL Filho" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setRegistroNotasReferencia(!registroNotasReferencia)} checked={registroNotasReferencia} label="Notas Referencia" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoLogradouro(!enderecoLogradouro)} checked={enderecoLogradouro} label="Logradouro" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoNumero(!enderecoNumero)} checked={enderecoNumero} label="Numero" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoComplemento(!enderecoComplemento)} checked={enderecoComplemento} label="Complemento" /></MenuList>
                </Box>
                <Box>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoReferencia(!enderecoReferencia)} checked={enderecoReferencia} label="Endereco Referencia" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoDistrito(!enderecoDistrito)} checked={enderecoDistrito} label="Endereco Distrito" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoCep(!enderecoCep)} checked={enderecoCep} label="CEP" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoSubprefeitura(!enderecoSubprefeitura)} checked={enderecoSubprefeitura} label="Endereco Subprefeitura" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoSubprefeituraSigla(!enderecoSubprefeituraSigla)} checked={enderecoSubprefeituraSigla} label="Subprefeitura Sigla" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoMacroarea(!enderecoMacroarea)} checked={enderecoMacroarea} label="Endereco Macroarea" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoMacroareaSigla(!enderecoMacroareaSigla)} checked={enderecoMacroareaSigla} label="Macroarea Sigla" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoZona(!enderecoZona)} checked={enderecoZona} label="Endereco Zona" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setEnderecoZonaSigla(!enderecoZonaSigla)} checked={enderecoZonaSigla} label="Zona Sigla" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaConstruidaTotalRegistrada(!areaConstruidaTotalRegistrada)} checked={areaConstruidaTotalRegistrada} label="Area Construida Total Registrada" /></MenuList>
                </Box>
                <Box>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaLoteTotalRegistrada(!areaLoteTotalRegistrada)} checked={areaLoteTotalRegistrada} label="Area Lote Total Registrada" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaCoeficienteAproveitamento(!areaCoeficienteAproveitamento)} checked={areaCoeficienteAproveitamento} label="Area Coeficiente Aproveitamento" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaCoeficienteAproveitamentoMinimo(!areaCoeficienteAproveitamentoMinimo)} checked={areaCoeficienteAproveitamentoMinimo} label="Area Coeficiente Aproveitamento Minimo" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setGeoEpsg(!geoEpsg)} checked={geoEpsg} label="EPSG" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setDecretoNumero(!decretoNumero)} checked={decretoNumero} label="Numero Decreto" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setDecretoTipo(!decretoTipo)} checked={decretoTipo} label="Tipo Decreto" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setTombamentoCompresp(!tombamentoCompresp)} checked={tombamentoCompresp} label="Compresp Tombamento" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setTombamentoCondephat(!tombamentoCondephat)} checked={tombamentoCondephat} label="Condephat Tombamento" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setTombamentoIphan(!tombamentoIphan)} checked={tombamentoIphan} label="Iphan Tombamento" /></MenuList>
                </Box>
              </Box>
            </Menu>
          </Dropdown>
        </Box>
        <Table sx={{ bgcolor: 'background.level1' }} aria-label="collapsible table" ref={tableRef}>
          <thead>
            <tr>
              <th style={{ backgroundColor: 'transparent', width: '5%' }}>ID</th>
              {autuacaoSei ? <th style={{ backgroundColor: 'transparent' }}>Autuação Sei</th> : null}
              {imovelContiguidade ? <th style={{ backgroundColor: 'transparent' }}>Imóvel Contiguidade</th> : null}
              {areaConstruidaTotal ? <th style={{ backgroundColor: 'transparent' }}>Area Total Construida</th> : null}
              {areaLoteTotal ? <th style={{ backgroundColor: 'transparent' }}>Area Lote Total</th> : null}
              {prospeccaoOrigem ? <th style={{ backgroundColor: 'transparent' }}>Origem prospecção</th> : null}
              {prospeccaoTipologia ? <th style={{ backgroundColor: 'transparent' }}>Prospecção Tipologia</th> : null}
              {prospeccaoData ? <th style={{ backgroundColor: 'transparent' }}>Prospecção Data</th> : null}
              {estado ? <th style={{ backgroundColor: 'transparent' }}>Estado</th> : null}
              <th style={{ backgroundColor: 'transparent', width: '4%' }} aria-label="empty" />
              <th style={{ backgroundColor: 'transparent', width: '4%' }} aria-label="empty" />
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? rows.map((row: CadastrosResponseDTO) => (
              <React.Fragment key={row.id}>
                <Tooltip title={row.autuacaoSei} color="neutral" placement="bottom" variant={'outlined'}>
                  <tr>
                    <td style={{ backgroundColor: theme.palette.background.surface }}># {row.id}</td>
                    {autuacaoSei ? <td style={{ backgroundColor: theme.palette.background.surface }}>{row.autuacaoSei}</td> : null}
                    {imovelContiguidade ? <td style={{ backgroundColor: theme.palette.background.surface }}>{row.imovelContiguidade ? 'Contiguidade' : 'Não Contiguidade'}</td> : null}
                    {areaConstruidaTotal ? <td style={{ backgroundColor: theme.palette.background.surface }}>{row.areaConstruidaTotal}</td> : null}
                    {areaLoteTotal ? <td style={{ backgroundColor: theme.palette.background.surface }}>{row.areaLoteTotal}</td> : null}
                    {prospeccaoOrigem ? <td style={{ backgroundColor: theme.palette.background.surface }}>{row.prospeccaoOrigem == 'mapaColaborativo' ? 'Mapa Colaborativo' : row.prospeccaoOrigem}</td> : null}
                    {prospeccaoTipologia ? <td style={{ backgroundColor: theme.palette.background.surface }}>{row.prospeccaoTipologia}</td> : null}
                    {prospeccaoData ? <td style={{ backgroundColor: theme.palette.background.surface }}>{new Date(row.prospeccaoData).toLocaleDateString()}</td> : null}
                    {estado ? <td style={{ backgroundColor: theme.palette.background.surface }}>{row.estado}</td> : null}
                    <td style={{ backgroundColor: theme.palette.background.surface }}>
                      <IconButton
                        aria-label="expand row"
                        variant="plain"
                        color="neutral"
                        size="sm"
                        onClick={() => handleRowToggle(row.id)}
                      >
                        <KeyboardArrowUpIcon sx={{ transition: '0.2s', transform: openRows[row.id] ? 'rotate(0deg)' : 'rotate(180deg)' }} />
                      </IconButton>
                    </td>
                    <td style={{ backgroundColor: theme.palette.background.surface }}>
                      <Dropdown>
                        <MenuButton
                          slots={{ root: IconButton }}
                          slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                        >
                          <MoreVert />
                        </MenuButton>
                        <Menu placement="bottom-end">
                          <MenuItem onClick={() => { router.push('/cadastramento/detalhes/' + row.id) }}>
                            <ListItemDecorator>
                              <Edit />
                            </ListItemDecorator>{' '}
                            Editar Cadastro
                          </MenuItem>
                          <ListDivider />
                          <MenuItem variant="soft" color="danger">
                            <ListItemDecorator sx={{ color: 'inherit' }}>
                              <DeleteForever />
                            </ListItemDecorator>{' '}
                            Deletar
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </td>
                  </tr>
                </Tooltip>
                {openRows[row.id] && (
                  <Sheet variant="soft" sx={{ p: 1.6, height: '100%', width: tableSize }}>
                    <Box sx={{ bgcolor: 'background.body', p: 1, borderRadius: 10, height: '100%' }}>
                      <Typography sx={{ fontWeight: 900, fontSize: '14px', lineHeight: '22px', pb: 1, pl: 1 }}>
                        Imóvel | Imoves vinculados
                      </Typography>
                      <Table >
                        <thead>
                          <tr>
                            <th style={{ width: '5%', borderBottomColor: 'transparent' }}>ID</th>
                            {sqlSetor ? <th style={{ borderBottomColor: 'transparent' }}>SQL Setor</th> : null}
                            {sqlQuadra ? <th style={{ borderBottomColor: 'transparent' }}>SQL Quadra</th> : null}
                            {sqlLote ? <th style={{ borderBottomColor: 'transparent' }}>SQL Lote</th> : null}
                            {sqlDigito ? <th style={{ borderBottomColor: 'transparent' }}>SQL digito</th> : null}
                            {sqlPai ? <th style={{ borderBottomColor: 'transparent' }}>SQL Pai</th> : null}
                            {sqlFilho ? <th style={{ borderBottomColor: 'transparent' }}>SQL Filho</th> : null}
                            {registroNotasReferencia ? <th style={{ borderBottomColor: 'transparent' }}>Registro Notas Referencia</th> : null}
                            {enderecoLogradouro ? <th style={{ borderBottomColor: 'transparent' }}>Logradouro</th> : null}
                            {enderecoNumero ? <th style={{ borderBottomColor: 'transparent' }}>Numero</th> : null}
                            {enderecoComplemento ? <th style={{ borderBottomColor: 'transparent' }}>Complemento</th> : null}
                            {enderecoReferencia ? <th style={{ borderBottomColor: 'transparent' }}>Referencia</th> : null}
                            {enderecoDistrito ? <th style={{ borderBottomColor: 'transparent' }}>Distrito</th> : null}
                            {enderecoCep ? <th style={{ borderBottomColor: 'transparent' }}>CEP</th> : null}
                            {enderecoSubprefeitura ? <th style={{ borderBottomColor: 'transparent' }}>Subprefeitura</th> : null}
                            {enderecoSubprefeituraSigla ? <th style={{ borderBottomColor: 'transparent' }}>Subprefeitura sigla</th> : null}
                            {enderecoMacroarea ? <th style={{ borderBottomColor: 'transparent' }}>Macroarea</th> : null}
                            {enderecoMacroareaSigla ? <th style={{ borderBottomColor: 'transparent' }}>Macroarea sigla</th> : null}
                            {enderecoZona ? <th style={{ borderBottomColor: 'transparent' }}>Zona</th> : null}
                            {enderecoZonaSigla ? <th style={{ borderBottomColor: 'transparent' }}>Zona sigla</th> : null}
                            {areaConstruidaTotalRegistrada ? <th style={{ borderBottomColor: 'transparent' }}>Area Construida Total Registrada</th> : null}
                            {areaLoteTotalRegistrada ? <th style={{ borderBottomColor: 'transparent' }}>Area Lote Total Registrada</th> : null}
                            {areaCoeficienteAproveitamento ? <th style={{ borderBottomColor: 'transparent' }}>Area Coeficiente Aproveitamento</th> : null}
                            {areaCoeficienteAproveitamentoMinimo ? <th style={{ borderBottomColor: 'transparent' }}>Area Coeficiente Aproveitamento Minimo</th> : null}
                            {geoEpsg ? <th style={{ borderBottomColor: 'transparent' }}>Geo EPSG</th> : null}
                            {decretoNumero ? <th style={{ borderBottomColor: 'transparent' }}>Numero Decreto</th> : null}
                            {decretoTipo ? <th style={{ borderBottomColor: 'transparent' }}>Tipo Decreto</th> : null}
                            {tombamentoCompresp ? <th style={{ borderBottomColor: 'transparent' }}>Tombamento Compresp</th> : null}
                            {tombamentoCondephat ? <th style={{ borderBottomColor: 'transparent' }}>Tombamento Condephat</th> : null}
                            {tombamentoIphan ? <th style={{ borderBottomColor: 'transparent' }}>Tombamento Iphan</th> : null}
                            <th style={{ width: '4%', borderBottomColor: 'transparent' }} aria-label="empty" />
                          </tr>
                        </thead>
                        <tbody>
                          {row.ProcessoImovel && row.ProcessoImovel.length > 0 && row.ProcessoImovel.map((row) => (
                            <tr key={row.id}>
                              <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.id}</td>
                              {sqlSetor ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.sqlSetor}</td> : null}
                              {sqlQuadra ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.sqlQuadra}</td> : null}
                              {sqlLote ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.sqlLote}</td> : null}
                              {sqlDigito ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.sqlDigito}</td> : null}
                              {sqlPai ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.sqlPai}</td> : null}
                              {sqlFilho ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.sqlFilho}</td> : null}
                              {registroNotasReferencia ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.registroNotasReferencia}</td> : null}
                              {enderecoLogradouro ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoLogradouro}</td> : null}
                              {enderecoNumero ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoNumero}</td> : null}
                              {enderecoComplemento ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoComplemento}</td> : null}
                              {enderecoReferencia ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoReferencia}</td> : null}
                              {enderecoDistrito ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoDistrito}</td> : null}
                              {enderecoCep ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoCep}</td> : null}
                              {enderecoSubprefeitura ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoSubprefeitura}</td> : null}
                              {enderecoSubprefeituraSigla ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoSubprefeitura}</td> : null}
                              {enderecoMacroarea ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoMacroarea}</td> : null}
                              {enderecoMacroareaSigla ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoMacroareaSigla}</td> : null}
                              {enderecoZona ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoZona}</td> : null}
                              {enderecoZonaSigla ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.enderecoZonaSigla}</td> : null}
                              {areaConstruidaTotalRegistrada ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.areaConstruidaTotalRegistrada}</td> : null}
                              {areaLoteTotalRegistrada ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.areaLoteTotalRegistrada}</td> : null}
                              {areaCoeficienteAproveitamento ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.areaCoeficienteAproveitamento}</td> : null}
                              {areaCoeficienteAproveitamentoMinimo ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.areaCoeficienteAproveitamentoMinimo}</td> : null}
                              {geoEpsg ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.geoEpsg}</td> : null}
                              {decretoNumero ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.decretoNumero}</td> : null}
                              {decretoTipo ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.decretoTipo}</td> : null}
                              {tombamentoCompresp ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.tombamentoCompresp}</td> : null}
                              {tombamentoCondephat ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.tombamentoCondephat}</td> : null}
                              {tombamentoIphan ? <td style={{ padding: 6, height: 5, paddingLeft: 8 }}>{row.tombamentoIphan}</td> : null}
                              <td style={{ padding: 6, height: 5, paddingLeft: 8 }}><IconButton onClick={() => { router.push(`/vistoria/detalhes?imovelId=${row.id}`) }}><FindInPageIcon /></IconButton></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Box>
                  </Sheet>
                )}
              </React.Fragment>
            )) : <tr style={{ textAlign: 'center', width: tableSize, padding: 1, fontWeight: 'bold' }}>
              <td colSpan={10} style={{ textAlign: 'center', width: tableSize, padding: 1, fontWeight: 'bold' }}>
                Nenhum registro encontrado
              </td>
            </tr>}
          </tbody>
        </Table>
        <Box sx={{ display: 'flex', gap: 2, p: 2, justifyContent: 'end', alignItems: 'center' }}>
          <Typography level="body-sm" sx={{ fontWeight: 'bold', mr: -2 }}>Linhas por página:</Typography>
          <Select
            variant='plain'
            value={limite}
            onChange={(_, value) => { setLimite(value ? parseInt(value.toString()) : 0), getProcessos() }}
          >
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={30}>30</Option>
          </Select>
          <Typography level="body-sm" sx={{ fontWeight: 'bold' }}>{pagina} de {(total / limite) > 0 ? Math.ceil(total / limite) : 1}</Typography>
          <Box>
            <IconButton disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton disabled={pagina === Math.ceil(total / limite)} onClick={() => setPagina(pagina + 1)} >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Box>
        </Box>
      </Sheet>
    </Content>
  );
}