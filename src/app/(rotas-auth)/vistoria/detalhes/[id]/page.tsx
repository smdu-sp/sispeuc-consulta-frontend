'use client'

import Content from "@/components/Content";
import { Accordion, AccordionDetails, accordionDetailsClasses, AccordionGroup, AccordionGroupProps, AccordionSummary, accordionSummaryClasses, Box, Button, Card, CircularProgress, Divider, FormControl, FormHelperText, FormLabel, Input, Modal, Option, Select, Sheet, Skeleton, Snackbar, Stack, styled, SvgIcon, Textarea, Typography } from "@mui/joy";
import { CheckCircleOutlineTwoTone } from '@mui/icons-material';
import { useTheme } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import {
    infer as Infer,
    object,
    string,
    boolean,
    z
} from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as vistoriasServices from "@/shared/services/vistorias/vistoria.service";
import VistoriaFilesCarousel from "@/components/VistoriaFilesCarousel";
import { VistoriaAssetDto, VistoriaResponseDTO } from "@/types/vistorias/vistorias.dto";
import { AlertsContext } from "@/providers/alertsProvider";
import { getOneProcesso } from "@/shared/services/cadastros/cadastros.service";
import { getOneProspeccao } from "@/shared/services/prospeccoes/prospeccoes.service";
import { ProspeccoesResponseDTO } from "@/types/prospeccoes/prospeccoes.dto";

const schema = object({
    processoId: string(),
    imovelId: string(),
    tipoVistoria: string().min(1, "Selecione o tipo de vistoria"),
    tipoTipologia: string().min(1, "Selecione o tipo de tipologia"),
    tipoUso: string().min(1, "Selecione o tipo de uso"),
    qtdePavimentos: z.coerce.number(),
    unifamiliar: boolean(),
    multifamiliar: boolean(),
    comercio: boolean(),
    servico: boolean(),
    industria: boolean(),
    usoFachadaBoaCondicao: boolean(),
    usoEsquadriaBoaCondicao: boolean(),
    usoPodaVegetacao: boolean(),
    areaConstruidaTotalConstatada: z.coerce.number(),
    areaLoteTotalConstatada: z.coerce.number(),
    indiceOcupacaoConstatado: z.coerce.number(),
    areaCoberturaTotalConstatada: z.coerce.number(),
    areaConstruidaNaoComputavel: z.coerce.number(),
    descricao: string(),
    dataVistoria: z.coerce.date(),
    files: z.optional(z.instanceof(Array<File>))
});
type Schema = Infer<typeof schema>;

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

