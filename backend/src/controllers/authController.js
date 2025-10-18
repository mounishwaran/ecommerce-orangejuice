import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { name, email, password, address } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create({ name, email, password, address });
  const token = generateToken({ id: user._id, role: user.role });
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, address: user.address, role: user.role },
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await user.matchPassword(password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = generateToken({ id: user._id, role: user.role });
  res.json({
    user: { id: user._id, name: user.name, email: user.email, address: user.address, role: user.role },
    token,
  });
};
