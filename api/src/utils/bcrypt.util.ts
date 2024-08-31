import bcrypt from "bcryptjs";

export const HashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
};

export const ComparePassword = async (
    plain: string,
    hash: string
): Promise<boolean> => {
    return bcrypt.compareSync(plain, hash);
};
