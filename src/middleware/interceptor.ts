import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { readToken } from '../services/auth.js';

export const logged = (req: Request, res: Response, next: NextFunction) => {
    const authString = req.get('Authorization');
    if (!authString || authString?.slice(1, 6) !== 'Bearer') {
        next(
            new HTTPError(403, 'forbidden', 'usuario o contraseña incorrecto')
        );
        return;
    }
    try {
        const token = authString.slice(7);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'forbidden', 'usuario o contraseña incorrecto')
        );
    }
};