import Joi from "joi";
import { RoomChatPayload } from "../types/chat.type";

export const CreateRoomChatValidation = (
    payload: RoomChatPayload
): Joi.ValidationResult<RoomChatPayload> => {
    const schema = Joi.object({
        message: Joi.string().trim(),
        mediaUrl: Joi.string().trim().uri(),
        roomId: Joi.string().required().messages({
            "string.empty": "Room id is required.",
            "any.required": "Room id is required.",
        }),
    });

    return schema.validate(payload);
};
