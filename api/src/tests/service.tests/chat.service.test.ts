import { CreateRoomChat, UpdateRoomChat } from "../../services/chat.service";
import { RoomChatPayload } from "../../types/chat.type";
import prisma from "../../utils/prisma.util";

jest.mock("../../utils/prisma.util", () => ({
    __esModule: true,
    default: {
        $transaction: jest.fn(),
        roomChat: {
            updateMany: jest.fn(),
        },
    },
}));

describe("Create Room Chat Service", () => {
    it("Success Return Void", async () => {
        const mockUserId = "1";
        const payload = {} as RoomChatPayload;

        (prisma.$transaction as jest.Mock).mockResolvedValueOnce(undefined);

        const result = await CreateRoomChat(mockUserId, payload);
        expect(result).toBe(undefined);
    });
});

describe("Update Room Chat Service", () => {
    it("Success Return Void", async () => {
        const mockRoomId = "1";
        const mockUserId = "1";

        (prisma.roomChat.updateMany as jest.Mock).mockResolvedValueOnce(
            undefined
        );

        const result = await UpdateRoomChat(mockRoomId, mockUserId);
        expect(result).toBe(undefined);
    });
});
