import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import {verifyToken} from '../utils/authUtils';

interface CustomRequest extends Request {
    userId?: string;
}

export const isVerified = async (req: CustomRequest, res: Response, next: NextFunction) => {

    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please Verify your email first' });
        }

        next();
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }



};

export const authenticated = (req: CustomRequest, res: Response, next: NextFunction) => {
     const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: ' No token provided' });
    }

    try{
        const decoded:any = verifyToken(token);
        req.userId = decoded.id;
        next(); 
    }
    catch(err){
        return res.status(500).json({message:'Internal Server Error'});
    }
}