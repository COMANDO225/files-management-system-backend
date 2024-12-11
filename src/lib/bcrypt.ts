import { validarString } from "@/utils/validation";
import bcrypt from "bcryptjs";

const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

/**
 * Hashea un string utilizando bcrypt con un número especificado de rondas de sal.
 *
 * @param value - El string que se va a hashear. Debe ser una cadena válida.
 * @param saltRounds - El número de rondas para procesar los datos. Por defecto es 10.
 * @returns Una promesa que se resuelve con el string hasheado.
 * @throws Lanzará un error si el proceso de hash falla.
 */
export const hashString = async (
	value: string,
	saltRounds: number = salt
): Promise<string> => {
	validarString(value, "String");
	try {
		const salt = await bcrypt.genSalt(saltRounds);
		return bcrypt.hash(value, salt);
	} catch (error) {
		console.error("Error al hashear string:", error);
		throw new Error("Hashing failed");
	}
};

/**
 * Compara un string en texto plano con un string hasheado.
 *
 * @param value - El string en texto plano a comparar.
 * @param hashedValue - El string hasheado contra el cual se compara.
 * @returns Una promesa que resuelve un booleano indicando si los valores coinciden.
 * @throws Error si las entradas son inválidas.
 */
export const compareString = async (
	value: string,
	hashedValue: string
): Promise<boolean> => {
	try {
		validarString(value, "String");
		validarString(hashedValue, "String hasheado");
		return await bcrypt.compare(value, hashedValue);
	} catch (error) {
		console.error("Error al comparar strings:", error);
		return false;
	}
};
