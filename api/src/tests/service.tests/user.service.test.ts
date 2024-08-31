import {
    Delete,
    FindById,
    FindMany,
    UpdateBio,
    UpdatePhoto,
} from "../../services/user.service";
import { LoginResponse } from "../../types/auth.type";
import {
    UpdateBioPayload,
    UpdatePhotoPayload,
    UserResponse,
} from "../../types/user.type";
import { GenerateToken } from "../../utils/jwt.util";
import prisma from "../../utils/prisma.util";

jest.mock("../../utils/prisma.util", () => ({
    __esModule: true,
    default: {
        user: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
        profile: {
            update: jest.fn(),
        },
    },
}));

jest.mock("../../utils/jwt.util");

describe("Find Many User Service", () => {
    it("Success Return Array of User Response", async () => {
        const mockResponse: UserResponse[] = [];

        (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([]);

        const result = await FindMany();
        expect(result).toEqual(mockResponse);
    });
});

describe("Find By Id User Service", () => {
    it("Success Return User Response", async () => {
        const mockUserId = "1";
        const mockUser = {
            id: mockUserId,
            username: "",
            profile: {
                photo: "",
                bio: "",
            },
        };
        const mockResponse: UserResponse = {
            id: mockUser.id,
            username: mockUser.username,
            photo: mockUser.profile.photo,
            bio: mockUser.profile.bio,
        };

        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

        const result = await FindById(mockUserId);
        expect(result).toEqual(mockResponse);
    });
});

describe("Update Photo User Service", () => {
    it("Success Return Login Response", async () => {
        const mockUserId = "1";
        const mockPayload: UpdatePhotoPayload = {
            photo: "",
        };
        const mockProfile = {
            photo: mockPayload.photo,
            bio: "haha",
        };
        const mockToken = "";
        const mockResponse: LoginResponse = {
            token: mockToken,
        };

        (prisma.profile.update as jest.Mock).mockResolvedValueOnce(mockProfile);
        (GenerateToken as jest.Mock).mockResolvedValueOnce(mockToken);

        const result = await UpdatePhoto(mockUserId, mockPayload);
        expect(result).toEqual(mockResponse);
    });
});

describe("Update Bio User Service", () => {
    it("Success Return Login Response", async () => {
        const mockUserId = "1";
        const mockPayload: UpdateBioPayload = {
            bio: "",
        };
        const mockProfile = {
            photo: mockPayload.bio,
            bio: "haha",
        };
        const mockToken = "";
        const mockResponse: LoginResponse = {
            token: mockToken,
        };

        (prisma.profile.update as jest.Mock).mockResolvedValueOnce(mockProfile);
        (GenerateToken as jest.Mock).mockResolvedValueOnce(mockToken);

        const result = await UpdateBio(mockUserId, mockPayload);
        expect(result).toEqual(mockResponse);
    });
});

describe("Delete User Service", () => {
    it("Success Return Void", async () => {
        const mockUserId = "1";

        (prisma.user.delete as jest.Mock).mockResolvedValueOnce(undefined);

        const result = await Delete(mockUserId);
        expect(result).toEqual(undefined);
    });
});
