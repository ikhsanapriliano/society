import { Request, Response } from "express";
import {
    LoginHandler,
    RegisterHandler,
} from "../../controllers/auth.controller";
import { Login, Register } from "../../services/auth.service";
import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
} from "../../types/auth.type";
import { SuccessResponse } from "../../types/response.type";

jest.mock("../../services/auth.service");

describe("Register Handler", () => {
    it("Success With Data Login Response", async () => {
        const mockData: LoginResponse = {
            token: "",
        };

        (Register as jest.Mock).mockResolvedValue(mockData);

        const mockResponse: SuccessResponse<LoginResponse> = {
            status: 201,
            message: "success",
            data: mockData,
        };

        const mockReq: Request = {
            body: {
                username: "hahahihi",
                password: "password",
                confirmPassword: "password",
            } as RegisterPayload,
        } as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const mockNext = jest.fn();

        await RegisterHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it("Throw Error", async () => {
        const mockReq: Request = {
            body: {
                username: "",
                password: "password",
                confirmPassword: "password",
            } as RegisterPayload,
        } as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const mockNext = jest.fn();

        await RegisterHandler(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
});

describe("Login Handler", () => {
    it("Success With Data Login Response", async () => {
        const mockData: LoginResponse = {
            token: "",
        };

        (Login as jest.Mock).mockResolvedValue(mockData);

        const mockResponse: SuccessResponse<LoginResponse> = {
            status: 200,
            message: "success",
            data: mockData,
        };

        const mockReq: Request = {
            body: {
                username: "hahahihi",
                password: "password",
            } as LoginPayload,
        } as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const mockNext = jest.fn();

        await LoginHandler(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it("Throw Error", async () => {
        const mockReq: Request = {
            body: {
                username: "",
                password: "password",
            } as LoginPayload,
        } as unknown as Request;
        const mockRes: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const mockNext = jest.fn();

        await LoginHandler(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
});
