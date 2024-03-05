import bcrypt from "bcryptjs";
import User from "../../models/users";
import jwt from "jsonwebtoken";
import cookie from "cookie";

// Generate token
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
    console.log("Received email:", email); // Debugging: Log received email
    console.log("Received password:", password); // Debugging: Log received password

    const user = await User.findByEmail(email);
    if (!user) {
      console.log("No user found with the provided email.");
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("Fetched user:", user); // Debugging: Log fetched user

    if (!user.password) {
      console.error("User's hashed password is missing.");
      return res.status(500).json({ message: "Internal Server Error - User's hashed password is missing." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch); // Debugging: Log password match status
    if (!isMatch) {
      console.log("Password does not match.");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    console.log("Generated token:", token); // Debugging: Log generated token

    // Set token in HTTP Cookie
    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 360,
      sameSite: "strict",
      path: "/",
    }));

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({ 
      message: "Internal Server Error - Error during login process.", 
      error: error instanceof Error ? error.message : String(error) // Ensure the error is properly converted to a string
    });
  }
}

