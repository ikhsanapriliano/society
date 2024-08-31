import { Request, Response } from "express";
import { Create, FindById, FindByUserId } from "../../services/room.service";
import { SuccessResponse } from "../../types/response.type";
import {
    CreateRoomResponse,
    RoomPayload,
    RoomResponse,
    UserRoomResponse,
} from "../../types/room.type";
import {
    CreateHandler,
    FindByIdHandler,
    FindByUserIdHandler,
} from "../../controllers/room.controller";

jest.mock("../../services/room.service");

describe("Find By Id Room Handler", () => {
    it("Success With Data Room Response", async () => {
        const mockData: RoomResponse = {
            id: "",
            firstUserId: "",
            secondUser: {
                id: "",
                username: "",
                photo: "",
            },
            chats: [],
        };

        (FindById as jest.Mock).mockResolvedValue(mockData);

        const mockResponse: SuccessResponse<RoomResponse> = {
            status: 200,
            message: "success",
            data: mockData,
        };

        const mockReq: Request = {
            params: {
                id: "1",
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

        await FindByIdHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
});

describe("Find By User Id Room Handler", () => {
    it("Success With Data Array of User Room Response", async () => {
        const mockData: UserRoomResponse[] = [];

        (FindByUserId as jest.Mock).mockResolvedValue(mockData);

        const mockResponse: SuccessResponse<UserRoomResponse[]> = {
            status: 200,
            message: "success",
            data: mockData,
        };

        const mockReq: Request = {
            query: {
                history: undefined,
                idUnread: undefined,
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

        await FindByUserIdHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
});

describe("Create Room Handler", () => {
    it("Success With Data CreateRoomResponse", async () => {
        const mockData: CreateRoomResponse = {
            roomId: "1",
        };

        (Create as jest.Mock).mockResolvedValue(mockData);

        const mockResponse: SuccessResponse<CreateRoomResponse> = {
            status: 201,
            message: "success",
            data: mockData,
        };

        const mockReq: Request = {
            body: {
                secondUserId: "2",
            } as RoomPayload,
        } as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                userId: "1",
            },
        } as unknown as Response;
        const mockNext = jest.fn();

        await CreateHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
});
