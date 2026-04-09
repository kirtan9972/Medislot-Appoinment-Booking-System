import Doctor from "../models/doctor.model";

export const getDoctors = async (req: any, res: any) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

export const createDoctor = async (req: any, res: any) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json(doctor);
};

export const updateDoctor = async (req: any, res: any) => {
  const { id } = req.params;
  const doctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
};

export const deleteDoctor = async (req: any, res: any) => {
  const { id } = req.params;
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json({ message: "Doctor deleted" });
};
