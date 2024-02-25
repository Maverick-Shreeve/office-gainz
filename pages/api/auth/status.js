import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.json({ isLoggedIn: false });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    // if verification is successfulllllll
    return res.json({ isLoggedIn: true });
  } catch (error) {
    return res.json({ isLoggedIn: false });
  }
}
