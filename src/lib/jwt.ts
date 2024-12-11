import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || "15m";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "7d";

export interface TokenPayload {
	id: string;
	email: string;
	role: string;
	jti?: string; // Usado en el refresh token para identificar la sesión
}

/**
 * Crea un access token con un tiempo de expiración corto.
 * @param payload - Información del usuario (id, email, role).
 * @returns El token de acceso.
 */
export function createAccessToken(payload: TokenPayload): string {
	return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRATION,
	});
}

/**
 * Crea un refresh token con un tiempo de expiración más largo.
 * @param payload - Información del usuario (id, email, role, jti).
 * @returns El token de refresco.
 */
export function createRefreshToken(payload: TokenPayload): string {
	return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRATION,
	});
}

/**
 * Verifica un Access Token.
 * @param token - El token de acceso a verificar.
 * @returns El payload si el token es válido.
 * @throws Error si el token no es válido o ha expirado.
 */
export function verifyAccessToken(token: string): TokenPayload {
	try {
		return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
	} catch (error) {
		console.error("Error al verificar el Access Token:", error);
		throw new Error("El Access Token no es válido o ha expirado.");
	}
}

/**
 * Verifica un Refresh Token.
 * @param token - El token de refresco a verificar.
 * @returns El payload si el token es válido.
 * @throws Error si el token no es válido o ha expirado.
 */
export function verifyRefreshToken(token: string): TokenPayload {
	try {
		return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
	} catch (error) {
		console.error("Error al verificar el Refresh Token:", error);
		throw new Error("El Refresh Token no es válido o ha expirado.");
	}
}
