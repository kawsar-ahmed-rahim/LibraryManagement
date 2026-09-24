import User from "../models/User.js";
import { generate } from "otp-generator";
import sendOtp from "../utils/sendOTP.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

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
export async function completeProfile(req, res) {
  try {
    const { email, department, stream, semester, year, rillNo } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "user not found",
      });
    if (!user.isVerified)
      return res.status(400).json({
        message: "User not verified",
      });

    Object.assign(user, {
      department,
      stream,
      semester,
      year,
      rollNo,
      isProfileComplete: true,
    });
    await user.save();
    res.status(200).json({
      message: "Profile completed successfully",
    });
  } catch (error) {
    console.log("Error Completing profile:", error);
    res.status(500).json({
      message: "Error Completing profile",
      error: error.message,
    });
  }
}

// Login as a student or admin

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email with OTP before loggin in",
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    const { password: _, ...userResponse } = user.toObject();

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// get current user profile
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user profile:", error);
    res.status(500).json({
      message: "Error fetching user profile:",
      error: error.message,
    });
  }
}

// update user profile

export async function updateProfile(req, res) {
  try {
    const {
      name,
      email,
      phone,
      department,
      stream,
      semester,
      academicYear,
      rollNumber,
    } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== user.email.toLowerCase()) {
        if (user.role === "user") {
          return res
            .status(400)
            .json({
              message: "Students are not allowed to change their email address",
            });
        }
        if (
          await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } })
        ) {
          return res.status(400).json({ message: "Email already in use" });
        }
        user.email = normalizedEmail;
      }
    }
    if (phone) {
      const cleanPhone = phone.toString().replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        return res
          .status(400)
          .json({ message: "Mobile number must be exactly 10 digits" });
      }
      user.phone = cleanPhone;
    }

    if (name) user.name = name;
    if (department) user.department = department;
    if (stream) user.stream = stream;
    if (semester) user.semester = semester;
    if (academicYear) user.year = academicYear;
    if (rollNumber) user.rollNo = rollNumber;

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
}

// to get all students account(admin)
export async function getUsers(req, res){
  try {
    
  } catch (error) {
    
  }
}