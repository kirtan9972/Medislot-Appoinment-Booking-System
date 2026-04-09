import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  hospitalName: { type: String, default: "MediSlot Hospital" },
  contactEmail: { type: String, default: "contact@medislot.com" },
  contactPhone: { type: String, default: "+1 555-123-4567" },
  address: { type: String, default: "123 Main St, Your City" },
  maintenanceMode: { type: Boolean, default: false },
  allowNewRegistrations: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.model("Settings", settingsSchema);
