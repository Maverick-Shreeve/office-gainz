import bcrypt from 'bcrypt';
import { User } from '../../models/User'; 
import jwt from 'jsonwebtoken';



// gen token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET, 
    { expiresIn: '1h' } 
  );
};
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a session token 
    const token = generateToken(user); 

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

