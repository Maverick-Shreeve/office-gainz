import { OAuth2Client } from 'google-auth-library';
import { createUser } from '../../services/userService'; 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Check if user already exists in db
    // If not, create new user without a password
    const user = await createUser({
      name: payload.name,
      email: payload.email,
      password: null // Indicates that this user registered via Google
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
