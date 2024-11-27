'use client'

import Content from '@/components/Content';
import 'react-material-symbols/rounded';
import * as React from 'react';
import { Card, Typography } from '@mui/joy';

export default function Prospeccao() {
    return (
        <Content
            breadcrumbs={[{ label: 'Despacho', href: '/despacho' }]}
            titulo="Despacho"
            pagina="despacho"
        >
            <Card>
                <Typography level="title-lg" sx={{ textAlign: 'center' }}>Página em construção</Typography>
            </Card>
        </Content>
    );
}