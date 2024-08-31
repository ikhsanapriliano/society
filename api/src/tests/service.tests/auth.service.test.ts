import { Profile, User } from "@prisma/client";
import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
} from "../../types/auth.type";
import { GenerateToken } from "../../utils/jwt.util";
import { Login, Register } from "../../services/auth.service";
import prisma from "../../utils/prisma.util";
import { ComparePassword } from "../../utils/bcrypt.util";

jest.mock("../../utils/prisma.util", () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

jest.mock("../../utils/jwt.util");
jest.mock("../../utils/bcrypt.util");

describe("Register Service", () => {
    it("Success Return Token", async () => {
        const mockPayload: RegisterPayload = {
            username: "",
            password: "",
            confirmPassword: "",
        };
        const mockProfile: Profile = {
            id: "",
            bio: "",
            photo: "",
            userId: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const mockToken = "";
        const mockResult: LoginResponse = {
            token: mockToken,
        };

        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
        (prisma.$transaction as jest.Mock).mockResolvedValueOnce(mockProfile);
        (GenerateToken as jest.Mock).mockResolvedValueOnce(mockToken);

        const result = await Register(mockPayload);
        expect(result).toEqual(mockResult);
    });
    it("Throw Error if Username Exist", async () => {
        const mockPayload: RegisterPayload = {
            username: "",
            password: "",
            confirmPassword: "",
        };

        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
            username: mockPayload.username,
        } as User);

        await expect(Register(mockPayload)).rejects.toThrow(
            "400:Username already exist."
        );
    });
});

describe("Login Service", () => {
    it("Success Return Token", async () => {
        const mockPayload: LoginPayload = {
            username: "",
            password: "",
        };
        const mockToken = "";
        const mockResult: LoginResponse = { token: mockToken };

        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
            username: mockPayload.username,
        } as User);

        (ComparePassword as jest.Mock).mockResolvedValueOnce(true);
        (GenerateToken as jest.Mock).mockResolvedValueOnce(mockToken);

        const result = await Login(mockPayload);
        expect(result).toEqual(mockResult);
    });
    it("Throw Error if Username Doesn't Exist", async () => {
        const mockPayload: LoginPayload = {
            username: "",
            password: "",
        };

        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await expect(Login(mockPayload)).rejects.toThrow(
            "400:Username not found."
        );
    });

    it("Throw Error if Password Wrong", async () => {
        const mockPayload: LoginPayload = {
            username: "",
            password: "",
        };

        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
            username: mockPayload.username,
        } as User);

        (ComparePassword as jest.Mock).mockResolvedValueOnce(false);

        await expect(Login(mockPayload)).rejects.toThrow(
            "400:Incorrect password."
        );
    });
});
