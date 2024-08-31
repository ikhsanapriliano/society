import { Request, Response } from "express";
import {
    DeleteHandler,
    FindByIdHandler,
    FindManyHandler,
    UpdateBioHandler,
    UpdatePhotoHandler,
} from "../../controllers/user.controller";
import {
    Delete,
    FindById,
    FindMany,
    UpdateBio,
    UpdatePhoto,
} from "../../services/user.service";
import { SuccessResponse } from "../../types/response.type";
import {
    UpdateBioPayload,
    UpdatePhotoPayload,
    UserResponse,
} from "../../types/user.type";
import { LoginResponse } from "../../types/auth.type";

jest.mock("../../services/user.service");

describe("Find By Id User Handler", () => {
    it("Success With Data User Response", async () => {
        const mockData: UserResponse = {
            id: "1",
            username: "1",
            photo: "1",
            bio: "1",
        };

        (FindById as jest.Mock).mockResolvedValue(mockData);

        const mockResponse: SuccessResponse<UserResponse> = {
            status: 200,
            message: "success",
            data: mockData,
        };

        const mockReq: Request = {} as unknown as Request;
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

describe("Find Many User Handler", () => {
    it("Success With Data Array of User Response", async () => {
        const mockData: UserResponse[] = [];

        (FindMany as jest.Mock).mockResolvedValue(mockData);

        const mockResponse: SuccessResponse<UserResponse[]> = {
            status: 200,
            message: "success",
            data: mockData,
        };

        const mockReq: Request = {
            query: {
                username: undefined,
                bio: undefined,
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

        await FindManyHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
});

describe("Update Photo User Handler", () => {
    it("Success With Data Login Response", async () => {
        const mockData: LoginResponse = {
            token: "1",
        };

        (UpdatePhoto as jest.Mock).mockResolvedValue(mockData);

        const mockResponse: SuccessResponse<LoginResponse> = {
            status: 200,
            message: "success",
            data: mockData,
        };

        const mockReq: Request = {
            body: {
                photo: "1",
            } as UpdatePhotoPayload,
        } as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                userId: "1",
            },
        } as unknown as Response;
        const mockNext = jest.fn();

        await UpdatePhotoHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
});

describe("Update Bio User Handler", () => {
    it("Success With Data Login Response", async () => {
        const mockData: LoginResponse = {
            token: "1",
        };

        (UpdateBio as jest.Mock).mockResolvedValue(mockData);

        const mockResponse: SuccessResponse<LoginResponse> = {
            status: 200,
            message: "success",
            data: mockData,
        };

        const mockReq: Request = {
            body: {
                bio: "1",
            } as UpdateBioPayload,
        } as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                userId: "1",
            },
        } as unknown as Response;
        const mockNext = jest.fn();

        await UpdateBioHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
});

describe("Delete User Handler", () => {
    it("Success With Data Void", async () => {
        (Delete as jest.Mock).mockResolvedValue(undefined);

        const mockResponse: SuccessResponse<undefined> = {
            status: 200,
            message: "success",
            data: undefined,
        };

        const mockReq: Request = {} as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                userId: "1",
            },
        } as unknown as Response;
        const mockNext = jest.fn();

        await DeleteHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
});
