import { useContext, useEffect, useState } from 'react';
import { Link, ListItemButton, ListItemDecorator, ListItemContent, ListItem, List, Sheet, Box, SvgIcon, ListDivider, Typography, IconButton, Snackbar, Stack, Button, useTheme } from '@mui/joy';
import { IMenu, menu } from '../app/menu';
import { MenuContext } from '@/shared/contexts/MenuContext';
import { ListSubheader } from '@mui/material';
import * as usuarioServices from '@/shared/services/usuarios/usuario.services';
import { IUsuario } from '@/shared/services/usuarios/usuario.services';
import LogoPref from '@/assets/sis-icon.png';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const RenderMenu = (menu: IMenu, pagina?: string) => {
  const [permissao, setPermissao] = useState('USR');
  useEffect(() => {
    usuarioServices.validaUsuario()
      .then((response: IUsuario) => {
        setPermissao(response.permissao);
      });
  }, [])

  return (
    <List
      size="sm"
      variant={['DEV', 'ADM'].includes(permissao) ? "plain" : undefined}
      sx={{
        '--ListItem-radius': '6px',
        gap: 0.5,
      }}
    >
      <Typography level="body-lg" fontWeight={900} sx={{ lineHeight: 2, borderRadius: 2, backgroundColor: 'transparent', ml: -0.3, display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}><img style={{ width: 30, height: 30 }} src={LogoPref.src} />SISPEUC</Typography>
      <ListSubheader sx={{ lineHeight: 2, borderRadius: 2, backgroundColor: 'transparent', ml: -1.9, fontWeight: 600, mb: 1 }}>Menu Princiapal</ListSubheader>
      {menu.userOptions.map((page) => (
        <ListItem sx={{ width: '100%' }} key={page.name}>
          <ListItemButton component={Link} underline="none" selected={pagina === page.name} href={page.href}>
            <ListItemDecorator>
              <SvgIcon component={page.icon} sx={{ color: page.cor }} />
            </ListItemDecorator>
            <ListItemContent>{page.title}</ListItemContent>
          </ListItemButton>
        </ListItem>
      ))}
      {['DEV', 'SUP', 'ADM'].includes(permissao) ? <ListDivider inset={'gutter'} /> : null}
      {['DEV', 'SUP', 'ADM'].includes(permissao) ? <ListSubheader sx={{ lineHeight: 2, borderRadius: 2, backgroundColor: 'transparent' }}>Administração</ListSubheader> : null}
      {['DEV', 'SUP', 'ADM'].includes(permissao) ? menu.adminOptions.map((page) => (
        <ListItem sx={{ width: '100%' }} key={page.name}>
          <ListItemButton component={Link} underline="none" selected={pagina === page.name} href={page.href}>
            <ListItemDecorator>
              <SvgIcon component={page.icon} />
            </ListItemDecorator>
            <ListItemContent>{page.title}</ListItemContent>
          </ListItemButton>
        </ListItem>

      )) : null}
    </List>
  );
}

export default function SecondSidebar({
  pagina,
  menuOverride,
}: {
  pagina?: string;
  menuOverride?: IMenu;
}) {
  const { closeSidebar } = useContext(MenuContext);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function logout() {
    await signOut({ redirect: false });
    router.replace('/login');
  }

  const theme = useTheme();

  return (
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
      <Box
        className="SecondSidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 99,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--FirstSidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Sheet
        className="SecondSidebar"
        color="neutral"
        sx={{
          position: {
            xs: 'fixed',
            lg: 'sticky',
          },
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--FirstSidebar-width, 0px)))',
            lg: 'none',
          },
          transition: 'transform 0.4s',
          zIndex: 99,
          height: '100dvh',
          top: 0,
          p: 2,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRight: '1px solid',
          borderColor: 'divider',
          width: 250,
        }}
      >
        <Box
          sx={{
            flex: 1,
          }}
        >
          {menuOverride ? RenderMenu(menuOverride, pagina) : RenderMenu(menu, pagina)}
        </Box>
        {/* <Usuario /> */}
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
          <IconButton onClick={() => { router.push('/eu') }} sx={{ display: "flex", justifyContent: 'start', alignItems: "center", gap: 1.5, width: "100%" }}>
            <AccountCircleOutlinedIcon sx={{ color: 'text.primary' }} />
            <Typography level='body-md' sx={{ color: 'text.primary' }}>
              Minha Conta
            </Typography>
          </IconButton>
          <IconButton onClick={() => setOpen(true)} sx={{ display: "flex", justifyContent: 'start', alignItems: "center", gap: 1.5, width: "100%", mb: 2, color: 'text.primary' }}>
            <LogoutIcon sx={{ color: 'text.primary' }} />
            <Typography level='body-md' sx={{ color: 'text.primary' }}>
              Sair
            </Typography>
          </IconButton>
        </Box>
      </Sheet>
    </>
  );
}

