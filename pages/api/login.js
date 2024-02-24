import bcrypt from "bcryptjs";
import { User } from "../../models/users";
import jwt from "jsonwebtoken";
import cookie from "cookie";

// gen token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "360d" }
  );
};
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // gen a session token
    const token = generateToken(user);

    // put token in HTTP Cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Use secure in production
        maxAge: 60 * 60 * 24 * 360, // 360 days
        sameSite: "strict",
        path: "/",
      })
    );

    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
