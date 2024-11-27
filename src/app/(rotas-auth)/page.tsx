'use client'

import Content from '@/components/Content';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/joy';
import CardImoveis from '@/components/CardImoveis';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import CardParam from '@/components/CardParam';
import Chart from '@/components/Chart';
import PieArcLabel from '@/components/PieChart';
import ChartHori from '@/components/ChartHori';
import FormatTextdirectionRToLIcon from '@mui/icons-material/FormatTextdirectionRToL';
import 'react-material-symbols/rounded';
import { IUsuario, validaUsuario } from '@/shared/services/usuarios/usuario.services';

export default function Home() {
  const [nome, setNome] = useState('');

  useEffect(() => {
    validaUsuario()
      .then((response: IUsuario) => {
        setNome(response.nome);
      });
  }, []);

  return (
    <Content
      titulo={'Olá ' + nome + ', boas vindas ao SISPEUC 👋'}
      pagina='/'
    >
      <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
        <CardImoveis width='25%' icone={GroupAddOutlinedIcon} titulo="Prospecção" botao='Ver imóveis' corIcon='#283593' />
        <CardImoveis width='25%' icone={LocationCityIcon} titulo="Cadastramento" botao='Ver imóveis' corIcon='#EE1D23' />
        <CardImoveis width='25%' icone={FindInPageIcon} titulo="Vistoria" botao='Ver imóveis' corIcon='#FFAB00' />
        <CardImoveis width='25%' icone={DomainAddIcon} titulo="Despacho" botao='Ver imóveis' corIcon='#1877F2' />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
        <CardParam width='25%' icone={LocationCityIcon} param='714k' descricao='Imóveis' corIcon='#EE1D23' />
        <CardParam width='25%' icone={GroupAddOutlinedIcon} param='1.35m' descricao='prospectados' corIcon='#283593' />
        <CardParam width='25%' icone={FormatTextdirectionRToLIcon} param='1.72m' descricao='Em preenchimento' corIcon='#FFAB00' />
        <CardParam width='25%' icone={DomainAddIcon} param='234' descricao='Despachados' corIcon='#1877F2' />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
        <Box sx={{
          width: '60%',
          height: '485px',
          bgcolor: 'background.body',
          borderRadius: 15,
          boxShadow: '0px 12px 24px -4px #919EAB1F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start'
        }}
        >
          <Box sx={{ pl: 5, pt: 3, mb: 3 }}>
            <Typography level='h3'>Denúncias</Typography>
            <Typography sx={{ color: '#637381' }} level="body-md" >(+43%) do que o ano passado</Typography>
          </Box>
          <Chart />
        </Box>
        <Box sx={{
          width: '40%',
          height: '485px',
          bgcolor: 'background.body',
          borderRadius: 15,
          boxShadow: '0px 12px 24px -4px #919EAB1F',
        }}
        >
          <Box sx={{ height: '5%' }}>
            <Typography level='h3' sx={{ mt: 2, ml: 5 }}>
              Visão geral imóveis
            </Typography>
          </Box>
          <Box sx={{ width: '100%', height: '95%', display: 'flex', justifyContent: 'center' }}>
            <PieArcLabel />
          </Box>
        </Box>
      </Box>
      <Box sx={{
        width: '100%',
        height: '453px',
        bgcolor: 'background.body',
        borderRadius: 15,
        boxShadow: '0px 12px 24px -4px #919EAB1F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start'
      }}
      >
        <Box sx={{ pl: 5, pt: 3 }}>
          <Typography level='h3'>Denúncias por fonte</Typography>
          <Typography sx={{ color: '#637381' }} level="body-md" >(+43%) than last year</Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', mt: -2 }}>
          <ChartHori />
        </Box>
      </Box>
    </Content>
  );
}