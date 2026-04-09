import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Doctor from "../models/doctor.model";
import User from "../models/user.model";

const ATLAS_URI = process.env.MONGO_URI;
const LOCAL_URI = "mongodb://127.0.0.1:27017/medislot";

const connectDB = async () => {
  let usedUri = ATLAS_URI || LOCAL_URI;

  try {
    await mongoose.connect(usedUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log(`MongoDB connected (${usedUri})`);
  } catch (error) {
    if (usedUri !== LOCAL_URI) {
      console.warn(`Atlas connection failed (${usedUri}), retrying local (${LOCAL_URI})...`);
      usedUri = LOCAL_URI;
      await mongoose.connect(usedUri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      });
      console.log(`MongoDB connected (${usedUri})`);
    } else {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  try {
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      await Doctor.insertMany([
        { name: "Dr. Sarah Smith", specialization: "Cardiology", fees: 150, image: "", availableSlots: ["09:00 AM", "10:00 AM", "02:00 PM"] },
        { name: "Dr. James Wilson", specialization: "Dermatology", fees: 120, image: "", availableSlots: ["11:00 AM", "01:00 PM", "04:00 PM"] },
        { name: "Dr. Emily Brown", specialization: "Pediatrics", fees: 100, image: "", availableSlots: ["08:00 AM", "12:00 PM", "03:00 PM"] },
        { name: "Dr. Michael Chen", specialization: "Neurology", fees: 200, image: "", availableSlots: ["10:00 AM", "02:00 PM", "05:00 PM"] }
      ]);
      console.log("Seeded default doctors");
    }

    const adminEmail = "admin@medislot.com";
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({ name: "Admin User", email: adminEmail, password: hashed, role: "admin" });
      console.log("Seeded default admin user: admin@medislot.com / admin123");
    }
  } catch (error) {
    console.error("Seeding or user init error:", error);
    throw error;
  }
};

export default connectDB;