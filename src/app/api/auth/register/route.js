import { hash } from "bcryptjs";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {
  await connectDB();
  const { username, email, password } = await req.json();

  // التحقق من وجود المستخدم بالفعل
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return Response.json({ message: "User already exists" }, { status: 400 });
  }

  // تشفير كلمة المرور وتخزين المستخدم
  const hashedPassword = await hash(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return Response.json(
    { message: "User registered successfully" },
    { status: 201 }
  );
}
