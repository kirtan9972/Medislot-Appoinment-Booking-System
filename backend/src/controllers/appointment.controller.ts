import Appointment from "../models/appointment.model";
import Doctor from "../models/doctor.model";

export const createAppointment = async (req: any, res: any) => {
  try {
    const { doctorId, date, time } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: "doctorId, date and time are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const alreadyBooked = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ["pending", "approved"] },
    });
    if (alreadyBooked) {
      return res.status(400).json({ message: "Selected slot is already booked" });
    }

    const appointment = await Appointment.create({
      user: req.user.id,
      doctor: doctorId,
      date,
      time,
      status: "pending",
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Create appointment failed", error);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

export const getMyAppointments = async (req: any, res: any) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate("doctor", "name specialization fees image")
      .sort({ createdAt: -1 });

    const response = appointments.map((apt: any) => {
      const doc = apt.toObject();
      return {
        ...doc,
        doctorId: doc.doctor,
      };
    });

    res.json(response);
  } catch (error) {
    console.error("Fetch appointments failed", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const cancelAppointment = async (req: any, res: any) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findOne({ _id: appointmentId, user: req.user.id });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.status !== "pending") {
      return res.status(400).json({ message: "Only pending appointments can be cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error("Cancel appointment failed", error);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};
