import { NextFunction, Request, Response } from 'express';

export const setCors = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.header('Origin') || '*';
    res.setHeader('Access-Control-Allow-Origin', origin as string);

    next();
};
import { CustomError } from '../interfaces/error.js';
import { NextFunction, Request, Response } from 'express';

export const errorManager = () => {
    (
        error: CustomError,
        _req: Request,
        resp: Response,
        _next: NextFunction
    ) => {
        _next;
        console.log(
            error.name,
            error.statusCode,
            error.statusMessage,
            error.message
        );
        let status = error.statusCode || 500;
        if (error.name === 'ValidationError') {
            status = 406;
        }
        const result = {
            status: status,
            type: error.name,
            error: error.message,
        };
        resp.status(status).json(result).end();
    };
};
