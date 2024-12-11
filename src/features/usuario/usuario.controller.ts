import { Request, Response } from "express";
import { getUsuarios } from "./usuario.service";

export async function getUsuariosController(req: Request, res: Response) {
	try {
		const usuarios = await getUsuarios();
		res.json({ data: usuarios });
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
}
