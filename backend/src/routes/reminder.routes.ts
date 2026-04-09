import express from "express";
import { createReminder, getReminders } from "../controllers/reminder.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);
router.post("/", createReminder);
router.get("/", getReminders);

export default router;
