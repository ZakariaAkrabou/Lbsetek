import { forgetPasswordController } from './../controllers/auth.controller';
import joi, { optional } from "joi";

export const registerValidationSchema = joi.object({
    firstname: joi.string().min(2).max(30).required(),
    lastname: joi.string().min(2).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    phone: joi.string().pattern(/^[0-9]{10}$/).optional(),
    role: joi.string().valid('client', 'tailor').required(),
})

export const tailorSchema = joi.object({
    shopName: joi.string().min(2).max(50).required(),
    city: joi.string().min(2).max(50).required(),
    address: joi.string().min(5).max(100).required(),
    identificationCard: joi.string().required(),
})

export const loginValidationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
})

export const forgetPasswordValidationSchema = joi.object({
    email: joi.string().email().required(),
})

