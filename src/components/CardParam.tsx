import { Box, Card, SvgIcon, Typography, useTheme } from "@mui/joy";

interface IPropsCard {
    width?: string
    icone: any
    param: string
    descricao: string
    corIcon?: string
}

export default function CardParam(props: IPropsCard) {

    const theme = useTheme();

    return (
        <Card
            variant="soft"
            sx={{
                height: '144px',
                width: props.width ? props.width : '100%',
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                flexDirection: 'row',
                bgcolor: 'background.body',
                gap: 3,
                borderRadius: 15,
                boxShadow: '0px 12px 24px -4px #919EAB1F'
            }}

        >
            <Box sx={{ ml: 2 }}>
                <SvgIcon component={props.icone} sx={{ color: props.corIcon, width: 64, height: 64 }} />
            </Box>
            <Box>
                <Typography level="h3" sx={{ lineHeight: '36px' }} fontWeight={900}>
                    {props.param}
                </Typography>
                <Typography level="body-md" fontWeight={600} sx={{ color: '#919EAB' }}>
                    {props.descricao}
                </Typography>
            </Box>
        </Card>
    )
}