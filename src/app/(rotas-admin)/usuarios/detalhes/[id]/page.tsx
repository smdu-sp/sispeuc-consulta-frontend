/** @format */

import { Chip, ChipPropsColorOverrides, ColorPaletteProp } from '@mui/joy';
import { OverridableStringUnion } from '@mui/types';

import Content from '@/components/Content';
import { headers as nextHeaders } from 'next/headers';
import UsuarioDetalhesForm from './_components/form';
import { FetchBuscarPorId } from '@/shared/services/usuarios/get-functions/buscar-por-id';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function UsuarioDetalhes(props: {
	params: { id: string };
}) {
	const { id } = props.params;
	const headers = nextHeaders();
	if (id || id !== '') {
		const response = await fetch(
			`http://localhost:3001/api/usuarios/buscar-por-id/${id}`,
			{
				headers,
			},
		);
		var { data, ok, error, status } = await response.json();
		if (!ok) data = {};
	} else {
		var data;
	}

	const session = await getServerSession();
	if (!session) redirect('/login');

	const response2 = await FetchBuscarPorId(id, session.access_token);

	console.log('nova abordagem' + response2);

	const permissoes: Record<
		string,
		{
			label: string;
			value: string;
			color:
				| OverridableStringUnion<ColorPaletteProp, ChipPropsColorOverrides>
				| undefined;
		}
	> = {
		DEV: { label: 'Desenvolvedor', value: 'DEV', color: 'neutral' },
		SUP: { label: 'Superadmin', value: 'SUP', color: 'primary' },
		ADM: { label: 'Administrador', value: 'ADM', color: 'success' },
		USR: { label: 'Usuário', value: 'USR', color: 'warning' },
	};

	return (
		<Content
			breadcrumbs={[
				{ label: 'Usuários', href: '/usuarios' },
				{
					label: data.nome || 'Novo usuário',
					href: `/usuarios/detalhes/${id ? id : ''}`,
				},
			]}
			titulo={id ? data?.nome : 'Novo usuário'}
			tags={
				data && data.permissao ? (
					<div style={{ display: 'flex', gap: '0.2rem' }}>
						<Chip
							color={permissoes[data?.permissao].color}
							size='lg'>
							{permissoes[data?.permissao].label}
						</Chip>
					</div>
				) : null
			}
			pagina='usuarios'>
			<UsuarioDetalhesForm
				usuario={data}
				headers={headers}
			/>
		</Content>
	);
}
