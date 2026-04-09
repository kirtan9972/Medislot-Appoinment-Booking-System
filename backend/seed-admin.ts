import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "client"], default: "client" }
});

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["pending", "resolved"], default: "pending" }
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, default: Date.now },
  sent: { type: Boolean, default: false }
}, { timestamps: true });

const doctorSchema = new mongoose.Schema({
  name: String,
  email: String,
  specialization: String,
  fees: Number
});

const User = mongoose.model('User', userSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/medislot';
    console.log('Connecting to MongoDB...');

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@medislot.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@medislot.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created:', admin.email);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Add sample feedback
    const feedbackCount = await Feedback.countDocuments();
    if (feedbackCount === 0) {
      const sampleFeedback = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Great service',
          message: 'The appointment booking was smooth and the doctor was excellent.',
          status: 'pending'
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Technical issue',
          message: 'Had trouble accessing my medical records online.',
          status: 'resolved'
        }
      ];
      await Feedback.insertMany(sampleFeedback);
      console.log('✅ Sample feedback added');
    }

    // Add sample notifications if doctors exist
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount > 0) {
      const notificationCount = await Notification.countDocuments();
      if (notificationCount === 0) {
        const doctors = await Doctor.find().limit(2);
        if (doctors.length > 0) {
          const sampleNotifications = [
            {
              title: 'Appointment Reminder',
              message: 'You have an appointment scheduled for tomorrow at 10 AM.',
              doctor: doctors[0]._id,
              sent: true
            },
            {
              title: 'System Update',
              message: 'New features have been added to the patient portal.',
              doctor: doctors[0]._id,
              sent: false
            }
          ];
          await Notification.insertMany(sampleNotifications);
          console.log('✅ Sample notifications added');
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedAdmin();