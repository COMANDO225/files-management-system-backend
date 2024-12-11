/**
 * Valida que una entrada sea un string no vacío.
 * @param entrada - La entrada a validar.
 * @param nombre - El nombre de la entrada (para los mensajes de error).
 * @throws Error si la entrada no es válida.
 */
export const validarString = (entrada: string, nombre: string): void => {
	if (typeof entrada !== "string" || entrada.trim() === "") {
		throw new Error(
			`Entrada inválida: ${nombre} debe ser un tipo texto valido.`
		);
	}
};
