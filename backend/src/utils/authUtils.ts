import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN as string;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN as string;





export const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']
    });
}

export const verifyToken = (token:string) =>{
    return jwt.verify(token, JWT_ACCESS_SECRET as string);
}

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']
    });
}

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']
    });
}
