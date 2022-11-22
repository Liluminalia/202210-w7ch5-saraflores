import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { readToken } from '../services/auth.js';
import { JwtPayload } from 'jsonwebtoken';
import { RobotRepository } from '../data/robot.repository.js';
export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
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
export const Authentication = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    // req.payload.id; //ID del usuario segun el token

    req.params.id; // ID del robot
    const robotRepo = new RobotRepository();
    const robot = await robotRepo.get(req.params.id); // id del dueño del robot

    if (robot.owner?.toString() === (req.payload.id as JwtPayload).id) {
        next(
            new HTTPError(403, 'forbbiden', 'usuario o contraseña incorrectos')
        );
    }
    next();
};
