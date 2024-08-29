import { PrismaClient } from "@prisma/client";
import { HashPassword } from "../../src/utils/bcrypt.util";

const profiles = [
    {
        bio: "Adventure seeker and coffee lover.",
        photo: "/ava-1.png",
    },
    {
        bio: "Foodie with a love for new recipes.",
        photo: "/ava-2.png",
    },
    {
        bio: "Avid reader and amateur writer.",
        photo: "/ava-3.png",
    },
    {
        bio: "Fitness fan and yoga enthusiast.",
        photo: "/ava-4.png",
    },
    {
        bio: "Music lover with a vinyl collection.",
        photo: "/ava-5.png",
    },
    {
        bio: "Travel addict exploring new places.",
        photo: "/ava-6.png",
    },
    {
        bio: "Dog lover and nature hiker.",
        photo: "/ava-7.png",
    },
    {
        bio: "Art enthusiast and museum-goer.",
        photo: "/ava-1.png",
    },
    {
        bio: "Gardener with a green thumb.",
        photo: "/ava-3.png",
    },
    {
        bio: "Movie buff and popcorn fan.",
        photo: "/ava-5.png",
    },
];

export const UserSeeder = async (prisma: PrismaClient) => {
    try {
        await prisma.$transaction(async (tx) => {
            const users = await tx.user.createManyAndReturn({
                data: [
                    {
                        username: "ardiansyah",
                        password: HashPassword("12345678"),
                    },
                    {
                        username: "rina",
                        password: HashPassword("12345678"),
                    },
                    {
                        username: "hilmi",
                        password: HashPassword("12345678"),
                    },
                    {
                        username: "farhan",
                        password: HashPassword("12345678"),
                    },
                    {
                        username: "dewi",
                        password: HashPassword("12345678"),
                    },
                    {
                        username: "irfan",
                        password: HashPassword("12345678"),
                    },
                    {
                        username: "maya",
                        password: HashPassword("12345678"),
                    },
                    {
                        username: "ilham",
                        password: HashPassword("12345678"),
                    },
                    {
                        username: "nadia",
                        password: HashPassword("12345678"),
                    },
                    {
                        username: "teguh",
                        password: HashPassword("12345678"),
                    },
                ],
            });

            for (let i = 0; i < users.length; i++) {
                await tx.profile.create({
                    data: {
                        userId: users[i].id,
                        photo: profiles[i].photo,
                        bio: profiles[i].bio,
                    },
                });
            }
        });
    } catch (error: Error | unknown) {
        throw error as Error;
    }
};

export default UserSeeder;
