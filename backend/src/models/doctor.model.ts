import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  fees: { type: Number, required: true },
  image: { type: String, default: "" },
  availableSlots: { type: [String], default: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"] }
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
