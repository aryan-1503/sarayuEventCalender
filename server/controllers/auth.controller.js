import {
    createUser,
    deleteUserByEmail,
    findUserByEmail, getUserVerificationCode,
    incrementUserAttempts,
    updateUserVerification
} from "../models/user.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";


const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    secureConnection : false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls : {
        rejectUnauthorized :true
    }
});

export const health = (req,res) => {
    return res.status(200).json({ message : "Auth Router is working"})
}
export const register = async (req,res) => {
    const { username, email, password } = req.body;

    try{
        const userExists = await findUserByEmail(email);
        if(userExists){
            return res.status(400).json({ success: false, message : "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

        const newUser = await createUser(username, email, hashedPassword, verificationCode);

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Verify your email", userId: newUser.userid });
    }catch (error) {
        console.log("Error in register : ",error);
        return res.status(500).json({ success: false, message : "Something went wrong", error })
    }
}


export const verify = async (req, res) => {
    const { email, verificationCode } = req.body;
    try {
        // Fetch the user by email
        const user = await findUserByEmail(email);
        console.log("USER FROM VERIFY : ",user);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Check if the verification code matches
        if (user.verificationcode === verificationCode) {
            // Update user as verified
            const updatedUser = await updateUserVerification(user.userid, true, '', 0);
            const token = jwt.sign({ id: user.userid }, process.env.SECRET, { expiresIn: '1h' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            return res.status(200).json({ message: "Registration done successfully", user: updatedUser });
        } else {
            // Increment attempts if verification code does not match
            await incrementUserAttempts(user.userid);

            if (user.attempts + 1 >= 3) { // +1 to reflect the latest attempt
                await deleteUserByEmail(email);
                return res.status(401).json({ message: "Verification Failed" });
            } else {
                return res.status(401).json({ message: "Try Again" });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req,res) => {
    const { email, password } = req.body;
    try{
        const user = await findUserByEmail(email)
        if(!user){
            // console.log("user not found")
            return res.status(404).json({ message: "User not found! Register first" });
        }
        if (!user.isverified){
            await deleteUserByEmail(user.email)
            return res.status(401).json({ message: "Email not verified!" })
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if (!isPasswordMatch){
            return res.status(400).json({ message: "Password incorrect" });
        }

        let token;
        try{
            token = await jwt.sign({id: user.userid}, process.env.SECRET, { expiresIn: '1d' });
        }catch (err) {
            console.log("JWT sign error:", err);
            return res.status(500).json({ message: "Error generating authentication token." });
        }

        res.cookie('token', token,{
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        return res.status(200).json({message: "Login Successfully",token})
    }catch (error) {
        console.log(error)
        return res.status(500).json({ message : error})
    }
}

export const me = async (req, res) => {
    res.status(200).json({ user : req.user });
}

export
const logout = (req,res) => {
    /*
        Function to log out the current user
    */
    res.clearCookie('token',{
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.status(200).json({ message: "Logout Successfully"});
}