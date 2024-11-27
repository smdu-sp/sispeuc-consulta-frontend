import { Home, Person } from '@mui/icons-material';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FindInPageIcon from '@mui/icons-material/FindInPage';

export interface IMenuOption {
    title:  string;
    href:   string;
    name:   string;
    icon:   any; 
    cor?:    string;
};
export interface IMenu {
    userOptions:    IMenuOption[];
    adminOptions:   IMenuOption[];
}

export const menu: IMenu = {
    userOptions: [
        {
            title: 'Página Inicial',
            href: '/',
            name: '/',
            icon: Home,
        },
        {
            title: 'Prospecção',
            href: '/prospeccao',
            name: 'Prospecção',
            icon: GroupAddOutlinedIcon,
            cor: '#283593',
        },
        {
            title: 'Cadastramento',
            href: '/cadastramento',
            name: 'cadastramento',
            icon: LocationCityIcon,
            cor: '#EE1D23',
        },
        {
            title: 'Vistoria',
            href: '/vistoria',
            name: 'vistoria',
            icon: FindInPageIcon,
            cor: '#FFAB00',
        },
        {
            title: 'Despacho',
            href: '/despacho',
            name: 'despacho',
            icon: DomainAddIcon,
            cor: '#1877F2',
        }
    ],
    adminOptions: [
        {
            title: 'Usuários',
            href: '/usuarios',
            name: 'usuarios',
            icon: Person,
            cor: '#000',
        }         
    ]
}