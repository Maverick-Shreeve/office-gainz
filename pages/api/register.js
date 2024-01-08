import { createUser } from "../../services/userService";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, password } = req.body;
    const newUser = await createUser({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === 'UserAlreadyExists') {
      // duplicate error
      return res.status(409).json({ message: 'A user with this email already exists' });
    }
    // General error handling
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}