import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const specializationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

const Specialization = mongoose.model('Specialization', specializationSchema);

async function seedSpecializations() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/medislot';
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    const existingCount = await Specialization.countDocuments();
    if (existingCount === 0) {
      const specializations = [
        { name: 'Cardiology', description: 'Heart and cardiovascular system treatment' }
      ];
      
      const result = await Specialization.insertMany(specializations);
      console.log('✅ Department added successfully:', result[0]?.name);
    } else {
      console.log('ℹ️  Departments already exist:', existingCount);
      const all = await Specialization.find().limit(5);
      console.log('Sample departments:', all.map(s => s.name));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedSpecializations();
