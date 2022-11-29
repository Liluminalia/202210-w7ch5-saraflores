import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Repo, BasicRepo } from '../data/repo.js';
import { RobotI } from '../entities/robot.js';
import { UserI } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../middleware/interceptor.js';

const debug = createDebug('W8:controllers:robot');

export class RobotController {
    constructor(
        public repository: Repo<RobotI>,
        public userRepository: BasicRepo<UserI>
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
            const robot = await this.repository.get(req.params.id);
            resp.json({ robot });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async post(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('post');
            if (!req.payload) {
                throw new Error('invalid payload');
            }
            const user = await this.userRepository.get(req.payload.id);
            req.body.owner = user.id;
            const robot = await this.repository.post(req.body);
            //   añadir robots en la lista, falta por hacer
            resp.status(201).json({ robot });
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
            resp.status(202).json({ robots });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            await this.repository.delete(req.params.id);
            resp.status(200).json({});
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    #createHttpError(error: Error) {
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
