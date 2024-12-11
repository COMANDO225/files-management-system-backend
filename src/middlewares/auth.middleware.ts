import { Request, Response, NextFunction } from "express";
import {
	verifyAccessToken,
	verifyRefreshToken,
	createAccessToken,
} from "@/lib/jwt";
import { PrismaClient } from "@prisma/client";
import { errorResponse } from "@/utils/response";

const prisma = new PrismaClient();

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		let accessToken =
			req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

		if (!accessToken) {
			// Si no hay accessToken, verifica si existe un refreshToken
			const refreshToken = req.cookies.refreshToken;
			if (!refreshToken) {
				errorResponse(res, "Token no proporcionado", undefined, 401);
				return; // Detener la ejecución aquí
			}

			try {
				// Verificar el refreshToken
				const payload = verifyRefreshToken(refreshToken);

				// Buscar la sesión en la base de datos
				const session = await prisma.session.findUnique({
					where: { id: payload.jti },
				});

				if (!session || session.token !== refreshToken) {
					errorResponse(
						res,
						"Refresh Token inválido",
						undefined,
						401
					);
					return; // Detener la ejecución aquí
				}

				// Crear un nuevo accessToken
				accessToken = createAccessToken({
					id: payload.id,
					email: payload.email,
					role: payload.role,
				});

				// Configurar la nueva cookie del accessToken
				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					maxAge: 15 * 60 * 1000, // 15 minutos
				});

				req.user = payload; // Adjuntar datos del usuario al objeto `req`
				return next(); // Continuar con la solicitud
			} catch (refreshError) {
				errorResponse(res, "Token inválido o expirado", undefined, 401);
				return; // Detener la ejecución aquí
			}
		}

		// Verificar el accessToken
		try {
			const payload = verifyAccessToken(accessToken);
			req.user = payload; // Adjuntar datos del usuario al objeto `req`
			return next(); // Continuar con la solicitud
		} catch (error) {
			errorResponse(res, "Token inválido o expirado", undefined, 401);
			return; // Detener la ejecución aquí
		}
	} catch (err) {
		console.error(err);
		errorResponse(res, "Error en la autenticación", undefined, 500);
		return; // Detener la ejecución aquí
	}
};
