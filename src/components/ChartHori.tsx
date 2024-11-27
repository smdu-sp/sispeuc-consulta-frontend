import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export const dataset = [
    {
        seoul: 350,
        month: 'Mapa colaborativo',
    },
    {
        seoul: 450,
        month: 'Secretária da fazenda',
    },
    {
        seoul: 500,
        month: 'Fonte da Denúncia',
    },
    {
        seoul: 600,
        month: 'Fonte da Denfúncia',
    },
    {
        seoul: 700,
        month: 'Fontfe da Denúncia',
    },
    {
        seoul: 1000,
        month: 'Font e da Denúncfia',
    },
    {
        seoul: 1500,
        month: 'Fonte da Denúncfia',
    },
    {
        seoul: 1300,
        month: 'Fonte da Defnúncia',
    }
];

const chartSetting = {
    xAxis: [
    ],
    height: 400,
    width: 1200
};

const valueFormatter = (value: number | null) => `${value}mm`;

export default function ChartHori() {
    return (
        <BarChart
            dataset={dataset}
            yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[{ dataKey: 'seoul' }]}
            layout="horizontal"
            grid={{ horizontal: true }}
            {...chartSetting}
            colors={['#1877F2']}
            borderRadius={30}
        />
    );
}
