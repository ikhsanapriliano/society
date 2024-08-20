import bcrypt from "bcrypt";

export const HashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
};

export const ComparePassword = (plain: string, hash: string): boolean => {
    return bcrypt.compareSync(plain, hash);
};
