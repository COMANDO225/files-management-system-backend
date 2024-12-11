import { z } from "zod";

export const signInSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(2),
	}),
});

export const signUpSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(6),
		firstName: z.string(),
		lastName: z.string(),
	}),
});

export type SignInInput = z.infer<typeof signInSchema>["body"];
export type SignUpSchema = z.infer<typeof signUpSchema>["body"];
