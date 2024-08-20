import Joi from "joi";
import { UpdateUserPayload } from "../types/user.type";

export const UpdateUserValidation = (
    payload: UpdateUserPayload
): Joi.ValidationResult<UpdateUserPayload> => {
    const schema = Joi.object({
        photo: Joi.string().trim().uri().required().messages({
            "string.empty": "Photo is required.",
            "any.required": "Photo is required.",
            "string.uri": "Photo is not valid.",
        }),
        bio: Joi.string().trim().required().messages({
            "string.empty": "Bio is required.",
            "any.required": "Bio is required.",
        }),
    });

    return schema.validate(payload);
};
