import express from "express";
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from "../controllers/doctor.controller";
import authMiddleware, { adminMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getDoctors);
router.post("/", authMiddleware, adminMiddleware, createDoctor);
router.put("/:id", authMiddleware, adminMiddleware, updateDoctor);
router.delete("/:id", authMiddleware, adminMiddleware, deleteDoctor);

export default router;
