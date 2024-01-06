import { createUser } from '../../../services/userService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    
    try {
      const newUser = await createUser(name, email, password); // Password will be hashed
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

