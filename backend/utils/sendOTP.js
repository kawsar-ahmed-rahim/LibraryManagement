import { createTransport } from "nodemailer";

const sendOtp = async (email, otp) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_USER,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });
};

export default sendOTP;
