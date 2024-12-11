import prisma from "@/lib/prisma";
import { compareString, hashString } from "@/lib/bcrypt";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { v4 as uuidv4 } from "uuid";

interface SignInParams {
	email: string;
	password: string;
	userAgent: string;
	ip: string;
}

export async function signIn({ email, password, userAgent, ip }: SignInParams) {
	const user = await prisma.user.findUnique({ where: { email } });

	if (
		!user ||
		!user.estado ||
		!(await compareString(password, user.password))
	) {
		throw new Error("Credenciales inválidas");
	}

	const payload = { id: user.id, email: user.email, role: user.role };

	let existingSession = await prisma.session.findFirst({
		where: {
			userId: user.id,
			userAgent,
			ip,
			expiresAt: { gt: new Date() },
		},
	});

	if (existingSession) {
		const newExpiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 días

		await prisma.session.update({
			where: { id: existingSession.id },
			data: { expiresAt: newExpiresAt },
		});

		const refreshToken = createRefreshToken({
			...payload,
			jti: existingSession.id,
		});

		const hashedRefresh = await hashString(refreshToken);
		await prisma.session.update({
			where: { id: existingSession.id },
			data: { token: hashedRefresh },
		});

		return {
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
			accessToken: createAccessToken(payload),
			refreshToken,
		};
	}

	const jti = uuidv4();
	const refreshToken = createRefreshToken({ ...payload, jti });
	const hashedRefresh = await hashString(refreshToken);

	const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 días

	await prisma.session.create({
		data: {
			id: jti,
			userId: user.id,
			token: hashedRefresh,
			userAgent,
			ip,
			expiresAt,
		},
	});

	return {
		user: {
			id: user.id,
			email: user.email,
			role: user.role,
		},
		accessToken: createAccessToken(payload),
		refreshToken,
	};
}
