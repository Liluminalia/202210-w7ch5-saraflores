import { NextFunction, Request, Response } from 'express';
import { Data } from '../data/data.js';
import { BasicRepo } from '../data/repo.js';
import { Robot } from '../entities/robot.js';
import { User } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../middleware/interceptor.js';

export class RobotController {
    constructor(
        public readonly repository: Data<Robot>,
        public readonly userRepository: BasicRepo<User>
    ) {
        //
    }
    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            const robots = await this.repository.getAll();
            resp.json({ robots });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async get(req: Request, resp: Response, next: NextFunction) {
        try {
            const robots = await this.repository.get(req.params.id);
            resp.json({ robots });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }
    async post(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            if (!req.payload) {
                throw new Error('invalid payload');
            }
            const user = await this.userRepository.get(req.payload.id);
            req.body.owner = user.id;
            const robots = await this.repository.post(req.body);
            resp.json({ robots });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async patch(req: Request, resp: Response, next: NextFunction) {
        try {
            const robots = await this.repository.patch(req.params.id, req.body);
            resp.json({ robots });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }
    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            await this.repository.delete(req.params.id);
            resp.json({ id: req.params.id });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }
    createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(404, 'Not Found', error.message);
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
