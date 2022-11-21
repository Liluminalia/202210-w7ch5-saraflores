import { SECRET } from '../config.js';
import jwt from 'jsonwebtoken';
import pkg from 'bcryptjs';
const { hash, compare } = pkg;

export const createToken = (payload: { userName: string }) => {
    if (typeof SECRET !== 'string') throw new Error();
    return jwt.sign(payload, SECRET);
};

export const readToken = (token: string) => {
    if (typeof SECRET !== 'string') throw new Error();
    const payload = jwt.verify(token, SECRET);
    if (typeof payload === 'string') throw new Error('token not valid');
    return payload;
};
export const passwordEncrypt = (password: string) => {
    return hash(password, 10);
};
export const passwordComparer = (
    password: string,
    encryptedPassword: string
) => {
    return compare(password, encryptedPassword);
};
