import { RequestHandler } from "express";
import { AnyZodObject, ZodError } from "zod";
import { errorResponse } from "@/utils/response";

export const validate = (schema: AnyZodObject): RequestHandler => {
	return (req, res, next) => {
		try {
			// Validar el esquema con los datos de la request
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next(); // Pasar al siguiente middleware si no hay errores
		} catch (err) {
			// Manejar errores de Zod
			if (err instanceof ZodError) {
				const formattedErrors = err.errors.map((issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				}));

				errorResponse(res, "Validación fallida", formattedErrors, 400);
			} else {
				next(err);
			}
		}
	};
};
