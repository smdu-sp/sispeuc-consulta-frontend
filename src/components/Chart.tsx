import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { AllSeriesType } from '@mui/x-charts/models';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import alphabetStock from '@/shared/dataset/GOOGL.json';

const series = [
    {
        type: 'bar',
        yAxisId: 'volume',
        label: 'Volume',
        color: '#1877F2',
        data: alphabetStock.map((day) => day.volume),
        highlightScope: { highlight: 'item' },
        bar: {
            width: 10
        }
    },
    {
        type: 'line',
        yAxisId: 'price',
        color: '#00B8D9',
        label: 'Low',
        data: alphabetStock.map((day) => day.low),
        highlightScope: { highlight: 'item' },
    },
    {
        type: 'line',
        yAxisId: 'price',
        color: '#FFAB00',
        label: 'High',
        data: alphabetStock.map((day) => day.high),
    },
] as AllSeriesType[];

export default function Chart() {
    return (
        <div style={{ width: '100%' }}>
            <div>
                <ResponsiveChartContainer
                    series={series}
                    height={400}
                    margin={{ top: 10 }}
                    xAxis={[
                        {
                            id: 'date',
                            data: alphabetStock.map((day) => new Date(day.date)),
                            scaleType: 'band',
                            valueFormatter: (value) => value.toLocaleDateString(),
                        },
                    ]}
                    yAxis={[
                        {
                            id: 'price',
                            scaleType: 'linear',
                        },
                        {
                            id: 'volume',
                            scaleType: 'linear',
                            valueFormatter: (value) => `${(value / 1000000).toLocaleString()}M`,
                        },
                    ]}
                >
                    {/* <ChartsAxisHighlight x="line" /> */}
                    <BarPlot
                        borderRadius={30}
                    />
                    <LinePlot />
                    <LineHighlightPlot />
                    <ChartsXAxis
                        label=""
                        position="bottom"
                        axisId="date"
                        tickInterval={(value, index) => {
                            return index % 30 === 0;
                        }}
                        tickLabelStyle={{
                            fontSize: 10,
                        }}
                        disableLine
                        disableTicks
                    />
                    <ChartsYAxis
                        label=""
                        position="left"
                        axisId="price"
                        tickLabelStyle={{ fontSize: 15 }}
                        sx={{
                            [`& .${axisClasses.label}`]: {
                                transform: 'translateX(-5px)',
                            },
                            color: '#919EAB'
                        }}
                        disableLine
                        disableTicks
                    />
                    <ChartsTooltip />
                </ResponsiveChartContainer>
            </div>
        </div>
    );
}
