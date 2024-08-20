import Joi from "joi";
import { LoginPayload, RegisterPayload } from "../types/auth.type";

export const RegisterValidation = (
    payload: RegisterPayload
): Joi.ValidationResult<RegisterPayload> => {
    const schema = Joi.object({
        username: Joi.string().trim().required().messages({
            "string.empty": "Username is required.",
            "any.required": "Username is required.",
        }),
        email: Joi.string().trim().lowercase().email().required().messages({
            "string.empty": "Email is required.",
            "any.required": "Email is required.",
            "string.email": "Email is not valid",
        }),
        password: Joi.string().trim().min(8).required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
        }),
        confirmPassword: Joi.string()
            .trim()
            .min(8)
            .required()
            .valid(Joi.ref("password"))
            .messages({
                "string.empty": "Confirm password is required",
                "any.required": "Confirm password is required",
                "string.min": "Confirm password must be at least 8 characters.",
                "any.only": "Confirm password doesn't match with password",
            }),
    });

    return schema.validate(payload);
};

export const LoginValidation = (
    payload: LoginPayload
): Joi.ValidationResult<LoginPayload> => {
    const schema = Joi.object({
        email: Joi.string().trim().lowercase().email().required().messages({
            "string.empty": "Email is required.",
            "any.required": "Email is required.",
            "string.email": "Email is not valid",
        }),
        password: Joi.string().trim().min(8).required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
        }),
    });

    return schema.validate(payload);
};
