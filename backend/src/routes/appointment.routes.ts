import express from "express";
import { createAppointment, getMyAppointments, cancelAppointment } from "../controllers/appointment.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);
router.post("/", createAppointment);
router.get("/my", getMyAppointments);
router.put("/:id/cancel", cancelAppointment);

export default router;
