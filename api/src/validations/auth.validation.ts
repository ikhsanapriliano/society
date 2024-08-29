import Joi from "joi";
import { LoginPayload, RegisterPayload } from "../types/auth.type";

export const RegisterValidation = (
    payload: RegisterPayload
): Joi.ValidationResult<RegisterPayload> => {
    const schema = Joi.object({
        username: Joi.string()
            .trim()
            .required()
            .max(10)
            .pattern(/^\S+$/)
            .messages({
                "string.empty": "Username is required.",
                "any.required": "Username is required.",
                "string.pattern.base": "Username cannot contain spaces.",
                "string.max": "Username max 10 chars length.",
            }),
        password: Joi.string()
            .trim()
            .min(8)
            .required()
            .pattern(/^\S+$/)
            .messages({
                "string.empty": "Password is required.",
                "any.required": "Password is required.",
                "string.min": "Password must be at least 8 characters.",
                "string.pattern.base": "Password cannot contain spaces.",
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
        username: Joi.string().trim().lowercase().required().messages({
            "string.empty": "Username is required.",
            "any.required": "Username is required.",
        }),
        password: Joi.string().trim().min(8).required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
        }),
    });

    return schema.validate(payload);
};
