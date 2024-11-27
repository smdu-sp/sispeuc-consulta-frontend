'use client'

import React, { useContext } from 'react';
import Content from "@/components/Content";
import { Box, Button, Card, Divider, FormControl, FormHelperText, FormLabel, IconButton, Input, Option, Select, Skeleton, Stack, Textarea, Tooltip, Typography } from "@mui/joy";
import { useTheme } from "@mui/joy";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import {
    infer as Infer,
    number,
    object,
    string,
    boolean,
    date,
    z,
} from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as cadastroServices from "@/shared/services/cadastros/cadastros.service";
import * as cep from "@/shared/services/cep/cep.service";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveIcon from '@mui/icons-material/Remove';
import { CepResponseDTO } from '@/shared/services/cep/cep.service';
import * as comum from '@/shared/services/comum/comum.service';
import { CadastrosRequestDTO } from '@/types/cadastros/cadastros.dto';
import { AlertsContext } from '@/providers/alertsProvider';
import { Check } from '@mui/icons-material';


const schemaFormProcesso = object({
    autuacaoSei: string(),
    imovelContiguidade: boolean(),
    areaConstruidaTotal: z.coerce.number(),
    areaLoteTotal: z.coerce.number(),
    prospeccaoOrigem: string().min(1, "Selecione o tipo de vistoria"),
    prospeccaoTipologia: string().min(1, "Selecione o tipo de vistoria"),
    prospeccaoData: date(),
    estado: string(),
});

const schemaFormImovel = object({
    sqlSetor: z.string().min(0, "Campo obrigatório"),
    sqlQuadra: z.string().min(0, "Campo obrigatório"),
    sqlLote: z.string().min(0, "Campo obrigatório"),
    sqlDigito: z.string().min(0, "Campo obrigatório"),
    sqlPai: z.string().min(0, "Campo obrigatório"),
    sqlFilho: z.string().min(0, "Campo obrigatório"),
    registroNotasReferencia: string(),
    enderecoLogradouro: string(),
    enderecoNumero: string(),
    enderecoComplemento: string(),
    enderecoReferencia: string(),
    enderecoDistrito: string().min(1, "Selecione o distrito"),
    enderecoCep: z.string().min(1, "Selecione o distrito"),
    enderecoSubprefeitura: string(),
    enderecoSubprefeituraSigla: string(),
    enderecoMacroarea: string(),
    enderecoMacroareaSigla: string(),
    enderecoZona: string(),
    enderecoZonaSigla: string(),
    areaConstruidaTotalRegistrada: z.coerce.number(),
    areaLoteTotalRegistrada: z.coerce.number(),
    areaCoeficienteAproveitamento: z.coerce.number(),
    areaCoeficienteAproveitamentoMinimo: z.coerce.number(),
    geoEpsg: z.coerce.number(),
    decretoNumero: string(),
    decretoTipo: string(),
    tombamentoCompresp: string(),
    tombamentoCondephat: string(),
    tombamentoIphan: string(),
});

type SchemaFormProcesso = Infer<typeof schemaFormProcesso>;
type SchemaFormImovel = Infer<typeof schemaFormImovel>;

