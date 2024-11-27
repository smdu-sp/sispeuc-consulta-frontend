import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/joy';
import { Paper } from '@mui/material';

export const desktopOS = [
    {
        label: 'Prospectados',
        value: 9.2,
    },
    {
        label: 'Cadastrados',
        value: 28.4,
    },
    {
        label: 'Em vistoria',
        value: 34.7,
    },
    {
        label: 'Despachados',
        value: 27.7,
    },
];

const styles = {
    height: 380,
    legend: { 'hidden': true }
}

const colors = ['#003562', '#FF5630', '#FFAB00', '#1877F2']


export default function PieArcLabel() {
    return (
        <Box sx={{ height: '95%', width: '100%', display: "flex", flexDirection: 'column' }}>
            <Box sx={{ pl: 9 }}>
                <PieChart
                    series={[
                        {
                            arcLabel: (item) => `${item.value}%`,
                            arcLabelMinAngle: 3,
                            arcLabelRadius: '80%',
                            ...data,
                        },
                    ]}
                    sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                            fontWeight: 'bold',
                            letterSpacing: 1,
                            fill: '#fff'
                        }
                    }}
                    colors={colors}
                    {...styles}
                />
            </Box>
            <Box
                sx={{
                    width: '50%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'start',
                    alignItems: 'flex-start',
                    ml: 1,
                    mt: -1
                }}
            >
                {desktopOS.map((dados, kay) => (
                    <Box
                        key={kay}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 0.5,
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <Paper elevation={3} sx={{ height: 20, width: 20, bgcolor: colors[kay] }} />
                        <Typography sx={{ fontWeight: 600 }}>{dados.label}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>


    );
}

const data = {
    data: desktopOS
};