import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./features/auth/auth.routes";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
