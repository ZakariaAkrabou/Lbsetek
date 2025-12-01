import { generateToken } from './../utils/authUtils';
import { UserModel } from '../models/user.model';
import { TailorModel } from '../models/tailor.model';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/authUtils';
import { sendPasswordResetEmail } from '../utils/mailUtils';


export const registerTailorService = async (
    firstname: string, lastname: string, email: string, password: string,
    phone: string, shopName: string, city: String, address: String,
    lat: Number, lon: Number, identificationCard: string) => {

    const newTailor = new TailorModel({
        firstname,
        lastname,
        email,
        password,
        phone,
        role: 'tailor',
        shopName,
        location: { city, address, coordinates: { lon, lat } },
        identificationCard,
    });

    await newTailor.save();
    return newTailor;
}

export const registerClientService = async (
    firstname: string, lastname: string,
    email: string, password: string, phone: string) => {

    const newClient = new UserModel({
        firstname,
        lastname,
        email,
        password,
        phone,
        role: 'client',
    })

    await newClient.save();
    return newClient;
}

export const loginUserService = async (email: string, password: string) => {

    const user = await UserModel.findOne({ email });
    if (!user) {
        console.log('Login failed: User not found for email', email);
        throw new Error('User not found');
    }

    if (!user.isVerified) {
        throw new Error('Please verify your email before logging in.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    await user.setRefreshToken(refreshToken);

    return { user, accessToken, refreshToken };
}

export const refreshAccessToken = async (refreshToken: string) => {
    const user = await UserModel.findOne({});
    if (!user || !user.validateRefreshToken(refreshToken)) {
        throw new Error('Invalid refresh token');
    }
    const accessToken = generateAccessToken(user._id.toString());
    return { accessToken };
}

export const forgetPasswordService = async (email: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error('No account with that email address exists.');
    }

    const resetToken = generateToken(user._id.toString());

    await user.setPasswordResetToken(resetToken);

    await sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Password reset email sent.' };
}

export const resetPasswordService = async (token: string, newPassword: string) => {
    const user = await UserModel.findOne({ passwordResetToken: token });

  
    if (user) {
      
    } else {
       
    }

    if (!user || !user.passwordResetExpires || user.passwordResetExpires.getTime() < Date.now()) {
        throw new Error('Invalid or expired reset token.');
    }
    await user.setNewPassword(newPassword);
    return { message: 'Password has been reset successfully.' };
}