export default function DetalhesPropriedade(props: any) {

    //Dados Processo
    const [autuacaoSei, setAutuacaoSei] = useState('');
    const [imovelContiguidade, setImovelContiguidade] = useState(false);
    const [areaConstruidaTotal, setAreaConstruidaTotal] = useState(0);
    const [areaLoteTotal, setAreaLoteTotal] = useState(0);
    const [prospeccaoOrigem, setProspeccaoOrigem] = useState('');
    const [prospeccaoTipologia, setProspeccaoTipologia] = useState('');
    const [prospeccaoData, setProspeccaoData] = useState(new Date());
    const [estado, setEstado] = useState('');

    //Dados imoveis
    const [sqlSetor, setSqlSetor] = useState<string>('');
    const [sqlQuadra, setSqlQuadra] = useState<string>('');
    const [sqlLote, setSqlLote] = useState<string>('');
    const [sqlDigito, setSqlDigito] = useState<string>('');
    const [sqlPai, setSqlPai] = useState<string>('');
    const [sqlFilho, setSqlFilho] = useState<string>('');
    //Endereço
    const [registroNotasReferencia, setRegistroNotasReferencia] = useState('');
    const [enderecoLogradouro, setEnderecoLogradouro] = useState('');
    const [enderecoNumero, setEnderecoNumero] = useState('');
    const [enderecoComplemento, setEnderecoComplemento] = useState('');
    const [enderecoReferencia, setEnderecoReferencia] = useState('');
    const [enderecoDistrito, setEnderecoDistrito] = useState('');
    const [enderecoCep, setEnderecoCep] = useState('');
    const [enderecoSubprefeitura, setEnderecoSubprefeitura] = useState('');
    const [enderecoSubprefeituraSigla, setEnderecoSubprefeituraSigla] = useState('');
    const [enderecoMacroarea, setEnderecoMacroarea] = useState('');
    const [enderecoMacroareaSigla, setEnderecoMacroareaSigla] = useState('');
    const [enderecoZona, setEnderecoZona] = useState('');
    const [enderecoZonaSigla, setEnderecoZonaSigla] = useState('');
    //area
    const [areaConstruidaTotalRegistrada, setAreaConstruidaTotalRegistrada] = useState<number>(0);
    const [areaLoteTotalRegistrada, setAreaLoteTotalRegistrada] = useState<number>(0);
    const [areaCoeficienteAproveitamento, setAreaCoeficienteAproveitamento] = useState<number>(0);
    const [areaCoeficienteAproveitamentoMinimo, setAreaCoeficienteAproveitamentoMinimo] = useState<number>(0);
    //Finalização
    const [geoEpsg, setGeoEpsg] = useState<number>(0);
    const [decretoNumero, setDecretoNumero] = useState('');
    const [decretoTipo, setDecretoTipo] = useState('');
    const [tombamentoCompresp, setTombamentoCompresp] = useState('');
    const [tombamentoCondephat, setTombamentoCondephat] = useState('');
    const [tombamentoIphan, setTombamentoIphan] = useState('');

    /*---------//---------*/

    const [exibirImovel, setExibirImovel] = useState(false);
    const [imoveis, setImoveis] = useState<SchemaFormImovel[]>([]);

    const { setAlert } = useContext(AlertsContext);

    const [carregando, setCarregando] = useState(true);
    const { id } = props.params;
    const router = useRouter();

    const {
        register: formProcesso,
        control: controlProcesso,
        handleSubmit: formProcessoSubmit,
        formState: { errors: errorsProcesso }
    } = useForm<SchemaFormProcesso>({
        mode: "onChange",
        resolver: zodResolver(schemaFormProcesso),
        values: {
            autuacaoSei,
            imovelContiguidade,
            areaConstruidaTotal,
            areaLoteTotal,
            prospeccaoOrigem,
            prospeccaoTipologia,
            prospeccaoData,
            estado,
        }
    });

    const {
        control: controlImovel,
        handleSubmit: formImovelSubmit,
        formState: { errors: errorsImovel, isValid }
    } = useForm<SchemaFormImovel>({
        mode: "onChange",
        resolver: zodResolver(schemaFormImovel),
        values: {
            sqlSetor,
            sqlQuadra,
            sqlLote,
            sqlDigito,
            sqlPai,
            sqlFilho,
            registroNotasReferencia,
            enderecoLogradouro,
            enderecoNumero,
            enderecoComplemento,
            enderecoReferencia,
            enderecoDistrito,
            enderecoCep,
            enderecoSubprefeitura,
            enderecoSubprefeituraSigla,
            enderecoMacroarea,
            enderecoMacroareaSigla,
            enderecoZona,
            enderecoZonaSigla,
            areaConstruidaTotalRegistrada,
            areaLoteTotalRegistrada,
            areaCoeficienteAproveitamento,
            areaCoeficienteAproveitamentoMinimo,
            geoEpsg,
            decretoNumero,
            decretoTipo,
            tombamentoCompresp,
            tombamentoCondephat,
            tombamentoIphan
        }
    });

    const getById = async () => {
        cadastroServices.getOneProcesso(id)
            .then((v) => {
                if (v) {
                    setAutuacaoSei(v.autuacaoSei);
                    setImovelContiguidade(v.imovelContiguidade);
                    setAreaConstruidaTotal(v.areaConstruidaTotal);
                    setAreaLoteTotal(v.areaLoteTotal);
                    setProspeccaoOrigem(v.prospeccaoOrigem);
                    setProspeccaoTipologia(v.prospeccaoTipologia);
                    setProspeccaoData(v.prospeccaoData);
                    setEstado(v.estado);
                    setCarregando(false);
                }
            })
    }

    useEffect(() => {
        id ? getById() : setCarregando(false);
    })

    const verificaImovel = async (data2: SchemaFormProcesso) => {
        if (imoveis.length > 0) {
            const data = {
                processo: data2,
                imovel: imoveis.map((imovel) => ({
                    ...imovel,
                    enderecoCep: imovel.enderecoCep.replaceAll('-', ''),
                    sqlSetor: parseInt(imovel.sqlSetor),
                    sqlQuadra: parseInt(imovel.sqlQuadra),
                    sqlLote: parseInt(imovel.sqlLote),
                    sqlDigito: parseInt(imovel.sqlDigito),
                    sqlPai: parseInt(imovel.sqlPai.replaceAll('-', '').replaceAll('.', '')),                    
                    sqlFilho: parseInt(imovel.sqlFilho.replaceAll('-', '').replaceAll('.', '')),
                    usuarioId: '55d62d48-85e9-4bb3-8339-8eaa78d63def',
                }))
            }
            await cadastroServices.createCadastro(data)
                .then((v) => {
                    if (v) {
                        router.push('/cadastramento?att=0');
                    }
                })
        }
    }

    const onSubmit = async (data: SchemaFormProcesso) => {
        if (imoveis.length > 0) {
            verificaImovel(data)
        } else {
            if (id) {
                await cadastroServices.updateProcesso(id, data)
                    .then((v) => {
                        if (v) {
                            router.push('/cadastramento?att=0');
                        }
                    })
            } else if (imoveis.length === 0) {
                await cadastroServices.createProcesso(data)
                    .then((v) => {
                        if (v) {
                            router.push('/cadastramento?add=0');
                        }
                    })
            }
        }


    };

    const salvaImovel = (data: SchemaFormImovel) => {
        console.log(data);
        setImoveis([...imoveis, data]);
        setAlert('Imovel inserido!', 'Imovel inserido no processo com sucesso!', 'success', 3000, Check);
    }

    const theme = useTheme();

    return (
        <Content
            breadcrumbs={[
                { label: 'Cadastramento', href: '/cadastramento' },
                { label: 'Processo', href: `/cadastramento/detalhes/${id ? id : ''}` },
            ]}
            titulo={id ? 'Processo #' + id : 'Processo'}
            pagina="cadastramento"
        >

            <Stack gap={2}>
                <form onSubmit={formProcessoSubmit(onSubmit)}>
                    <Stack gap={2}>
                        <Card variant="plain" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 20, padding: 0 }}>
                            <Typography level="h4" sx={{ pl: 3, pt: 2, pb: 1 }} >Registro de processo</Typography>
                            <Divider />
                            <Box sx={{ padding: '24px', pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsProcesso.autuacaoSei)}>
                                        <FormLabel>Autuação Sei</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="autuacaoSei"
                                            control={controlProcesso}
                                            defaultValue={autuacaoSei}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        error={Boolean(errorsProcesso.autuacaoSei)}
                                                        {...field}
                                                    />
                                                    {errorsProcesso.autuacaoSei && <FormHelperText color="danger">
                                                        {errorsProcesso.autuacaoSei?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsProcesso.imovelContiguidade)}>
                                        <FormLabel>Imóvel Contiguidade</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="imovelContiguidade"
                                            control={controlProcesso}
                                            defaultValue={imovelContiguidade}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={false}>Não</Option>
                                                        <Option value={true}>Sim</Option>
                                                    </Select>
                                                    {errorsProcesso.imovelContiguidade && <FormHelperText>
                                                        {errorsProcesso.imovelContiguidade?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsProcesso.areaConstruidaTotal)}>
                                        <FormLabel>Área Total Construida</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="areaConstruidaTotal"
                                            control={controlProcesso}
                                            defaultValue={Number(areaConstruidaTotal)}
                                            render={({ field: { ref, onChange, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type="number"
                                                        slotProps={{
                                                            input: {
                                                                min: 1
                                                            },
                                                        }}
                                                        error={Boolean(errorsProcesso.areaConstruidaTotal)}
                                                        value={value}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value ? Number(e.target.value) : '';
                                                            onChange(newValue);
                                                        }}
                                                        {...field}
                                                    />
                                                    {errorsProcesso.areaConstruidaTotal && <FormHelperText color="danger">
                                                        {errorsProcesso.areaConstruidaTotal?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsProcesso.areaLoteTotal)}>
                                        <FormLabel>Área lote total</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="areaLoteTotal"
                                            control={controlProcesso}
                                            defaultValue={Number(areaLoteTotal)}
                                            render={({ field: { ref, onChange, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type="number"
                                                        slotProps={{
                                                            input: {
                                                                min: 1
                                                            },
                                                        }}
                                                        error={Boolean(errorsProcesso.areaLoteTotal)}
                                                        value={value}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value ? Number(e.target.value) : '';
                                                            onChange(newValue);
                                                        }}
                                                        {...field}
                                                    />
                                                    {errorsProcesso.areaLoteTotal && <FormHelperText color="danger">
                                                        {errorsProcesso.areaLoteTotal?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>

                                </Stack>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsProcesso.prospeccaoOrigem)}>
                                        <FormLabel>Origem Prospecção</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="prospeccaoOrigem"
                                            control={controlProcesso}
                                            defaultValue={prospeccaoOrigem}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={''}></Option>
                                                        <Option value={'mapaColaborativo'}>Não</Option>
                                                        <Option value={'outros'}>Sim</Option>
                                                    </Select>
                                                    {errorsProcesso.prospeccaoOrigem && <FormHelperText>
                                                        {errorsProcesso.prospeccaoOrigem?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsProcesso.prospeccaoTipologia)}>
                                        <FormLabel>Tipologia Prospecção</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="prospeccaoTipologia"
                                            control={controlProcesso}
                                            defaultValue={prospeccaoTipologia}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={''}></Option>
                                                        <Option value={'residencial'}>Residencial</Option>
                                                        <Option value={'comercial'}>Comercial</Option>
                                                        <Option value={'industrial'}>Industrial</Option>
                                                        <Option value={'misto'}>Misto</Option>
                                                        <Option value={'outros'}>Outros</Option>
                                                    </Select>
                                                    {errorsProcesso.prospeccaoTipologia && <FormHelperText>
                                                        {errorsProcesso.prospeccaoTipologia?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsProcesso.estado)}>
                                        <FormLabel>Estado</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="estado"
                                            control={controlProcesso}
                                            defaultValue={estado}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        error={Boolean(errorsProcesso.estado)}
                                                        {...field}
                                                    />
                                                    {errorsProcesso.estado && <FormHelperText color="danger">
                                                        {errorsProcesso.estado?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="submit"
                                        sx={{
                                            bgcolor: theme.palette.text.primary,
                                            color: 'background.body', '&:hover': { bgcolor: theme.palette.text.primary, color: 'background.body' }
                                        }}>Enviar Processo</Button>
                                </Box>
                            </Box>
                        </Card>
                    </Stack>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', gap: 3 }}>
                        <Button
                            onClick={() => { setExibirImovel(!exibirImovel) }}
                            sx={{ bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent' }, color: 'text.primary' }}
                            startDecorator={!exibirImovel ? <AddIcon sx={{ height: 20, width: 20 }} /> : <RemoveIcon sx={{ height: 20, width: 20 }} />}>
                            Inserir Imóvel
                        </Button>
                    </Box>
                </form>

                <form onSubmit={formImovelSubmit(salvaImovel)}>
                    <Stack gap={2} sx={{ display: exibirImovel ? 'flex' : 'none' }}>
                        <Card variant="plain" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 20, padding: 0 }}>
                            <Typography level="h4" sx={{ pl: 3, pt: 2, pb: 1 }}>Endereço</Typography>
                            <Divider />
                            <Box sx={{ padding: '24px', pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '50%' }} error={Boolean(errorsImovel.enderecoCep)}>
                                        <FormLabel>Cep</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoCep"
                                            control={controlImovel}
                                            defaultValue={comum.formataCep(enderecoCep)}
                                            render={({ field: { ref, onChange, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        value={comum.formataCep(enderecoCep)}
                                                        placeholder="00000-000"
                                                        onChange={(e) => { setEnderecoCep(e.target.value); }}
                                                        error={Boolean(errorsImovel.enderecoCep)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.enderecoCep && <FormHelperText color="danger">
                                                        {errorsImovel.enderecoCep?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoLogradouro)}>
                                        <FormLabel>Endereco Logradouro</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoLogradouro"
                                            control={controlImovel}
                                            defaultValue={enderecoLogradouro}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        error={Boolean(errorsImovel.enderecoLogradouro)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.enderecoLogradouro && <FormHelperText color="danger">
                                                        {errorsImovel.enderecoLogradouro?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '10%' }} error={Boolean(errorsImovel.enderecoNumero)}>
                                        <FormLabel>Número</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoNumero"
                                            control={controlImovel}
                                            defaultValue={enderecoNumero}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        error={Boolean(errorsImovel.enderecoNumero)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.enderecoNumero && <FormHelperText color="danger">
                                                        {errorsImovel.enderecoNumero?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoDistrito)}>
                                        <FormLabel>Distrito</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoDistrito"
                                            control={controlImovel}
                                            defaultValue={enderecoDistrito}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={''}></Option>
                                                        <Option value={'centro'}>Centro</Option>
                                                        <Option value={'norte'}>Norte</Option>
                                                        <Option value={'sul'}>Sul</Option>
                                                        <Option value={'leste'}>Leste</Option>
                                                        <Option value={'oeste'}>Oeste</Option>
                                                        <Option value={'NC'}>NC</Option>
                                                    </Select>
                                                    {errorsImovel.enderecoDistrito && <FormHelperText>
                                                        {errorsImovel.enderecoDistrito?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoComplemento)}>
                                        <FormLabel>Complemento</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoComplemento"
                                            control={controlImovel}
                                            defaultValue={enderecoComplemento}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        error={Boolean(errorsImovel.enderecoComplemento)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.enderecoComplemento && <FormHelperText color="danger">
                                                        {errorsImovel.enderecoComplemento?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoReferencia)}>
                                        <FormLabel>Referência</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoReferencia"
                                            control={controlImovel}
                                            defaultValue={enderecoReferencia}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        error={Boolean(errorsImovel.enderecoReferencia)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.enderecoReferencia && <FormHelperText color="danger">
                                                        {errorsImovel.enderecoReferencia?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoZona)}>
                                        <FormLabel>Zona</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoZona"
                                            control={controlImovel}
                                            defaultValue={enderecoZona}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={''}></Option>
                                                        <Option value={'centro'}>Centro</Option>
                                                        <Option value={'NC'}>NC</Option>
                                                    </Select>
                                                    {errorsImovel.enderecoZona && <FormHelperText>
                                                        {errorsImovel.enderecoZona?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoZonaSigla)}>
                                        <FormLabel>Sigla</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoZonaSigla"
                                            control={controlImovel}
                                            defaultValue={enderecoZonaSigla}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={''}></Option>
                                                        <Option value={'cen'}>cen</Option>
                                                        <Option value={'NC'}>NC</Option>
                                                    </Select>
                                                    {errorsImovel.enderecoZonaSigla && <FormHelperText>
                                                        {errorsImovel.enderecoZonaSigla?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoSubprefeitura)}>
                                        <FormLabel>Subprefeitura</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoSubprefeitura"
                                            control={controlImovel}
                                            defaultValue={enderecoSubprefeitura}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={''}></Option>
                                                        <Option value={'tatuape'}>Tatuapé</Option>
                                                        <Option value={'NC'}>NC</Option>
                                                    </Select>
                                                    {errorsImovel.enderecoSubprefeitura && <FormHelperText>
                                                        {errorsImovel.enderecoSubprefeitura?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoSubprefeituraSigla)}>
                                        <FormLabel>Subprefeitura Sigla</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoSubprefeituraSigla"
                                            control={controlImovel}
                                            defaultValue={enderecoSubprefeituraSigla}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={''}></Option>
                                                        <Option value={'tat'}>tat</Option>
                                                        <Option value={'NC'}>NC</Option>
                                                    </Select>
                                                    {errorsImovel.enderecoSubprefeituraSigla && <FormHelperText>
                                                        {errorsImovel.enderecoSubprefeituraSigla?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoMacroarea)}>
                                        <FormLabel>Macroárea</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoMacroarea"
                                            control={controlImovel}
                                            defaultValue={enderecoMacroarea}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={''}></Option>
                                                        <Option value={'centro'}>Centro</Option>
                                                        <Option value={'NC'}>NC</Option>
                                                    </Select>
                                                    {errorsImovel.enderecoMacroarea && <FormHelperText>
                                                        {errorsImovel.enderecoMacroarea?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.enderecoMacroareaSigla)}>
                                        <FormLabel>Macroárea Sigla</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="enderecoMacroareaSigla"
                                            control={controlImovel}
                                            defaultValue={enderecoMacroareaSigla}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Select
                                                        {...field}
                                                        onChange={(_, value) => field.onChange(value)}
                                                    >
                                                        <Option value={''}></Option>
                                                        <Option value={'cen'}>cen</Option>
                                                        <Option value={'NC'}>NC</Option>
                                                    </Select>
                                                    {errorsImovel.enderecoMacroareaSigla && <FormHelperText>
                                                        {errorsImovel.enderecoMacroareaSigla?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>

                            </Box>
                        </Card>
                        <Card variant="plain" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 20, padding: 0 }}>
                            <Typography level="h4" sx={{ pl: 3, pt: 2, pb: 1 }}>SQL</Typography>
                            <Divider />
                            <Box sx={{ padding: '24px', pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.sqlSetor)}>
                                        <FormLabel>SQL Setor</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="sqlSetor"
                                            control={controlImovel}
                                            defaultValue={sqlSetor}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        slotProps={{
                                                            input: {
                                                                maxLength: 3
                                                            }
                                                        }}
                                                        error={Boolean(errorsImovel.sqlSetor)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.sqlSetor && <FormHelperText color="danger">
                                                        {errorsImovel.sqlSetor?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.sqlQuadra)}>
                                        <FormLabel>SQL Quadra</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="sqlQuadra"
                                            control={controlImovel}
                                            defaultValue={sqlQuadra}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        slotProps={{
                                                            input: {
                                                                maxLength: 3
                                                            }
                                                        }}
                                                        error={Boolean(errorsImovel.sqlQuadra)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.sqlQuadra && <FormHelperText color="danger">
                                                        {errorsImovel.sqlQuadra?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.sqlLote)}>
                                        <FormLabel>SQL Lote</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="sqlLote"
                                            control={controlImovel}
                                            defaultValue={sqlLote}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        slotProps={{
                                                            input: {
                                                                maxLength: 4
                                                            }
                                                        }}
                                                        error={Boolean(errorsImovel.sqlLote)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.sqlLote && <FormHelperText color="danger">
                                                        {errorsImovel.sqlLote?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.sqlDigito)}>
                                        <FormLabel>SQL Digito</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="sqlDigito"
                                            control={controlImovel}
                                            defaultValue={sqlDigito}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        slotProps={{
                                                            input: {
                                                                maxLength: 1
                                                            }
                                                        }}
                                                        error={Boolean(errorsImovel.sqlDigito)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.sqlDigito && <FormHelperText color="danger">
                                                        {errorsImovel.sqlDigito?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.sqlPai)}>
                                        <FormLabel>SQL Pai</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="sqlPai"
                                            control={controlImovel}
                                            defaultValue={comum.formataSetorQuadraLote(sqlPai)}
                                            render={({ field: { ref, onChange, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        onChange={(e) => { setSqlPai(e.target.value); }}
                                                        value={comum.formataSetorQuadraLote(sqlPai)}
                                                        error={Boolean(errorsImovel.sqlPai)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.sqlPai && <FormHelperText color="danger">
                                                        {errorsImovel.sqlPai?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.sqlFilho)}>
                                        <FormLabel>SQL Filho</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="sqlFilho"
                                            control={controlImovel}
                                            defaultValue={comum.formataSetorQuadraLote(sqlFilho)}
                                            render={({ field: { ref, onChange, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        onChange={(e) => { setSqlFilho(e.target.value); }}
                                                        value={comum.formataSetorQuadraLote(sqlFilho)}
                                                        slotProps={{
                                                            input: {
                                                                min: 0
                                                            },
                                                        }}
                                                        error={Boolean(errorsImovel.sqlFilho)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.sqlFilho && <FormHelperText color="danger">
                                                        {errorsImovel.sqlFilho?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>

                            </Box>
                        </Card>
                        <Card variant="plain" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 20, padding: 0 }}>
                            <Typography level="h4" sx={{ pl: 3, pt: 2, pb: 1 }}>Area</Typography>
                            <Divider />
                            <Box sx={{ padding: '24px', pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.areaConstruidaTotalRegistrada)}>
                                        <FormLabel>Area Total Construida Registrada</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="areaConstruidaTotalRegistrada"
                                            control={controlImovel}
                                            defaultValue={areaConstruidaTotalRegistrada}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='number'
                                                        slotProps={{
                                                            input: {
                                                                min: 0
                                                            },
                                                        }}
                                                        error={Boolean(errorsImovel.areaConstruidaTotalRegistrada)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.areaConstruidaTotalRegistrada && <FormHelperText color="danger">
                                                        {errorsImovel.areaConstruidaTotalRegistrada?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.areaLoteTotalRegistrada)}>
                                        <FormLabel>Area Lote Total Registrada</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="areaLoteTotalRegistrada"
                                            control={controlImovel}
                                            defaultValue={areaLoteTotalRegistrada}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='number'
                                                        slotProps={{
                                                            input: {
                                                                min: 0
                                                            },
                                                        }}
                                                        error={Boolean(errorsImovel.areaLoteTotalRegistrada)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.areaLoteTotalRegistrada && <FormHelperText color="danger">
                                                        {errorsImovel.areaLoteTotalRegistrada?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.areaCoeficienteAproveitamento)}>
                                        <FormLabel>Area Coeficiente Aproveitamento</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="areaCoeficienteAproveitamento"
                                            control={controlImovel}
                                            defaultValue={areaCoeficienteAproveitamento}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='number'
                                                        slotProps={{
                                                            input: {
                                                                min: 0
                                                            },
                                                        }}
                                                        error={Boolean(errorsImovel.areaCoeficienteAproveitamento)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.areaCoeficienteAproveitamento && <FormHelperText color="danger">
                                                        {errorsImovel.areaCoeficienteAproveitamento?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.areaCoeficienteAproveitamentoMinimo)}>
                                        <FormLabel>Area Coeficiente Aproveitamento Minimo</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="areaCoeficienteAproveitamentoMinimo"
                                            control={controlImovel}
                                            defaultValue={areaCoeficienteAproveitamentoMinimo}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='number'
                                                        slotProps={{
                                                            input: {
                                                                min: 0
                                                            },
                                                        }}
                                                        error={Boolean(errorsImovel.areaCoeficienteAproveitamentoMinimo)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.areaCoeficienteAproveitamentoMinimo && <FormHelperText color="danger">
                                                        {errorsImovel.areaCoeficienteAproveitamentoMinimo?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>

                            </Box>
                        </Card>
                        <Card variant="plain" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 20, padding: 0 }}>
                            <Typography level="h4" sx={{ pl: 3, pt: 2, pb: 1 }}>Finalização</Typography>
                            <Divider />
                            <Box sx={{ padding: '24px', pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.geoEpsg)}>
                                        <FormLabel>Geo Epsg</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="geoEpsg"
                                            control={controlImovel}
                                            defaultValue={geoEpsg}
                                            render={({ field: { ref, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='number'
                                                        slotProps={{
                                                            input: {
                                                                min: 0
                                                            },
                                                        }}
                                                        error={Boolean(errorsImovel.geoEpsg)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.geoEpsg && <FormHelperText color="danger">
                                                        {errorsImovel.geoEpsg?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.decretoNumero)}>
                                        <FormLabel>Decreto Numero</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="decretoNumero"
                                            control={controlImovel}
                                            defaultValue={decretoNumero}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        error={Boolean(errorsImovel.decretoNumero)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.decretoNumero && <FormHelperText color="danger">
                                                        {errorsImovel.decretoNumero?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.decretoTipo)}>
                                        <FormLabel>Decreto Tipo</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="decretoTipo"
                                            control={controlImovel}
                                            defaultValue={decretoTipo}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        error={Boolean(errorsImovel.decretoTipo)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.decretoTipo && <FormHelperText color="danger">
                                                        {errorsImovel.decretoTipo?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.tombamentoCompresp)}>
                                        <FormLabel>Tombamento Compresp</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="tombamentoCompresp"
                                            control={controlImovel}
                                            defaultValue={tombamentoCompresp}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        error={Boolean(errorsImovel.tombamentoCompresp)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.tombamentoCompresp && <FormHelperText color="danger">
                                                        {errorsImovel.tombamentoCompresp?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.tombamentoCondephat)}>
                                        <FormLabel>Tombamento Condephat</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="tombamentoCondephat"
                                            control={controlImovel}
                                            defaultValue={tombamentoCondephat}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        error={Boolean(errorsImovel.tombamentoCondephat)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.tombamentoCondephat && <FormHelperText color="danger">
                                                        {errorsImovel.tombamentoCondephat?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.tombamentoIphan)}>
                                        <FormLabel>Tombamento Iphan</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="tombamentoIphan"
                                            control={controlImovel}
                                            defaultValue={tombamentoIphan}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        error={Boolean(errorsImovel.tombamentoIphan)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.tombamentoIphan && <FormHelperText color="danger">
                                                        {errorsImovel.tombamentoIphan?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} error={Boolean(errorsImovel.registroNotasReferencia)}>
                                        <FormLabel>registro Notas Referencia</FormLabel>
                                        {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                            name="registroNotasReferencia"
                                            control={controlImovel}
                                            defaultValue={registroNotasReferencia}
                                            render={({ field: { ref, value, ...field } }) => {
                                                return (<>
                                                    <Input
                                                        type='text'
                                                        error={Boolean(errorsImovel.registroNotasReferencia)}
                                                        {...field}
                                                    />
                                                    {errorsImovel.registroNotasReferencia && <FormHelperText color="danger">
                                                        {errorsImovel.registroNotasReferencia?.message}
                                                    </FormHelperText>}
                                                </>);
                                            }}
                                        />}
                                    </FormControl>
                                </Stack>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="submit" sx={{ bgcolor: theme.palette.text.primary, color: 'background.body', '&:hover': { bgcolor: theme.palette.text.primary, color: 'background.body' } }}>Salvar imóvel</Button>
                                </Box>
                            </Box>
                        </Card>
                    </Stack>
                </form>
            </Stack>
        </Content >
    );
}
