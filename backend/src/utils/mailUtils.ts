import { Transporter } from './../node_modules/@types/nodemailer/index.d';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendVerificationEmail = async (email: string, token: string) => {

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'verify you email',
        html: `<p>Please click the link below to verify your email:</p><p><a href="${verificationLink}">Verify Email</a></p>`
    };

    await Transporter.sendMail(mailOptions);
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const resetLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`
    }
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending password reset email:', error);
    }
    
}