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

    if (!authString || !authString?.startsWith('Bearer')) {
        next(
            new HTTPError(403, 'Forbidden', 'usuario o contraseña incorrecto')
        );
        return;
    }
    try {
        const token = authString.slice(7);
        readToken(token);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'usuario o contraseña incorrecto')
        );
    }
};
export const Authentication = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    const robotRepo = RobotRepository.getInstance();

    try {
        // req.params.id -----> ID del robot
        const robot = await robotRepo.get(req.params.id); // id del dueño del robot

        if (req.payload && robot.owner._id.toString() !== req.payload.id) {
            next(
                new HTTPError(
                    403,
                    'Forbidden',
                    'usuario o contraseña incorrectos'
                )
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};
