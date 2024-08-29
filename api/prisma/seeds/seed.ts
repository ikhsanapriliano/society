import prisma from "../../src/utils/prisma.util";
import UserSeeder from "./user.seed";

const RunSeed = async () => {
    try {
        await UserSeeder(prisma);
        console.log("Seeding Success!!");
    } catch (error: Error | unknown) {
        console.log(`Seeding Error: ${(error as Error).message}`);
    }
};

RunSeed();
