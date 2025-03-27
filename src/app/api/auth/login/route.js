import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return Response.json({ token }, { status: 200 });
}