export default function DetalhesVistorias(props: any) {
    const [loading, setLoading] = useState<boolean>();
    const [gettedObject, setGettedObject] = useState<boolean>();
    const [processoId, setProcessoId] = useState('');
    const [imovelId, setIdImovel] = useState('');
    const [ sei, setSei ] = useState<string>('');
    const [imovel, setImovel] = useState<ProspeccoesResponseDTO>();
    const [tipoVistoria, setTipoVistoria] = useState('');
    const [tipoTipologia, setTipoTipologia] = useState('');
    const [tipoUso, setTipoUso] = useState('');
    const [qtdePavimentos, setQtdePavimentos] = useState(0);
    const [unifamiliar, setUnifamiliar] = useState(false);
    const [multifamiliar, setMultifamiliar] = useState<boolean>(false);
    const [comercio, setComercio] = useState<boolean>(false);
    const [servico, setServico] = useState<boolean>(false);
    const [industria, setIndustria] = useState<boolean>(false);
    const [usoFachadaBoaCondicao, setUsoFachadaBoaCondicao] = useState<boolean>(false);
    const [usoEsquadriaBoaCondicao, setUsoEsquadriaBoaCondicao] = useState<boolean>(false);
    const [usoPodaVegetacao, setUsoPodaVegetacao] = useState<boolean>(false);
    const [areaConstruidaTotalConstatada, setAreaConstruidaTotalConstatada] = useState(0);
    const [areaLoteTotalConstatada, setAreaLoteTotalConstatada] = useState(0);
    const [indiceOcupacaoConstatado, setIndiceOcupacaoConstatado] = useState(0);
    const [areaCoberturaTotalConstatada, setAreaCoberturaTotalConstatada] = useState(0);
    const [areaConstruidaNaoComputavel, setAreaConstruidaNaoComputavel] = useState(0);
    const [descricao, setDescricao] = useState('');
    const [dataVistoria, setDataVistoria] = useState<Date>(new Date());
    const [carregando, setCarregando] = useState(true);
    const [files, setFiles] = useState<File[] | undefined>([]);
    const [vistoriaAssets, setVistoriaAssets] = useState<VistoriaAssetDto[]>();
    const [size, setSize] = useState<AccordionGroupProps['size']>('md');
    const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(0);
    const [modalFile, setModalFile] = useState<boolean>(false);
    const [confirma, setConfirma] = useState(false)
    const { id } = props.params;
    const router = useRouter();
    const theme = useTheme();
    const { setAlert } = useContext(AlertsContext);

    useEffect(() => {
        id && !gettedObject ? getById() : setCarregando(false);
        window.location.href.split('?')[1]?.split('=')[0]
            && (window.location.href.split('?')[1].split('=')[0] === 'imovelId')
            ? handleImovelId() : null;
    }, []);

    const getProcesso = async (id: string) => {
        const processo = await getOneProcesso(id);
        setSei(processo.autuacaoSei);
        setProcessoId('' + processo.id);
    }

    const getImovel = async (id: string) => {
        const imovel: ProspeccoesResponseDTO = await getOneProspeccao(id);
        setImovel(imovel);
        await getProcesso(''+ imovel.imovelProcessoId);
    };

    const handleImovelId = async () => {
        const imovelId = window.location.href.split('?')[1].split('=')[1]; 
        setIdImovel(imovelId);
        await getImovel(imovelId);
        window.history.replaceState({}, '', `${window.location.pathname}`);
    };

    const {
        control,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<Schema>({
        mode: "onChange",
        resolver: zodResolver(schema),
        values: {
            processoId,
            imovelId,
            tipoVistoria,
            tipoTipologia,
            tipoUso,
            qtdePavimentos,
            unifamiliar,
            multifamiliar,
            comercio,
            servico,
            industria,
            usoFachadaBoaCondicao,
            usoEsquadriaBoaCondicao,
            usoPodaVegetacao,
            areaConstruidaTotalConstatada,
            areaLoteTotalConstatada,
            indiceOcupacaoConstatado,
            areaCoberturaTotalConstatada,
            areaConstruidaNaoComputavel,
            descricao,
            dataVistoria,
            files
        }
    });

    const getById = async () => {
        vistoriasServices.getOneVistoria(id)
            .then((v) => {
                if (v) {
                    setCarregando(true);
                    setGettedObject(false);
                    setProcessoId(v.processoId);
                    setIdImovel(v.imovelId);
                    setTipoVistoria(v.tipoVistoria);
                    setTipoTipologia(v.tipoTipologia);
                    setTipoUso(v.tipoUso);
                    setQtdePavimentos(parseInt(v.qtdePavimentos.toString()));
                    setUnifamiliar(v.unifamiliar);
                    setMultifamiliar(v.multifamiliar);
                    setComercio(v.comercio);
                    setServico(v.servico);
                    setIndustria(v.industria);
                    setUsoFachadaBoaCondicao(v.usoFachadaBoaCondicao);
                    setUsoEsquadriaBoaCondicao(v.usoEsquadriaBoaCondicao);
                    setUsoPodaVegetacao(v.usoPodaVegetacao);
                    setAreaConstruidaTotalConstatada(v.areaConstruidaTotalConstatada);
                    setAreaLoteTotalConstatada(v.areaLoteTotalConstatada);
                    setIndiceOcupacaoConstatado(v.indiceOcupacaoConstatado);
                    setAreaCoberturaTotalConstatada(v.areaCoberturaTotalConstatada);
                    setAreaConstruidaNaoComputavel(v.areaConstruidaNaoComputavel);
                    setDescricao(v.descricao);
                    setDataVistoria(v.dataVistoria);
                    setVistoriaAssets(v.VistoriaAsset);
                    setCarregando(false);
                    setGettedObject(true);
                }
            })
    }

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        if (event.target.files && event.target.files.length > 0)
            setFiles(Array.from(event.target.files));
    };

    const handleDeleteFileOnVistoria = async (id: number): Promise<void> => {
        setConfirma(false);
        setLoading(true);
        await vistoriasServices.deleteFileOnVistoria(id);
        setModalFile(false);
        setVistoriaAssets(undefined);
        setSelectedFileIndex(null);
        setGettedObject(false);
        setLoading(false);
        setAlert('Arquivo Deletado!', 'Arquivo deletado com sucesso!', 'success', 3000, CheckCircleOutlineTwoTone);
    }

    const onSubmit = async (): Promise<VistoriaResponseDTO | void> => {
        setLoading(true);
        const form: HTMLFormElement | null = document.getElementById('form_vistorias') as HTMLFormElement;
        const formData: FormData = new FormData(form);
        const f: File = formData.get('files') as File;
        if (f.name == '' && f.arrayBuffer.length < 1) {
            formData.delete('files');
        }
        if (id) {
            await vistoriasServices.updateVistoria(id, formData)
                .then((v) => {
                    setLoading(false);
                    if (v) router.push('/vistoria?att=0');
                });
        } else {
            formData.set('processoId', processoId.toString());
            await vistoriasServices.createVistoria(formData)
                .then((v) => {
                    setLoading(false);
                    if (v) router.push('/vistoria');
                });
        }
    };

    return (
        <Content
            breadcrumbs={[
                { label: 'Vistoria', href: '/vistoria' },
            ]}
            titulo={'Cadastro de vitoria'}
            pagina="vistoria"
        >
            <Snackbar
                variant="solid"
                color="danger"
                size="lg"
                invertedColors
                open={confirma}
                onClose={() => setConfirma(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ maxWidth: 360 }}
            >
                <div>
                    <Typography level="title-lg">Deletar Arquivo!</Typography>
                    <Typography
                        sx={{ mt: 1, mb: 2 }}
                        level="title-md"
                    >
                        Tem certeza que deseja deletar o arquivo {" "}
                        {
                            vistoriaAssets && vistoriaAssets.length != 0
                            && selectedFileIndex !== null
                            && selectedFileIndex !== undefined
                            && vistoriaAssets[selectedFileIndex ? selectedFileIndex : 0].nomeArquivo || ''
                        } ?
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={() => {
                                if (
                                    vistoriaAssets &&
                                    selectedFileIndex !== null &&
                                    selectedFileIndex !== undefined
                                ) {
                                    const id = vistoriaAssets[selectedFileIndex]?.id;
                                    if (typeof id === 'number') {
                                        handleDeleteFileOnVistoria(id);
                                    }
                                }
                            }}
                        >
                            Sim
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setConfirma(false)}
                        >
                            Não
                        </Button>
                    </Stack>
                </div>
            </Snackbar>
            <form id="form_vistorias" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={2}>
                    <Card variant="plain" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 20, padding: 0 }}>
                        <Typography level="h4" sx={{ pl: 3, pt: 2, pb: 1 }} >Vistoria</Typography>
                        <Divider />
                        <Box sx={{ padding: '24px', pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.processoId)}>
                                    <FormLabel>Número Processo</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="processoId"
                                        control={control}
                                        render={({ field: { ref, value, ...field } }) => {
                                            return (<>
                                                <Input
                                                    // value={processoId}
                                                    readOnly
                                                    value={sei}
                                                    error={Boolean(errors.processoId)}
                                                    {...field}
                                                />
                                                {errors.processoId && <FormHelperText color="danger">
                                                    {errors.processoId?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.imovelId)}>
                                    <FormLabel>Imóvel</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="imovelId"
                                        control={control}
                                        defaultValue={imovelId}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Input
                                                    error={Boolean(errors.imovelId)}
                                                    {...field}
                                                />
                                                {errors.imovelId && <FormHelperText color="danger">
                                                    {errors.imovelId?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                            </Stack>
                            <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.tipoVistoria)}>
                                    <FormLabel>Tipo Vistoria</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="tipoVistoria"
                                        control={control}
                                        defaultValue={tipoVistoria}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={''} aria-selected></Option>
                                                    <Option value={'presencial'}>Presencial</Option>
                                                    <Option value={'remota'}>Remota</Option>
                                                    <Option value={'NC'}>NC</Option>
                                                </Select>
                                                {errors.tipoVistoria && <FormHelperText>
                                                    {errors.tipoVistoria?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.tipoTipologia)}>
                                    <FormLabel>Tipo Tipologia</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="tipoTipologia"
                                        control={control}
                                        defaultValue={tipoTipologia}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={''} aria-selected></Option>
                                                    <Option value={'naoEdificado'}>Não Edificado</Option>
                                                    <Option value={'naoUtilizado'}>Não Utilizado</Option>
                                                    <Option value={'subutilizado'}>Subutilizado</Option>
                                                </Select>
                                                {errors.tipoTipologia && <FormHelperText>
                                                    {errors.tipoTipologia?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.tipoUso)}>
                                    <FormLabel>Tipo Uso</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="tipoUso"
                                        control={control}
                                        defaultValue={tipoUso}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={''} aria-selected></Option>
                                                    <Option value={'residencial'}>Residencial</Option>
                                                    <Option value={'misto'}>Misto</Option>
                                                    <Option value={'naoResidencial'}>Não Residencial</Option>
                                                </Select>
                                                {errors.tipoUso && <FormHelperText>
                                                    {errors.tipoUso?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.qtdePavimentos)}>
                                    <FormLabel>Quantidade de Pavimentos</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="qtdePavimentos"
                                        control={control}
                                        defaultValue={Number(qtdePavimentos)}
                                        render={({ field: { ref, onChange, value, ...field } }) => {
                                            return (<>
                                                <Input
                                                    type="number"
                                                    error={Boolean(errors.qtdePavimentos)}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value ? Number(e.target.value) : '';
                                                        onChange(newValue);
                                                    }}
                                                    {...field}
                                                />
                                                {errors.qtdePavimentos && <FormHelperText color="danger">
                                                    {errors.qtdePavimentos?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                            </Stack>
                        </Box>
                    </Card>
                    <Card variant="plain" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 20, padding: 0 }}>
                        <Typography level="h4" sx={{ pl: 3, pt: 2, pb: 1 }}>Características Imóvel</Typography>
                        <Divider />
                        <Box sx={{ padding: '24px', pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.unifamiliar)}>
                                    <FormLabel>Unidade Familiar</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="unifamiliar"
                                        control={control}
                                        defaultValue={unifamiliar}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={false}>Não</Option>
                                                    <Option value={true}>Sim</Option>
                                                </Select>
                                                {errors.unifamiliar && <FormHelperText>
                                                    {errors.unifamiliar?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.multifamiliar)}>
                                    <FormLabel>Multi Familiar</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="multifamiliar"
                                        control={control}
                                        defaultValue={multifamiliar}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={false}>Não</Option>
                                                    <Option value={true}>Sim</Option>
                                                </Select>
                                                {errors.multifamiliar && <FormHelperText>
                                                    {errors.multifamiliar?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.comercio)}>
                                    <FormLabel>Comercio</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="comercio"
                                        control={control}
                                        defaultValue={comercio}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={false}>Não</Option>
                                                    <Option value={true}>Sim</Option>
                                                </Select>
                                                {errors.comercio && <FormHelperText>
                                                    {errors.comercio?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.servico)}>
                                    <FormLabel>Serviço</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="servico"
                                        control={control}
                                        defaultValue={servico}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={false}>Não</Option>
                                                    <Option value={true}>Sim</Option>
                                                </Select>
                                                {errors.servico && <FormHelperText>
                                                    {errors.servico?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                            </Stack>
                            <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.industria)}>
                                    <FormLabel>Industria</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="industria"
                                        control={control}
                                        defaultValue={industria}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={false}>Não</Option>
                                                    <Option value={true}>Sim</Option>
                                                </Select>
                                                {errors.industria && <FormHelperText>
                                                    {errors.industria?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.usoFachadaBoaCondicao)}>
                                    <FormLabel>Uso Fachada Boa Condição</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="usoFachadaBoaCondicao"
                                        control={control}
                                        defaultValue={usoFachadaBoaCondicao}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={false}>Não</Option>
                                                    <Option value={true}>Sim</Option>
                                                </Select>
                                                {errors.usoFachadaBoaCondicao && <FormHelperText>
                                                    {errors.usoFachadaBoaCondicao?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.usoEsquadriaBoaCondicao)}>
                                    <FormLabel>Uso Esquadria Boa Condição</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="usoEsquadriaBoaCondicao"
                                        control={control}
                                        defaultValue={usoEsquadriaBoaCondicao}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={false}>Não</Option>
                                                    <Option value={true}>Sim</Option>
                                                </Select>
                                                {errors.usoEsquadriaBoaCondicao && <FormHelperText>
                                                    {errors.usoEsquadriaBoaCondicao?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.usoPodaVegetacao)}>
                                    <FormLabel>Uso poda Vegetação</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="usoPodaVegetacao"
                                        control={control}
                                        defaultValue={usoPodaVegetacao}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Select
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                >
                                                    <Option value={false}>Não</Option>
                                                    <Option value={true}>Sim</Option>
                                                </Select>
                                                {errors.usoPodaVegetacao && <FormHelperText>
                                                    {errors.usoPodaVegetacao?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                            </Stack>
                        </Box>
                    </Card>
                    <Card variant="plain" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 20, padding: 0 }}>
                        <Typography level="h4" sx={{ pl: 3, pt: 2, pb: 1 }}>Areas</Typography>
                        <Divider />
                        <Box sx={{ padding: '24px', pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'column', xl: 'row' }}>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.areaConstruidaTotalConstatada)}>
                                    <FormLabel>Area Construida Total Constatada</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="areaConstruidaTotalConstatada"
                                        control={control}
                                        defaultValue={areaConstruidaTotalConstatada}
                                        render={({ field: { ref, onChange, value, ...field } }) => {
                                            return (<>
                                                <Input
                                                    type="number"
                                                    error={Boolean(errors.areaConstruidaTotalConstatada)}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value ? Number(e.target.value) : '';
                                                        onChange(newValue);
                                                    }}
                                                    {...field}
                                                />
                                                {errors.areaConstruidaTotalConstatada && <FormHelperText color="danger">
                                                    {errors.areaConstruidaTotalConstatada?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.areaLoteTotalConstatada)}>
                                    <FormLabel>Area Lote Total Constatada</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="areaLoteTotalConstatada"
                                        control={control}
                                        defaultValue={areaLoteTotalConstatada}
                                        render={({ field: { ref, onChange, value, ...field } }) => {
                                            return (<>
                                                <Input
                                                    type="number"
                                                    error={Boolean(errors.areaLoteTotalConstatada)}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value ? Number(e.target.value) : '';
                                                        onChange(newValue);
                                                    }}
                                                    {...field}
                                                />
                                                {errors.areaLoteTotalConstatada && <FormHelperText color="danger">
                                                    {errors.areaLoteTotalConstatada?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.indiceOcupacaoConstatado)}>
                                    <FormLabel>Indice Ocupação Constatado</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="indiceOcupacaoConstatado"
                                        control={control}
                                        defaultValue={indiceOcupacaoConstatado}
                                        render={({ field: { ref, onChange, value, ...field } }) => {
                                            return (<>
                                                <Input
                                                    type="number"
                                                    error={Boolean(errors.indiceOcupacaoConstatado)}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value ? Number(e.target.value) : '';
                                                        onChange(newValue);
                                                    }}
                                                    {...field}
                                                />
                                                {errors.indiceOcupacaoConstatado && <FormHelperText color="danger">
                                                    {errors.indiceOcupacaoConstatado?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                            </Stack>
                            <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'column', xl: 'row' }}>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.areaCoberturaTotalConstatada)}>
                                    <FormLabel>Area Cobertura Total Constatada</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="areaCoberturaTotalConstatada"
                                        control={control}
                                        defaultValue={areaCoberturaTotalConstatada}
                                        render={({ field: { ref, onChange, value, ...field } }) => {
                                            return (<>
                                                <Input
                                                    type="number"
                                                    error={Boolean(errors.areaCoberturaTotalConstatada)}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value ? Number(e.target.value) : '';
                                                        onChange(newValue);
                                                    }}
                                                    {...field}
                                                />
                                                {errors.areaCoberturaTotalConstatada && <FormHelperText color="danger">
                                                    {errors.areaCoberturaTotalConstatada?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.areaConstruidaNaoComputavel)}>
                                    <FormLabel>Area Construida Nao Computavel</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="areaConstruidaNaoComputavel"
                                        control={control}
                                        defaultValue={areaConstruidaNaoComputavel}
                                        render={({ field: { ref, onChange, value, ...field } }) => {
                                            return (<>
                                                <Input
                                                    type="number"
                                                    error={Boolean(errors.areaConstruidaNaoComputavel)}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value ? Number(e.target.value) : '';
                                                        onChange(newValue);
                                                    }}
                                                    {...field}
                                                />
                                                {errors.areaConstruidaNaoComputavel && <FormHelperText color="danger">
                                                    {errors.areaConstruidaNaoComputavel?.message}
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
                            {
                                id && vistoriaAssets && vistoriaAssets?.length > 0 &&
                                <AccordionGroup
                                    size={size}
                                    sx={{
                                        borderRadius: 'md',
                                        [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]:
                                        {
                                            paddingBlock: '0.5rem',
                                        },
                                        [`& .${accordionSummaryClasses.button}`]: {
                                            paddingBlock: '0.5rem',
                                        },
                                    }}
                                >
                                    <Accordion
                                        sx={{
                                            width: { xs: '100%', md: '50%', lg: '30%' },
                                            height: 'fit-content',
                                        }}
                                    >
                                        <AccordionSummary variant='soft'>Arquivos associados</AccordionSummary>
                                        <AccordionDetails>
                                            {
                                                vistoriaAssets.map((fileObject, index) => {
                                                    return (
                                                        <Box key={index}>
                                                            <Typography
                                                                onClick={() => {
                                                                    setModalFile(true);
                                                                    setSelectedFileIndex(index);
                                                                }}
                                                                key={fileObject.id}
                                                                color='primary'
                                                                sx={{
                                                                    marginY: 0.5,
                                                                    paddingX: 2,
                                                                    borderRadius: 5,
                                                                    width: 'fit-content',
                                                                    ":hover": {
                                                                        cursor: 'pointer',
                                                                        bgcolor: theme.palette.mode === 'light' ? '#F0F4F8' : '#171a1c'
                                                                    }
                                                                }}
                                                            >
                                                                {fileObject.nomeArquivo}
                                                            </Typography>
                                                        </Box>
                                                    )
                                                })
                                            }
                                            <Modal
                                                key={vistoriaAssets[selectedFileIndex ? selectedFileIndex : 0].id}
                                                aria-labelledby="modal-title"
                                                aria-describedby="modal-desc"
                                                open={modalFile}
                                                onClose={() => {
                                                    setModalFile(false);
                                                    setSelectedFileIndex(null);
                                                }}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    alignSelf: 'center',
                                                    maxHeight: '80vh',
                                                }}
                                            >
                                                <Sheet
                                                    variant="outlined"
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        width: {
                                                            xs: '90vw',
                                                            md: 'fit-content'
                                                        },
                                                        padding: 1,
                                                        borderRadius: 'md',
                                                        p: 3,
                                                        boxShadow: 'lg',
                                                    }}
                                                >
                                                    <Box>
                                                        <VistoriaFilesCarousel
                                                            vistoriaAssets={vistoriaAssets}
                                                            selectedIndex={selectedFileIndex ? selectedFileIndex : 0}
                                                            setSelectedIndex={setSelectedFileIndex}
                                                        />
                                                    </Box>
                                                    {
                                                        loading &&
                                                        <Button
                                                            sx={{ width: 'fit-content', mt: 2 }}
                                                            loading loadingPosition="start"
                                                            variant='solid'
                                                            color='danger'
                                                        >
                                                            Deletando o arquivo...
                                                        </Button> ||
                                                        <Box sx={{ mt: 2 }}>
                                                            <Button
                                                                onClick={() => {
                                                                    selectedFileIndex !== null
                                                                        && selectedFileIndex !== undefined
                                                                        && vistoriaAssets[selectedFileIndex].id
                                                                        && setConfirma(true);
                                                                }}
                                                                variant='solid'
                                                                color='danger'
                                                                sx={{ width: 'fit-content', mr: 2 }}
                                                            >
                                                                Deletar arquivo
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setModalFile(false);
                                                                    setSelectedFileIndex(null);
                                                                }}
                                                                variant='outlined'
                                                                color='neutral'
                                                                sx={{ width: 'fit-content' }}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                        </Box>
                                                    }
                                                </Sheet>
                                            </Modal>
                                        </AccordionDetails>
                                    </Accordion>
                                </AccordionGroup>
                            }
                            <Stack sx={{ width: '100%', gap: 2, display: 'flex', flexDirection: 'column', alignItems: 'end' }} direction={{ sm: 'column', md: 'column', lg: 'column', xl: 'row' }}>
                                <Button
                                    sx={{
                                        width: { xs: '100%', md: '80%', xl: '20%' },
                                        height: 'fit-content',
                                        alignSelf: { md: 'center', xl: 'end' }
                                    }}
                                    component="label"
                                    role={undefined}
                                    tabIndex={-1}
                                    variant="outlined"
                                    color="neutral"
                                    startDecorator={
                                        <SvgIcon>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                                />
                                            </svg>
                                        </SvgIcon>
                                    }
                                >
                                    Upload a file
                                    <VisuallyHiddenInput name="files" type="file" multiple onChange={handleFileChange} />
                                </Button>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.dataVistoria)}>
                                    <FormLabel>Data Vistoria</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="dataVistoria"
                                        control={control}
                                        defaultValue={dataVistoria && new Date(dataVistoria.toString().split('T')[0])}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Input
                                                    type="date"
                                                    placeholder="Prazo"
                                                    error={Boolean(errors.dataVistoria)}
                                                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                    onChange={(event) => {
                                                        const newValue = new Date(event.target.value);
                                                        field.onChange(newValue);
                                                    }}
                                                    onBlur={field.onBlur}
                                                    disabled={field.disabled}
                                                    name="dataVistoria"
                                                />
                                                {errors.dataVistoria && <FormHelperText color="danger">
                                                    {errors.dataVistoria?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                            </Stack>
                            <Stack sx={{ width: '100%', gap: 2 }} direction={{ sm: 'column', md: 'column', lg: 'column', xl: 'row' }}>
                                <FormControl sx={{ width: '100%' }} error={Boolean(errors.descricao)}>
                                    <FormLabel>Descrição</FormLabel>
                                    {carregando ? <Skeleton variant="text" level="h1" /> : <Controller
                                        name="descricao"
                                        control={control}
                                        defaultValue={descricao}
                                        render={({ field: { ref, ...field } }) => {
                                            return (<>
                                                <Textarea
                                                    error={Boolean(errors.descricao)}
                                                    {...field}
                                                />
                                                {errors.descricao && <FormHelperText color="danger">
                                                    {errors.descricao?.message}
                                                </FormHelperText>}
                                            </>);
                                        }}
                                    />}
                                </FormControl>
                            </Stack>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {
                                    loading
                                    && <Button
                                        startDecorator={<CircularProgress variant="solid" />}
                                        sx={{ bgcolor: theme.palette.text.primary, color: 'background.body' }}
                                    >
                                        Loading…
                                    </Button>
                                    || <Button
                                        type="submit"
                                        sx={{ bgcolor: theme.palette.text.primary, color: 'background.body' }}
                                    >
                                        Enviar Vistoria
                                    </Button>
                                }
                            </Box>
                        </Box>
                    </Card>
                </Stack>
            </form>
        </Content >
    );
}
