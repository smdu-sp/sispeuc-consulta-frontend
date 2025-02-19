/** @format */

import { authOptions } from '@/shared/auth/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET() {
	const baseURL = process.env.API_URL || 'http://localhost:3000/';

	const session = await getServerSession(authOptions);
	if (!session) redirect('/login');

	try {
		const sistemas = await fetch(`${baseURL}cadastros/lista-sistemas`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session?.access_token}`,
			},
		});

		const data = await sistemas.json();
		console.log(data);
		if (sistemas.status === 200)
			return NextResponse.json({
				ok: true,
				error: null,
				data: data,
				status: 200,
			});
		return NextResponse.json({
			ok: false,
			error: data.message,
			data: null,
			status: data.statusCode,
		});
	} catch (error) {
		return NextResponse.json({
			ok: false,
			error: error,
			data: null,
			status: 500,
		});
	}
}
