import { Box, Button, Card, CardContent, Chip, ChipPropsColorOverrides, ColorPaletteProp, IconButton, Skeleton, Snackbar, Stack, Tooltip, Typography } from "@mui/joy";
import { OverridableStringUnion } from '@mui/types';
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as usuarioServices from "@/shared/services/usuarios/usuario.services";
import { IUsuario } from "@/shared/services/usuarios/usuario.services";
import { Logout } from "@mui/icons-material";
import { signOut } from "next-auth/react";

export default function Usuario() {
  const router = useRouter();
  const pathname = usePathname();
  const permissoes: Record<string, { label: string, value: string, color: OverridableStringUnion<ColorPaletteProp, ChipPropsColorOverrides> | undefined }> = {
    'DEV': { label: 'Desenvolvedor', value: 'DEV', color: 'neutral' },
    'SUP': { label: 'Superadmin', value: 'SUP', color: 'primary' },
    'ADM': { label: 'Administrador', value: 'ADM', color: 'success' },
    'USR': { label: 'Usuário', value: 'USR', color: 'warning' },
  }
  const [open, setOpen] = useState(false);

  async function logout() {
    await signOut({ redirect: false });
    router.replace('/login');
  }

  useEffect(() => {
    usuarioServices.validaUsuario()
      .then((response: IUsuario) => {
        setUsuario(response);
      });
  }, []);
  const [usuario, setUsuario] = useState<IUsuario>();

  function verificaNome(nome: string) {
    if (!nome) return 'Usuário';
    const nomes = nome.split(' ');
    if (nomes.length > 2) {
      return nomes[0] + ' ' + nomes[nomes.length - 1];
    }
    return nome;
  }

  return (usuario ?
    <>
      <Snackbar
        variant="solid"
        color="primary"
        size="lg"
        invertedColors
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ maxWidth: 360 }}
      >
        <div>
          <Typography level="title-lg">Você está saindo.</Typography>
          <Typography sx={{ mt: 1, mb: 2 }} level="title-md">Tem certeza de que deseja sair?</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="solid" color="primary" onClick={() => logout()}>
              Sim
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpen(false)}
            >
              Não
            </Button>
          </Stack>
        </div>
      </Snackbar>
      <Card sx={{ maxWidth: 250, ":hover": { opacity: '60%' }, cursor: 'pointer' }} variant={pathname === '/eu' ? 'soft' : undefined} onClick={() => { router.push('/eu') }}>
        <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography
            level="title-lg"
            title={usuario.nome}
            sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >{verificaNome(usuario.nome)}</Typography>
          <Typography level="body-xs">{usuario.email}</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {usuario.permissao ? <Chip color={permissoes[usuario.permissao].color} size='sm'>{permissoes[usuario.permissao].label}</Chip> : null}
          </Box>
        </CardContent>
      </Card>
      <Tooltip title='Sair' arrow placement="top">
        <IconButton color="danger" onClick={() => setOpen(true)}>
          <Logout />
        </IconButton>
      </Tooltip>
    </>
    : <Card sx={{ maxWidth: 250 }}>
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Typography
          level="title-lg"
          title="Nome do Usuário"
          sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          <Skeleton>
            Nome do Usuário
          </Skeleton>
        </Typography>
        <Typography level="body-xs">
          <Skeleton>
            emailusuario@prefeitura.sp.gov.br
          </Skeleton>
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Typography level="body-xs">
            <Skeleton>
              Permissao
            </Skeleton>
          </Typography>
          <Typography level="body-xs">
            <Skeleton>
              Permissao
            </Skeleton>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}