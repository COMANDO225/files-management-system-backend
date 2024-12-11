import { Router } from "express";
import { getUsuariosController } from "./usuario.controller";

const router = Router();

router.get("/", getUsuariosController);

export default router;
