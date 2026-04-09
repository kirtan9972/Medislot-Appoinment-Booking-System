import { Router } from "express";
import Appointment from "../models/appointment.model";
import Doctor from "../models/doctor.model";
import Settings from "../models/settings.model";
import User from "../models/user.model";
import Specialization from "../models/specialization.model";
import Feedback from "../models/feedback.model";
import Notification from "../models/notification.model";
import authMiddleware, { adminMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/reports/summary", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctor");

    const revenue = appointments.reduce((acc, appointment) => {
      const fees = (appointment.doctor as any)?.fees || 0;
      return acc + fees;
    }, 0);

    const specializationCount: Record<string, number> = {};
    appointments.forEach((appointment) => {
      const specialization = (appointment.doctor as any)?.specialization;
      if (specialization) {
        specializationCount[specialization] = (specializationCount[specialization] || 0) + 1;
      }
    });

    const topSpecialization = Object.entries(specializationCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";

    const now = new Date();
    const monthlyData = Array.from({ length: 6 }, (_, idx) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      const monthLabel = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const count = appointments.filter((appointment) => {
        const createdAt = new Date((appointment.createdAt as Date | string) || '');
        if (Number.isNaN(createdAt.getTime())) return false;
        return createdAt.getFullYear() === year && createdAt.getMonth() === date.getMonth();
      }).length;
      return { month: monthLabel, appointments: count };
    });

    res.json({
      revenue,
      topSpecialization,
      avgWaitTime: "15 mins",
      growth: +((Math.random() * 10 + 5).toFixed(1)),
      monthlyData,
    });
  } catch (error) {
    console.error("Error in reports summary", error);
    res.status(500).json({ message: "Failed to fetch reports summary" });
  }
});

router.get("/patients", async (req, res) => {
  try {
    const patients = await User.find({ role: "client" }).select("-password");
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctor", "name specialization").populate("user", "name email");
    const formatted = appointments.map((appointment: any) => {
      const item = appointment.toObject();
      return {
        ...item,
        doctorId: item.doctor,
        patientId: item.user,
      };
    });
    res.json(formatted);
  } catch (error) {
    console.error("Error fetching appointments", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const patientCount = await User.countDocuments({ role: "client" });
    const doctorCount = await Doctor.countDocuments();
    const appointmentCount = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" });
    res.json({ patientCount, doctorCount, appointmentCount, pendingAppointments });
  } catch (error) {
    console.error("Error fetching stats", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.put("/appointments/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["pending", "approved", "rejected", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment status", error);
    res.status(500).json({ message: "Failed to update appointment status" });
  }
});

router.delete("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Error deleting appointment", error);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
});

router.delete("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (error) {
    console.error("Error deleting patient", error);
    res.status(500).json({ message: "Failed to delete patient" });
  }
});

router.put("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!user) return res.status(404).json({ message: "Patient not found" });
    res.json(user);
  } catch (error) {
    console.error("Error updating patient", error);
    res.status(500).json({ message: "Failed to update patient" });
  }
});

router.get("/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const update = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(update);
    } else {
      Object.assign(settings, update);
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error("Error updating settings", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

// Specializations endpoints
router.get("/specializations", async (req, res) => {
  try {
    const specializations = await Specialization.find().sort({ createdAt: -1 });
    console.log("Fetching specializations:", specializations);
    res.json(specializations);
  } catch (error) {
    console.error("Error fetching specializations", error);
    res.status(500).json({ message: "Failed to fetch specializations" });
  }
});

router.post("/specializations", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Specialization name is required" });
    }
    const specialization = await Specialization.create({ name, description });
    res.status(201).json(specialization);
  } catch (error: any) {
    console.error("Error creating specialization", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Specialization already exists" });
    } else {
      res.status(500).json({ message: "Failed to create specialization" });
    }
  }
});

router.put("/specializations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const specialization = await Specialization.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }
    res.json(specialization);
  } catch (error: any) {
    console.error("Error updating specialization", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Specialization name already exists" });
    } else {
      res.status(500).json({ message: "Failed to update specialization" });
    }
  }
});

router.delete("/specializations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const specialization = await Specialization.findByIdAndDelete(id);
    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }
    res.json({ message: "Specialization deleted successfully" });
  } catch (error) {
    console.error("Error deleting specialization", error);
    res.status(500).json({ message: "Failed to delete specialization" });
  }
});

// Feedback endpoints
router.get("/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

router.put("/feedback/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndUpdate(id, { status: "resolved" }, { new: true });
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(feedback);
  } catch (error) {
    console.error("Error updating feedback", error);
    res.status(500).json({ message: "Failed to update feedback" });
  }
});

// Notifications endpoints
router.get("/notifications/doctors", async (req, res) => {
  try {
    const notifications = await Notification.find().populate("doctor", "name email").sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching doctor notifications", error);
    res.status(500).json({ message: "Failed to fetch doctor notifications" });
  }
});

export default router;
