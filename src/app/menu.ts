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