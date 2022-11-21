import { NextFunction, Request, Response } from 'express';
// import importData from '../mock/data.json' assert { type: 'json' };
import { User } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { BasicRepo } from '../data/repo.js';
import { createToken, passwordComparer } from '../services/auth.js';
// let data: Array<User> = importData.users;

export class UserController {
    constructor(public repository: BasicRepo<User>) {
        //
    }
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.repository.post(req.body);
            res.json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.repository.find({ name: req.body.name });
            const isPasswordValid = await passwordComparer(
                req.body.password,
                user.password
            );
            if (!isPasswordValid) throw new Error();
            const token = createToken({ userName: user.name });
            res.json({ token });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    #createHttpError(error: Error) {
        if ((error as Error).message === 'Not found id') {
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            (error as Error).message
        );
        return httpError;
    }
}
