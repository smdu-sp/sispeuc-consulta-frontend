'use client'

import Content from '@/components/Content';
import 'react-material-symbols/rounded';
import * as React from 'react';
import { Box, Card, Typography } from '@mui/joy';

export default function Prospeccao() {
  return (
    <Content
      breadcrumbs={[{ label: 'Prospecção', href: '/prospeccao' }]}
      titulo="Prospecção"
      pagina="Prospecção"
    >
      <Card>
        <Typography level="title-lg" sx={{ textAlign: 'center' }}>Página em construção</Typography>
      </Card>
    </Content>
  );
}