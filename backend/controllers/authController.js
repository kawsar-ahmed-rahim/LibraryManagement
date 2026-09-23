import User from "../models/User.js";
import { generate } from "otp-generator";
import sendOtp from "../utils/sendOTP.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
// registration of a student step 1 : register user and send otp

export async function registerUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (!email)
      return res.status(400).json({
        message: "Email is required.",
      });

    const cleanPhone = phone ? phone.toString().replace(/\D/g, "") : "";
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        message: "Mobile number must be exactly of 10 digits",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified)
        return res.status(400).json({
          message: "User already exists",
        });
      await User.deleteOne({ email });
    }
    const otp = generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    // to send otp

    try {
      await sendOTP(email, otp);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      return res.status(500).json({
        message: "Failed to send oTP email. Please try again .",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const studentId = `ST-${uuidv4().slice(0, 8).toLocaleUpperCase()}`;

    const user = await User.create({
      name,
      email,
      phone: cleanPhone,
      password: hashedpassword,
      otp,
      otpExpiry,
      studentId,
    });

    res.status(201).json({
      message: "User registered successfully, OTP sent to email",
      user,
    });
  } catch (error) {
    console.log("Error registering user:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
}

// step 2 : verify the otp
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "user not found",
      });
    if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }
    Object.assign(user, { isVerified: true, otp: null, otpExpiry: null });
    await user.save();
    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log("Error verifying OTP:", error);
    res.status(500).json({
      message: "Error verifying OTP",
      error: error.message,
    });
  }
}


// step 3: complete profile