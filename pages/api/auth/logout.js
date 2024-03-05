
import cookie from 'cookie';
//endpoint to logout
export default async function handler(req, res) {
 
  if (req.method === 'POST') {
    // Clear the authentication cookie
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // cookie expires immediately logging them out
      path: '/',
    }));

    // 
    res.status(200).json({ message: 'Logged out successfully' });
  } else {
    // if 405 not allowed method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
