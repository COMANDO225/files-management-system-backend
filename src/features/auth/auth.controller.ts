import { Request, Response } from "express";
import { signIn } from "./auth.service";
import { errorResponse, successResponse } from "@/utils/response";

export async function signInController(req: Request, res: Response) {
	try {
		const { email, password } = req.body;
		const userAgent = req.headers["user-agent"] || "Unknown";
		const ip = req.ip || req.headers["x-forwarded-for"] || "Unknown";

		const { user, accessToken, refreshToken } = await signIn({
			email,
			password,
			userAgent,
			ip: ip as string,
		});

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Usa true solo en producción
			sameSite: "strict", // O "lax" si el frontend y backend están en el mismo dominio
			maxAge: 15 * 60 * 1000, // 15 minutos
		});
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
		});

		successResponse(res, "Inicio de sesión exitoso", user);
	} catch (error: any) {
		errorResponse(res, error.message);
	}
}

export function signOutController(req: Request, res: Response) {
	// Aquí puedes eliminar la sesión en la DB y limpiar las cookies, por ejemplo:
	// res.clearCookie("accessToken");
	// res.clearCookie("refreshToken");

	res.json({ message: "Sesión cerrada" });
}

export function meController(req: Request, res: Response) {
	const user = req.user;
	successResponse(res, "Usuario autenticado", user);
}
