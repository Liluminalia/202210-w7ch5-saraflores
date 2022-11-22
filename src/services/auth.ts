import { SECRET } from '../config.js';
import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';

export const createToken = (payload: TokenPayload) => {
    if (typeof SECRET !== 'string') throw new Error();
    return jwt.sign(payload, SECRET);
};
type TokenPayload = {
    id: string;
    name: string;
    role: string;
};

export const readToken = (token: string) => {
    if (typeof SECRET !== 'string') throw new Error();
    const payload = jwt.verify(token, SECRET);
    if (typeof payload === 'string') throw new Error('token not valid');
    return payload;
};
export const passwordEncrypt = (password: string) => {
    return bc.hash(password, 10);
};
export const passwordComparer = (
    newPassword: string,
    encryptedPassword: string
) => {
    return bc.compare(newPassword, encryptedPassword);
};
