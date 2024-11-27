import { Button, Card, SvgIcon, Typography, useTheme } from "@mui/joy";

interface IPropsCard {
    width?: string
    icone: any
    titulo: string
    botao: string
    corIcon?: string
}

export default function CardImoveis(props: IPropsCard) {

    const theme = useTheme();

    return (
        <Card
            variant="soft"
            sx={{
                height: '200px',
                width: props.width ? props.width : '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 2,
                bgcolor: 'background.body',
                borderRadius: 15,
                boxShadow: '0px 12px 24px -4px #919EAB1F'
            }}

        >
            <SvgIcon component={props.icone} sx={{ color: props.corIcon, width: 50, height: 50 }} />
            <Typography level="body-md" fontWeight={600}>
                {props.titulo}
            </Typography>
            <Button sx={{ bgcolor: 'text.primary', color: 'background.body', '&:hover': { bgcolor: 'text.primary', color: 'background.body' } }}>
                {props.botao}
            </Button>
        </Card>
    )
}