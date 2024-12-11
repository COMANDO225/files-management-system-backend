import { Response } from "express";

interface SuccessResponse<T> {
	message: string;
	data: T;
}

interface ErrorResponse {
	message: string;
	errors?: { field?: string; message: string }[];
}

export const successResponse = <T>(
	res: Response,
	message: string,
	data: T,
	statusCode: number = 200
): Response<SuccessResponse<T>> => {
	return res.status(statusCode).json({
		message,
		data,
	});
};

export const errorResponse = (
	res: Response,
	message: string,
	errors?: { field?: string; message: string }[],
	statusCode: number = 400
): Response<ErrorResponse> => {
	return res.status(statusCode).json({
		message,
		errors,
	});
};
