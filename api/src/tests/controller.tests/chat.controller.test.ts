import { Request, Response } from "express";
import {
    CreateRoomChatHandler,
    UpdateRoomChatHandler,
} from "../../controllers/chat.controller";
import { CreateRoomChat, UpdateRoomChat } from "../../services/chat.service";
import { RoomChatPayload } from "../../types/chat.type";
import { SuccessResponse } from "../../types/response.type";

jest.mock("../../services/chat.service");

describe("Create Room Chat Handler", () => {
    it("Success With Data Void", async () => {
        (CreateRoomChat as jest.Mock).mockResolvedValue(undefined);

        const mockResponse: SuccessResponse<undefined> = {
            status: 201,
            message: "success",
            data: undefined,
        };

        const mockReq: Request = {
            body: {
                message: "halo",
                roomId: "1",
            } as RoomChatPayload,
        } as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                userId: "1",
            },
        } as unknown as Response;
        const mockNext = jest.fn();

        await CreateRoomChatHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
});

describe("Update Room Chat Handler", () => {
    it("Success With Data Void", async () => {
        (UpdateRoomChat as jest.Mock).mockResolvedValue(undefined);

        const mockResponse: SuccessResponse<undefined> = {
            status: 200,
            message: "success",
            data: undefined,
        };

        const mockReq: Request = {
            params: {
                roomId: "1",
            },
        } as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                userId: "1",
            },
        } as unknown as Response;
        const mockNext = jest.fn();

        await UpdateRoomChatHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
});
