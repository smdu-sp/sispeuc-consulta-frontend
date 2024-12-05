'use client'

import Content from '@/components/Content';
import { FormEvent, Suspense, useCallback, useEffect, useState } from 'react';
import * as cadastrosServices from '@/shared/services/cadastros/cadastros.services';
import * as usuarioServices from '@/shared/services/usuarios/usuario.services';
import { Box, Button, Card, FormControl, FormLabel, IconButton, Input, Modal, ModalClose, Option, Select, Sheet, styled, Table, Tooltip, Typography } from '@mui/joy';
import { Add, Clear, DeleteForever, KeyboardArrowDown, KeyboardArrowUp, Refresh, Search, UploadFile } from '@mui/icons-material';
import { IPaginadoCadastros, ICadastros } from '@/shared/services/cadastros/cadastros.services';
import { IPaginadoUsuario, IUsuario } from '@/shared/services/usuarios/usuario.services';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TablePagination } from '@mui/material';
import Papa from "papaparse";
import React from 'react';

export default function Usuarios(){
  return (
    <Suspense>
      <SearchUsuarios />
    </Suspense>
  )
}

function SearchUsuarios() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [cadastros, setCadastros] = useState<ICadastros[]>([]);
  const [sistemas, setSistemas] = useState<{ sistema: string }[]>([]);
  const [pagina, setPagina] = useState(searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1);
  const [limite, setLimite] = useState(searchParams.get('limite') ? Number(searchParams.get('limite')) : 10);
  const [total, setTotal] = useState(searchParams.get('total') ? Number(searchParams.get('total')) : 1);
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [sistema, setSistema] = useState(searchParams.get('sistema') || '');
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<IUsuario>({} as IUsuario);
  const router = useRouter();
  const [modalArquivo, setModalArquivo] = useState(false);
  const [arquivoNome, setArquivoNome] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);

  useEffect(() => {
    usuarioServices.validaUsuario()
      .then((response: IUsuario) => {
          setUsuario(response);
      })
    cadastrosServices.listaSistemas()
      .then((response: { sistema: string }[]) => {
        setSistemas(response);
      })
  }, [])

  useEffect(() => {
    buscaCadastros();
  }, [ pagina, limite, sistema ]);
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString();
    },
    [searchParams]
  );

  const buscaCadastros = async () => {
    setLoading(true);
    setCadastros([]);
    cadastrosServices.buscarTudo(pagina, limite, busca, sistema)
      .then((response: IPaginadoCadastros) => {
        console.log(response.data);
        setTotal(response.total);
        setPagina(response.pagina);
        setLimite(response.limite);
        setCadastros(response.data);
        setLoading(false);
      });
  }

  const limpaFitros = () => {
    setBusca('');
    setSistema('');
    setPagina(1);
    setLimite(10);
    router.push(pathname);
    buscaCadastros();
  }

  const mudaPagina = (
    _: React.MouseEvent<HTMLButtonElement> | null, novaPagina: number,
  ) => {
    router.push(pathname + '?' + createQueryString('pagina', String(novaPagina + 1)));
    setPagina(novaPagina + 1);
  };

  const mudaLimite = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    router.push(pathname + '?' + createQueryString('limite', String(event.target.value)));
    setLimite(parseInt(event.target.value, 10));
    setPagina(1);
  };

  const [openRows, setOpenRows] = React.useState<any>({});

  const handleRowToggle = (id: any) => {
    setOpenRows((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;
  
  function formatarSql(value: string): string {
    //111.111.1111-1
    if (!value) return value;
    const onlyNumbers = value && value.toString().replace(/\D/g, '').substring(0, 11);
    if (onlyNumbers === '') return '';
    if (onlyNumbers.length <= 3)
        return onlyNumbers.replace(/(\d{0,3})/, '$1');
    if (onlyNumbers.length <= 6)
        return onlyNumbers.replace(/(\d{0,3})(\d{0,3})/, '$1.$2');
    if (onlyNumbers.length <= 10)
        return onlyNumbers.replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, '$1.$2.$3');
    return onlyNumbers.replace(/(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,1})/, '$1.$2.$3-$4');
  }
  
  function enviarArquivo(): void {
    if (!arquivo) return alert("Suba um arquivo válido!");
    const reader = new FileReader();
    reader.readAsText(arquivo);
    reader.onload = () => {
        const text = reader.result;
        const csv = text as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(';');
        var data = lines.slice(1).map((row) => row.split(';')[0]);
        data = data.filter((row) => {
          row = formatarSql(row.replace(/\D/g, ''));
          if (row !== '') return row;
        })
        console.log(data);
    };
  }

  return (
    <Content
      titulo='Processos Gerais'
      pagina='/'
    >
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={modalArquivo}
        onClose={() => setModalArquivo(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg', minWidth: 300 }}
        >
          <form>
            <Typography id="modal-title" level="h4" component="h2">
              Enviar lista de SQLs
            </Typography>
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              variant="outlined"
              color={arquivo ? 'primary' : 'neutral'}
              sx={{ width: '100%', mt: 2 }}
              startDecorator={<UploadFile />}
            >
              {arquivo ? arquivo.name : 'Escolher arquivo'}
              <VisuallyHiddenInput type="file" name="lista" multiple={false} accept=".csv, .xls, .xlsx"
                onChange={(event) => {
                  if (event.target.files) {
                    setArquivo(event.target.files[0]);
                  }
                }}
              />
            </Button>
            {arquivo && <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="button" onClick={enviarArquivo} sx={{ mt: 2 }} variant="soft">Enviar</Button>
            </Box>}
          </form>
        </Sheet>
      </Modal>
      <Sheet sx={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, boxShadow: 'xs', p: 4 }}>
        <Box
          className="SearchAndFilters-tabletUp"
          sx={{
            borderRadius: 'sm',
            pb: 2,
            display: { xs: 'none', sm: 'flex' },
            flexWrap: 'wrap',
            gap: 1.5,
            '& > *': {
              minWidth: { xs: '120px', md: '160px' },
            },
            alignItems: 'end',
          }}
        >
          <IconButton size='sm' onClick={buscaCadastros}><Refresh /></IconButton>
          <IconButton size='sm' onClick={limpaFitros}><Clear /></IconButton>
          <FormControl size="sm">
            <FormLabel>Sistema: </FormLabel>
            <Select
              size="sm"
              value={sistema}
              onChange={(_, value) => {
                value || value === '' && setSistema(value);
                value || value === '' && router.push(pathname + '?' + createQueryString('sistema', value));
              }}
            >
              <Option value=''>Todos</Option>
              {sistemas.map((sistema) => (
                <Option key={sistema.sistema} value={sistema.sistema}>
                  {sistema.sistema}
                </Option>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }} size="sm">
            <FormLabel>Buscar: </FormLabel>
            <Input
              startDecorator={<Search fontSize='small' />}
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  router.push(pathname + '?' + createQueryString('busca', busca));
                  buscaCadastros();
                }
              }}
            />
          </FormControl>
        </Box>
        <Table hoverRow sx={{ tableLayout: 'auto', borderRadius: 20 }}>
          <thead>
            <tr>
              <th>SQL/INCRA</th>
              <th>Tipo</th>
              <th>Sistema</th>
              <th>Protocolo</th>
              <th>Data Inclusão</th>
              <th style={{ textAlign: 'right' }}></th>
            </tr>
          </thead>
          {loading ?
            <tbody>
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Carregando...</td></tr>
            </tbody>
          : <tbody>
            {cadastros ? cadastros.map((row: ICadastros, index) => (
              <React.Fragment key={index}>
                <Tooltip title={row.assunto?.situacaoAssunto} color="neutral" placement="bottom" variant={'outlined'}>
                  <tr onClick={() => handleRowToggle(index)} style={{ cursor: 'pointer' }}>
                    <td>{row.sql_incra}</td>
                    <td>{row.tipoSql_incra}</td>
                    <td>{row.sistema}</td>
                    <td>{row.protocolo}</td>
                    <td>{row.assunto?.dtInclusaoAssunto && new Date(row.assunto.dtInclusaoAssunto).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      {(row.assunto || row.endereco) && 
                        <KeyboardArrowUp sx={{ transition: '0.2s', transform: openRows[index] ? 'rotate(0deg)' : 'rotate(180deg)' }} />}
                    </td>
                  </tr>
                </Tooltip>
                {openRows[index] && (row.assunto || row.endereco) && (
                  <tr>
                    <td colSpan={6}>
                      <Sheet variant="soft" sx={{ borderRadius: 10, }}>
                        <Box sx={{ bgcolor: 'background.body', p: 1, borderRadius: 10, height: '100%' }}>
                          <Table hoverRow={false} sx={{ tableLayout: 'auto' }}>
                            {row.assunto && <><thead>
                              <tr>
                                <th>Assunto</th>
                                <th>Sistema</th>
                                <th>Subprefeitura</th>
                                <th>Tipo Requerimento</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{row.assunto?.assunto}</td>
                                <td>{row.assunto?.sistema}</td>
                                <td>{row.assunto?.subprefeitura}</td>
                                <td>{row.assunto?.tipoRequerimento}</td>
                              </tr>
                            </tbody></>}
                            {row.endereco && <><thead>
                              <tr>
                                <th>Bairro</th>
                                <th>CEP</th>
                                <th>Logradouro</th>
                                <th>Número</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{row.endereco?.bairro}</td>
                                <td>{row.endereco?.cep}</td>
                                <td>{row.endereco?.logradouro}</td>
                                <td>{row.endereco?.numero}</td>
                              </tr>
                            </tbody></>}
                          </Table>
                        </Box>
                      </Sheet>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )) : <tr><td colSpan={6}>Nenhum cadastro encontrado</td></tr>}
          </tbody>}
        </Table>
      </Sheet>
      {(total && total > 0) ? <TablePagination
        component="div"
        count={total}
        page={(pagina - 1)}
        onPageChange={mudaPagina}
        rowsPerPage={limite}
        onRowsPerPageChange={mudaLimite}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Registros por página"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      /> : null}
      <IconButton onClick={() => setModalArquivo(true)} color='primary' variant='soft' size='lg' sx={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
      }}><UploadFile /></IconButton>
    </Content>
  );
}