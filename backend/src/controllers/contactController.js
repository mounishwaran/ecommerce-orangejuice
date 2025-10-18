import Contact from '../models/Contact.js';

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'All fields are required' });
  const doc = await Contact.create({ name, email, message });
  res.status(201).json({ message: 'Received', contact: { id: doc._id } });
};

export const listContacts = async (req, res) => {
  const docs = await Contact.find({}).sort({ createdAt: -1 });
  res.json(docs);
};
