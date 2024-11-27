'use client'

import Content from '@/components/Content';
import { useEffect, useState, useContext, useRef } from 'react';
import { Box, Button, Input, Tooltip, Typography, useTheme, IconButton, Dropdown, MenuButton, Menu, ListDivider, Checkbox, Stack, Snackbar } from '@mui/joy';
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
import * as vistoriaServices from '@/shared/services/vistorias/vistoria.service';
import { VistoriaPaginationDTO, VistoriaResponseDTO } from '@/types/vistorias/vistorias.dto';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AlertsContext } from "@/providers/alertsProvider";
import { Check } from '@mui/icons-material';
import { MenuList } from '@mui/material';
import ViewWeekSharpIcon from '@mui/icons-material/ViewWeekSharp';
import WarningIcon from '@mui/icons-material/Warning';
import ModalImovelId from '@/components/modal-imovel-id';
export default function Prospeccao() {

  const [processo, setProcesso] = useState<boolean>(true);
  const [imovel, setImovel] = useState<boolean>(true);
  const [tipoVistoria, setTipoVistoria] = useState<boolean>(true);
  const [tipologia, setTipologia] = useState<boolean>(true);
  const [tipoUso, setTipoUso] = useState<boolean>(true);
  const [dataVistoria, setDataVistoria] = useState<boolean>(true);
  const [areaConstruidaTotalConstatada, setAreaConstruidaTotalConstatada] = useState<boolean>(false);
  const [areaLoteTotalConstatada, setAreaLoteTotalConstatada] = useState<boolean>(false);
  const [areaCoberturaTotalConstatada, setAreaCoberturaTotalConstatada] = useState<boolean>(false);
  const [indiceOcupacaoConstatado, setIndiceOcupacaoConstatado] = useState<boolean>(false);
  const [qtdePavimentos, setQtdePavimentos] = useState<boolean>(true);
  const [familiar, setFamiliar] = useState<boolean>(true);
  const [multifamiliar, setMultifamiliar] = useState<boolean>(true);
  const [comercio, setComercio] = useState<boolean>(true);
  const [servico, setServico] = useState<boolean>(true);
  const [industria, setIndustria] = useState<boolean>(true);
  const [usoFachadaBoaCondicao, setUsoFachadaBoaCondicao] = useState<boolean>(true);
  const [usoEsquadriaBoaCondicao, setUsoEsquadriaBoaCondicao] = useState<boolean>(true);
  const [usoPodaVegetacao, setUsoPodaVegetacao] = useState<boolean>(true);
  const [areaConstruidaNaoComputavel, setAreaConstruidaNaoComputavel] = useState<boolean>(false);
  const [confirma, setConfirma] = useState(false)
  const [id, setId] = useState(0)
  const theme = useTheme();
  const backgroudLevel1 = theme.palette.background.level1;
  const searchParams = useSearchParams();
  const [pagina, setPagina] = useState(searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1);
  const [limite, setLimite] = useState(searchParams.get('limite') ? Number(searchParams.get('limite')) : 10);
  const [total, setTotal] = useState(searchParams.get('total') ? Number(searchParams.get('total')) : 1);
  const [status, setStatus] = useState<string>(searchParams.get('status') ? searchParams.get('status') + '' : 'false');
  const [openImovel, setOpenImovel] = useState<boolean>(false);

  const [busca, setBusca] = useState(searchParams.get('busca') || '');

  const vistorias = new Map<string, number | string | boolean>([
    ['presencial', 'Presencial'],
    ["remota", "Remota"],
    ["NC", 'NC']
  ]);

  const tipologias = new Map<string, number | string | boolean>([
    ['naoEdificado', 'Não Edificado'],
    ["naoUtilizado", 'Não Utilizado'],
    ["subutilizado", 'Subutilizado']
  ]);

  const tiposUsos = new Map<string, number | string | boolean>([
    ['residencial', 'Residencial'],
    ["misto", 'Misto'],
    ["naoResidencial", 'Não Residencial']
  ]);

  const router = useRouter();
  const [rows, setRows] = useState<VistoriaResponseDTO[]>([]);
  const searchParam = useSearchParams();
  const { setAlert } = useContext(AlertsContext);
  const getVistorias = async () => {
    await vistoriaServices.getAllVistorias(pagina, limite, busca, status).then((response: VistoriaPaginationDTO) => {
      setRows(response.data);
    })
  };

  const confirmaOperacao = async () => {
    await vistoriaServices.deleteVistoria(id)
      .then((response) => {
        if (response) {
          setAlert('Vistoria Deletada!', 'Vistoria deletada com sucesso!', 'warning', 3000, WarningIcon);
          setConfirma(false)
          getVistorias()
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
      setAlert('Vistoria Atualizada!', 'Vistoria atualizada com sucesso!', 'success', 3000, Check);
    }
    if (add === '0') {
      setAlert('Vistoria Criada!', 'Vistoria criada com sucesso!', 'success', 3000, Check);

    }
  }

  useEffect(() => {
    getVistorias();
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
      breadcrumbs={[{ label: 'Vistoria', href: '/vistoria' }]}
      titulo="Vistorias"
      pagina="vistoria"
    >
      <ModalImovelId
        open={openImovel}
        setOpen={setOpenImovel}
      />
      <Snackbar
        variant="solid"
        color="danger"
        size="lg"
        invertedColors
        open={confirma}
        onClose={() => { setConfirma(false); setId(0) }}
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
          onClick={() => setOpenImovel(true)}
          sx={{ bgcolor: 'text.primary', color: 'background.body', '&:hover': { bgcolor: 'text.primary', color: 'background.body' } }}
          startDecorator={<AddIcon sx={{ height: 20, width: 20 }} />}
        >
          Criar vistoria
        </Button>
      </Box>
      <Sheet sx={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, boxShadow: 'xs' }}>
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          <Select
            placeholder="Selecione um tipo"
            indicator={<KeyboardArrowDown />}
            onChange={(_, newValue) => {
              setStatus(newValue as string);
              getVistorias();
            }}
            sx={{
              width: 350,
            }}
          >
            <Option value={'true'}>Ativos</Option>
            <Option value={'false'}>Deletados</Option>
          </Select>
          <Input
            startDecorator={<SearchIcon sx={{ width: 20, height: 20 }} />}
            placeholder={'Pesquise por SQL'}
            sx={{ width: '100%' }}
            value={busca}
            onChange={(e) => { setBusca(e.target.value) }}
            onKeyDown={(e) => { if (e.key === 'Enter') { getVistorias() } }}
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
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setProcesso(!processo)} checked={processo} label="Processo" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setTipoVistoria(!tipoVistoria)} checked={tipoVistoria} label="Tipo vistoria" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setImovel(!imovel)} checked={imovel} label="Imovel" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setTipologia(!tipologia)} checked={tipologia} label="Tipologia" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setTipoUso(!tipoUso)} checked={tipoUso} label="Tipo uso" /></MenuList>
                </Box>
                <Box sx={{ width: '50%' }}>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setDataVistoria(!dataVistoria)} checked={dataVistoria} label="Data vistoria" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaConstruidaTotalConstatada(!areaConstruidaTotalConstatada)} checked={areaConstruidaTotalConstatada} label="Area construida constatada" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaLoteTotalConstatada(!areaLoteTotalConstatada)} checked={areaLoteTotalConstatada} label="Lote total constatada" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaCoberturaTotalConstatada(!areaCoberturaTotalConstatada)} checked={areaCoberturaTotalConstatada} label="Cober. total constatada" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setIndiceOcupacaoConstatado(!indiceOcupacaoConstatado)} checked={indiceOcupacaoConstatado} label="Índice Ocupacao" /></MenuList>
                </Box>
              </Box>
              <ListDivider />
              <MenuList sx={{ p: 2, fontWeight: 'bold' }}>Tabela de Informações</MenuList>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setQtdePavimentos(!qtdePavimentos)} checked={qtdePavimentos} label="Quantidade de pavimentos" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setFamiliar(!familiar)} checked={familiar} label="Familiar" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setMultifamiliar(!multifamiliar)} checked={multifamiliar} label="Multi familiar" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setComercio(!comercio)} checked={comercio} label="Comercio" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setServico(!servico)} checked={servico} label="Serviço" /></MenuList>
                </Box>
                <Box>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setIndustria(!industria)} checked={industria} label="Industria" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setUsoFachadaBoaCondicao(!usoFachadaBoaCondicao)} checked={usoFachadaBoaCondicao} label="Fachada boa condição" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setUsoEsquadriaBoaCondicao(!usoEsquadriaBoaCondicao)} checked={usoEsquadriaBoaCondicao} label="Esquadria boa condição" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setUsoPodaVegetacao(!usoPodaVegetacao)} checked={usoPodaVegetacao} label="Poda Vegetação" /></MenuList>
                  <MenuList sx={{ px: 2 }}><Checkbox onChange={() => setAreaConstruidaNaoComputavel(!areaConstruidaNaoComputavel)} checked={areaConstruidaNaoComputavel} label="Area construída não computada" /></MenuList>
                </Box>
              </Box>
            </Menu>
          </Dropdown>
        </Box>
        <Table sx={{ bgcolor: 'background.level1' }} aria-label="collapsible table" ref={tableRef}>
          <thead>
            <tr>
              <th style={{ backgroundColor: 'transparent' }}>ID</th>
              {processo ? <th style={{ backgroundColor: 'transparent' }}>Processo</th> : null}
              {imovel ? <th style={{ backgroundColor: 'transparent' }}>Imovel</th> : null}
              {tipoVistoria ? <th style={{ backgroundColor: 'transparent' }}>Vistoria</th> : null}
              {tipologia ? <th style={{ backgroundColor: 'transparent' }}>Tipologia</th> : null}
              {tipoUso ? <th style={{ backgroundColor: 'transparent' }}>Tipo uso</th> : null}
              {dataVistoria ? <th style={{ backgroundColor: 'transparent' }}>Data vistoria</th> : null}
              {areaConstruidaTotalConstatada ? <th style={{ backgroundColor: 'transparent' }}>Area construída constatada</th> : null}
              {areaLoteTotalConstatada ? <th style={{ backgroundColor: 'transparent' }}>Lote total constatada</th> : null}
              {areaCoberturaTotalConstatada ? <th style={{ backgroundColor: 'transparent' }}>Cober. total constatada</th> : null}
              {indiceOcupacaoConstatado ? <th style={{ backgroundColor: 'transparent' }}>Índice Ocupacao</th> : null}
              <th style={{ backgroundColor: 'transparent', width: '4%' }} aria-label="empty" />
              <th style={{ backgroundColor: 'transparent', width: '4%' }} aria-label="empty" />
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 && rows.map((row: VistoriaResponseDTO) => (
              <React.Fragment key={row.id}>
                <Tooltip title={row.descricao} color="neutral" placement="bottom" variant={'outlined'}>
                  <tr>
                    <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}># {row.id}</td>
                    {processo ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{row.processoId}</td> : null}
                    {imovel ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{row.imovelId}</td> : null}
                    {tipoVistoria ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{vistorias.get(row.tipoVistoria)}</td> : null}
                    {tipologia ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{tipologias.get(row.tipoTipologia)}</td> : null}
                    {tipoUso ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{tiposUsos.get(row.tipoUso)}</td> : null}
                    {dataVistoria ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{new Date(row.dataVistoria).toLocaleDateString()}</td> : null}
                    {areaConstruidaTotalConstatada ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{row.areaConstruidaTotalConstatada}</td> : null}
                    {areaLoteTotalConstatada ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{row.areaLoteTotalConstatada}</td> : null}
                    {areaCoberturaTotalConstatada ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{row.areaCoberturaTotalConstatada}</td> : null}
                    {indiceOcupacaoConstatado ? <td style={{ backgroundColor: theme.palette.background.surface }} onClick={() => { router.push('/vistoria/detalhes/' + row.id) }}>{row.indiceOcupacaoConstatado}</td> : null}
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
                    <td
                      style={{ backgroundColor: theme.palette.background.surface }}
                    >
                      <IconButton size="sm" variant="soft" color="neutral">
                        <DeleteForeverIcon onClick={() => { setId(row.id); setConfirma(true) }} sx={{ color: theme.palette.text.primary, width: 25, height: 25 }} />
                      </IconButton>
                    </td>
                  </tr>
                </Tooltip>
                {openRows[row.id] && (
                  <Sheet variant="soft" sx={{ p: 1.6, height: '152px', width: tableSize }}>
                    <Box sx={{ bgcolor: 'background.body', p: 1, borderRadius: 10, height: '100%' }}>
                      <Typography sx={{ fontWeight: 900, fontSize: '14px', lineHeight: '22px', pb: 1, pl: 1 }}>
                        Outras informações
                      </Typography>
                      <Table >
                        <thead style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>
                          <tr>
                            {qtdePavimentos ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Qtde. pavimentos</th> : null}
                            {familiar ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Familiar</th> : null}
                            {multifamiliar ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Mult. familiar</th> : null}
                            {comercio ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Comercio</th> : null}
                            {servico ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Serviço</th> : null}
                            {industria ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Industria</th> : null}
                            {usoFachadaBoaCondicao ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Fachada boa condição</th> : null}
                            {usoEsquadriaBoaCondicao ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Esqd. boa condição</th> : null}
                            {usoPodaVegetacao ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Poda vegetação</th> : null}
                            {areaConstruidaNaoComputavel ? <th style={{ backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>Area construída não computada</th> : null}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {qtdePavimentos ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.qtdePavimentos}</td> : null}
                            {familiar ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.unifamiliar ? 'Sim' : 'Não'}</td> : null}
                            {multifamiliar ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.multifamiliar ? 'Sim' : 'Não'}</td> : null}
                            {comercio ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.comercio ? 'Sim' : 'Não'}</td> : null}
                            {servico ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.servico ? 'Sim' : 'Não'}</td> : null}
                            {industria ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.industria ? 'Sim' : 'Não'}</td> : null}
                            {usoFachadaBoaCondicao ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.usoFachadaBoaCondicao ? 'Sim' : 'Não'}</td> : null}
                            {usoEsquadriaBoaCondicao ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.usoEsquadriaBoaCondicao ? 'Sim' : 'Não'}</td> : null}
                            {usoPodaVegetacao ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.usoPodaVegetacao ? 'Sim' : 'Não'}</td> : null}
                            {areaConstruidaNaoComputavel ? <td style={{ padding: 0, height: 5, paddingLeft: 8 }}>{row.areaConstruidaNaoComputavel}</td> : null}
                          </tr>
                        </tbody>
                      </Table>
                    </Box>
                  </Sheet>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
        <Box sx={{ display: 'flex', gap: 2, p: 2, justifyContent: 'end', alignItems: 'center' }}>
          <Typography level="body-sm" sx={{ fontWeight: 'bold', mr: -2 }}>Linhas por página:</Typography>
          <Select
            variant='plain'
            value={limite}
            onChange={(_, value) => { setLimite(value ? parseInt(value.toString()) : 0), getVistorias() }}
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