import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import Appointment from "../models/appointment.model";
import Feedback from "../models/feedback.model";
import Reminder from "../models/reminder.model";

const router = Router();

router.get("/health-tips", async (_req, res) => {
  res.json([
    {
      _id: "tip-1",
      category: "Nutrition",
      title: "Hydrate Throughout the Day",
      content: "Drink water regularly instead of waiting for thirst. Good hydration supports energy and concentration.",
      date: new Date().toLocaleDateString(),
    },
    {
      _id: "tip-2",
      category: "Fitness",
      title: "Walk 30 Minutes Daily",
      content: "A brisk 30-minute walk improves heart health and helps maintain a healthy weight.",
      date: new Date().toLocaleDateString(),
    },
    {
      _id: "tip-3",
      category: "Prevention",
      title: "Prioritize Preventive Checkups",
      content: "Regular health checkups can detect concerns early and reduce long-term complications.",
      date: new Date().toLocaleDateString(),
    },
  ]);
});

router.use(authMiddleware);

router.get("/notifications/my", async (req: any, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate("doctor", "name")
      .sort({ updatedAt: -1 })
      .limit(20);

    const notifications = appointments.map((appointment: any) => ({
      _id: `appointment-${appointment._id}`,
      title: `Appointment ${appointment.status}`,
      message: `${appointment.doctor?.name || "Doctor"} appointment on ${appointment.date} at ${appointment.time} is ${appointment.status}.`,
      date: new Date(appointment.updatedAt || appointment.createdAt).toLocaleString(),
      read: false,
    }));

    res.json(notifications);
  } catch (error) {
    console.error("Fetch notifications failed", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.get("/records/my", async (req: any, res) => {
  try {
    const appointments = await Appointment.find({
      user: req.user.id,
      status: { $in: ["approved", "rejected"] },
    })
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 })
      .limit(50);

    const records = appointments.map((appointment: any) => ({
      _id: appointment._id,
      diagnosis:
        appointment.status === "approved"
          ? `Consultation - ${appointment.doctor?.specialization || "General"}`
          : "Consultation Follow-up Required",
      doctorName: appointment.doctor?.name || "Doctor",
      date: appointment.date,
      prescription:
        appointment.status === "approved"
          ? "Take prescribed medications as advised by your doctor and schedule follow-up if symptoms persist."
          : "Appointment was not approved. Please book another slot for evaluation.",
    }));

    res.json(records);
  } catch (error) {
    console.error("Fetch records failed", error);
    res.status(500).json({ message: "Failed to fetch records" });
  }
});

router.post("/support/feedback", async (req: any, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const feedback = await Feedback.create({
      name: req.body.name || "Anonymous",
      email: req.body.email || "unknown@medislot.com",
      subject,
      message,
      status: "pending",
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Create feedback failed", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

router.post("/notifications/check-reminders", async (req: any, res) => {
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      user: req.user.id,
      completed: false,
      date: { $lte: now },
    });

    if (reminders.length > 0) {
      await Reminder.updateMany(
        { _id: { $in: reminders.map((item) => item._id) } },
        { $set: { completed: true } }
      );
    }

    res.json({ processed: reminders.length });
  } catch (error) {
    console.error("Reminder check failed", error);
    res.status(500).json({ message: "Failed to process reminders" });
  }
});

export default router;
