import { Request, Response } from 'express';
import { registerTailorService, registerClientService,forgetPasswordService,resetPasswordService } from '../services/auth.service';
import { loginUserService,refreshAccessToken } from '../services/auth.service';

import { sendVerificationEmail } from '../utils/mailUtils';
import { generateToken } from '../utils/authUtils';
import cloudinary from '../config/cloudinaryConfig';
import { geocodeAddress } from '../utils/geocoding';
import { UserModel } from '../models/user.model';
import { verifyToken } from '../utils/authUtils';


export const register = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, phone, shopName, city, address, role } = req.body;

  if (role === 'tailor') {
    try {
     
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const streamUpload = (buffer: Buffer, folder: string): Promise<any> => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          stream.end(buffer);
        });
      };

      const uploadResult = await streamUpload(req.file.buffer, 'lbsteek/ID Cards');

      const { lat, lon } = await geocodeAddress(`${city}, ${address}`);

      const tailor = await registerTailorService(
        firstname, lastname, email, password, phone, shopName, city, address, lat, lon, uploadResult.secure_url
      );

      const token = generateToken(tailor._id.toString());
      await sendVerificationEmail(tailor.email, token);

      return res.status(201).json({ message: 'Registration successful. Please verify your email.' });
    } catch (error) {
      console.error('Tailor registration error:', error);
      return res.status(500).json({ message: 'Tailor registration failed' });
    }
  } else if (role === 'client') {
    try {
      const client = await registerClientService(firstname, lastname, email, password, phone);
      const token = generateToken(client._id.toString());
      await sendVerificationEmail(client.email, token);

      return res.status(201).json({ message: 'Client registration successful. Please verify your email.' });
    } catch (error) {
      return res.status(500).json({ message: 'Client registration failed' });
    }
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing token.' });
  }

  try {
    const decoded: any = verifyToken(token);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.isVerified = true;

    await user.save();

    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

export const login = async (req:Request, res:Response)=>{
  const { email, password } = req.body;

  try{
    const  {accessToken, refreshToken } = await loginUserService(email, password);

    res.cookie('refreshToken', refreshToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
  }
  catch(error){
    return res.status(400).json({ message: (error as Error).message });
  }
} 

export const refreshTokenController = async (req:Request, res:Response) => {
  const refreshToken = req.cookies.refreshToken;

  try {
        const { accessToken } = await refreshAccessToken(refreshToken);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000, 
        });

        return res.status(200).json({ message: 'Access token refreshed' });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
}


export const forgetPasswordController = async (req:Request, res:Response) =>{
    const {email} = req.body;
    try{
        const response = await forgetPasswordService(email);
        return res.status(200).json({message: 'Password reset email sent.'});
    }
    catch(error){
        return res.status(400).json({message: (error as Error).message});
    }
}

export const resetPasswordController = async (req:Request, res:Response) =>{
    const {token} = req.query;
    const {newPassword} = req.body;
    try{
        await resetPasswordService(token as string, newPassword);
        return res.status(200).json({message: 'Password has been reset successfully.'});
    }
    catch(error){
        return res.status(400).json({message: (error as Error).message});
    }
}