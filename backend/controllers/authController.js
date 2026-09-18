import User from "../models/User.js";
import { generate } from "otp-generator";
// registration of a student step 1 : register user and send otp

export async function registerUser(req, res){
    try {
        const {name, email, phone, password} = req.body;
        if(!email) return res.status(400).json({
            message: "Email is required."
        });

        const cleanPhone = phone ? phone.toString().replace(/\D/g, "") : "";
        if(cleanPhone.length !== 10){
            return res.status(400).json({
                message: "Mobile number must be exactly of 10 digits"
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            if(existingUser.isVerified) return res.status(400).json({
                message: "User already exists"
            });
            await User.deleteOne({ email })
        }
        const otp = generate(6, {
            upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
        });
        // to send otp
    } catch (error) {
        
    }
}