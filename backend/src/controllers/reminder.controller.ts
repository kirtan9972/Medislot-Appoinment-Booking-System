import Reminder from "../models/reminder.model";

export const createReminder = async (req: any, res: any) => {
  const reminder = await Reminder.create({
    user: req.user.id,
    text: req.body.text,
    date: req.body.date
  });

  res.json(reminder);
};

export const getReminders = async (req: any, res: any) => {
  const reminders = await Reminder.find({ user: req.user.id });
  res.json(reminders);
};