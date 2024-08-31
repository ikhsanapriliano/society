import prisma from "../../utils/prisma.util";
import {
    CreateRoomResponse,
    RoomPayload,
    RoomResponse,
} from "../../types/room.type";
import { Create, FindById, FindByUserId } from "../../services/room.service";
import { Room } from "@prisma/client";

jest.mock("../../utils/prisma.util", () => ({
    __esModule: true,
    default: {
        room: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
        },
    },
}));

describe("Find By Id Room Service", () => {
    it("Success Return Room Response", async () => {
        const mockUserId = "1";
        const mockId = "1";
        const mockRoom = {
            id: mockId,
            firstUserId: mockUserId,
            secondUserId: "2",
            firstUser: {
                username: "",
                profile: {
                    photo: "",
                },
            },
            secondUser: {
                username: "",
                profile: {
                    photo: "",
                },
            },
            roomChat: [],
        };
        const mockRoomResponse: RoomResponse = {
            id: mockId,
            firstUserId: mockUserId,
            secondUser: {
                id: mockRoom.secondUserId,
                photo: mockRoom.secondUser.profile.photo,
                username: mockRoom.secondUser.username,
            },
            chats: [],
        } as RoomResponse;

        (prisma.room.findUnique as jest.Mock).mockResolvedValueOnce(mockRoom);

        const result = await FindById(mockUserId, mockId);
        expect(result).toEqual(mockRoomResponse);
    });

    it("Throw Error if Room not Found", async () => {
        const mockUserId = "1";
        const mockId = "1";

        (prisma.room.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await expect(FindById(mockUserId, mockId)).rejects.toThrow(
            "400:Room not find."
        );
    });
});

describe("Find By User Id Room Service", () => {
    it("Success Return Array of User Room Response", async () => {
        const mockUserId = "1";

        (prisma.room.findMany as jest.Mock).mockResolvedValue([]);

        const result = await FindByUserId(mockUserId);
        expect(result).toEqual([]);
    });
});

describe("Create Room Service", () => {
    it("Success Return Create Room Response", async () => {
        const mockUserId = "1";
        const mockPayload: RoomPayload = {
            secondUserId: "2",
        };
        const mockResponse: CreateRoomResponse = {
            roomId: "3",
        };

        (prisma.room.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.room.create as jest.Mock).mockResolvedValueOnce({
            id: mockResponse.roomId,
        } as Room);

        const result = await Create(mockUserId, mockPayload);
        expect(result).toEqual(mockResponse);
    });
});
