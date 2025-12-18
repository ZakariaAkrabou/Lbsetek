import { Request, Response, NextFunction } from "express";
import joi from "joi";
import { registerValidationSchema,tailorSchema, loginValidationSchema, forgetPasswordValidationSchema, resetPasswordValidationSchema } from "../validators/validationInput";

const validate = (schema: joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({ errors });
        }

        next();
    }
}


export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const {role } = req.body;

    if(role === 'tailor'){
        return validate(tailorSchema)(req, res, next);
    }

    if(role === 'client'){
        return validate(registerValidationSchema)(req, res, next);
    }

    return res.status(400).json({ message: 'Invalid role , must be client or tailor' });
};





export const validateTailor = validate(tailorSchema);
export const validateLogin = validate( loginValidationSchema);
export const validateForgotPassword = validate(forgetPasswordValidationSchema);
export const validateResetPassword = validate(resetPasswordValidationSchema );