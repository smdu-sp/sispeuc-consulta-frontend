'use client'

import { IUsuario, atualizar, criar } from "@/shared/services/usuarios/usuario.services";
import { Check, Clear, EmailRounded, Warning } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardOverflow, Divider, FormControl, FormLabel, IconButton, Input, Option, Select, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertsContext } from "@/providers/alertsProvider";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { signOut } from "next-auth/react";
import { logout } from "@/shared/utils/logout";

const formSchema = z.object({
	nome: z.string().min(2).max(150),
	login: z.string().min(7).max(7),
	email: z.string().email(),
	permissao: z.string(),
});

export default function UsuarioDetalhesForm({ usuario, headers }: { usuario: IUsuario, headers: ReadonlyHeaders }) {
    const { setAlert } = useContext(AlertsContext);
    const { register, handleSubmit, reset, formState, control, getValues, setValue } = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: usuario.nome || '',
			email: usuario.email || '',
			permissao: usuario.permissao || 'USR',
			login: usuario.login || '',
		},
	});

    async function onSubmit(dadosUsuario: z.infer<typeof formSchema>) {
        if (usuarioNovo) {
            const resposta = await criar(dadosUsuario);
            if (!resposta.ok && resposta.status === 401) logout();
            if (resposta.ok && resposta.data) {
                const usuario = resposta.data as IUsuario;
                setAlert('Sucesso', 'Usuário criado!', 'success', 3000, Check);
                router.push(`/usuarios/detalhes/${usuario.id}`);
                return;
            } 
            setAlert('Erro', resposta.error || 'Não foi possível criar o usuário, tente novamente!', 'danger', 3000, Warning);
        } else {
            const { permissao } = dadosUsuario;
            const resposta = await atualizar(usuario.id, { permissao });
            if (!resposta.ok && resposta.status === 401) logout();
            if (resposta.ok && resposta.data) {
                const usuario = resposta.data as IUsuario;
                setAlert('Sucesso', 'Usuário atualizado!', 'success', 3000, Check);
                router.push(`/usuarios/detalhes/${usuario.id}`);
                return;
            } 
            setAlert('Erro', resposta.error || 'Não foi possível atualizar o usuário, tente novamente!', 'danger', 3000, Warning);
        }
	}

    async function onError(error: any, event: any) {
        console.log({error, event});
    }

    async function buscarNovoUsuario() {
        const login = getValues("login");
        if (login !== "") {
            const response = await fetch(`http://localhost:3001/api/usuarios/buscar-novo/${login}`, {
                headers
            });
            var { data, ok, error, status } = await response.json();
            if (!ok) data = {};
            if (status === 200){
                setValue("nome", data.nome);
                setValue("email", data.email);
                data.permissao && data.permissao !== '' && setValue("permissao", data.permisao);
                setUsuarioNovo(true);
            } else {
                setAlert("Erro", error, "danger", 3000, Warning);
            }
        }
    }

    async function limparDados() {
        setUsuarioNovo(false);
        reset();
    }

    const router = useRouter();
    const [usuarioNovo, setUsuarioNovo] = useState(false);

    return (
        <Box sx={{
            display: 'flex',
            mx: 'auto',
            width: '90%',
            maxWidth: 800,
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
        }}>
            <Card sx={{ width: '100%' }}>
                <form id="formUsuario" onSubmit={handleSubmit(onSubmit, onError)}>
                    <Stack spacing={2} >
                        {!usuario || !usuario.id ? 
                        <><Stack>
                            <FormControl>
                                <FormLabel>Login de rede</FormLabel>
                                <Input
                                    {...register("login")} 
                                    placeholder="Buscar por login de rede"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') buscarNovoUsuario();
                                    }}
                                    endDecorator={
                                        usuarioNovo
                                        ? <IconButton onClick={limparDados}><Clear /></IconButton>
                                        : <Button variant="soft" onClick={buscarNovoUsuario}>Buscar</Button>
                                    }
                                    readOnly={usuario.id ? true : false}
                                    sx={{ flexGrow: 1 }}
                                />
                            </FormControl>
                        </Stack>
                        <Divider />
                        <Stack>
                            <FormControl>
                                <FormLabel>Nome</FormLabel>
                                <Input 
                                    {...register("nome")} 
                                    placeholder="Nome"
                                    readOnly={usuario.id ? true : false}
                                    sx={{ flexGrow: 1 }}
                                />
                            </FormControl>
                        </Stack>
                        <Divider />
                        </> : null}
                        <Stack>
                            <FormControl>
                                <FormLabel>Permissao</FormLabel>
                                <Controller
                                    name="permissao"
                                    control={control}
                                    defaultValue={usuario.permissao || ""}
                                    render={({ field: { ref, ...field } }) => {
                                        return (<Select
                                            {...field}
                                            onChange={(_, value) => field.onChange(value)}
                                            sx={{ flexGrow: 1 }}
                                        >
                                            <Option value="DEV">Desenvolvedor</Option>
                                            <Option value="SUP">Superadmin</Option>
                                            <Option value="ADM">Administrador</Option>
                                            <Option value="USR">Usuário</Option>
                                        </Select>);
                                    }}
                                />
                            </FormControl>
                        </Stack>
                        <Divider />
                        <Stack direction="row" spacing={2}>
                            <FormControl sx={{ flexGrow: 1 }}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    {...register("email")}
                                    readOnly={usuario.id ? true : false}
                                    startDecorator={<EmailRounded />}
                                    placeholder="Email"
                                    sx={{ flexGrow: 1, mb: 2 }}
                                />
                            </FormControl>
                        </Stack>
                    </Stack>
                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                            <Button size="sm" variant="outlined" type="button" color="neutral" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button size="sm" variant="solid" type="submit" disabled={!usuario.id && !usuarioNovo} loading={formState.isLoading || formState.isSubmitting}>
                                Salvar
                            </Button>
                        </CardActions>
                    </CardOverflow>
                </form>
            </Card>
        </Box>
    );
}