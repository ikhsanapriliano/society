import Joi from "joi";
import { UpdateBioPayload, UpdatePhotoPayload } from "../types/user.type";

export const UpdatePhotoValidation = (
    payload: UpdatePhotoPayload
): Joi.ValidationResult<UpdatePhotoPayload> => {
    const schema = Joi.object({
        photo: Joi.string().trim().required().messages({
            "string.empty": "Photo is required.",
            "any.required": "Photo is required.",
        }),
    });

    return schema.validate(payload);
};

export const UpdateBioValidation = (
    payload: UpdateBioPayload
): Joi.ValidationResult<UpdateBioPayload> => {
    const schema = Joi.object({
        bio: Joi.string().trim().max(50).required().messages({
            "string.empty": "Bio is required.",
            "any.required": "Bio is required.",
            "string.max": "Bio max 50 chars length.",
        }),
    });

    return schema.validate(payload);
};
