import { NextFunction, Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { RobotRepository } from '../data/robot.repository.js';
import { UserRepository } from '../data/user.repository.js';
import { CustomError, HTTPError } from '../interfaces/error.js';
import { passwordComparer, createToken } from '../services/auth.js';
import { UserController } from './user.controller.js';
jest.mock('../services/auth');
describe('Given UserController', () => {
    describe('When we instantiate it', () => {
        const repository = UserRepository.getInstance();
        const robotRepo = RobotRepository.getInstance();
        const userId = new Types.ObjectId();
        const userController = new UserController(repository, robotRepo);
        repository.post = jest.fn().mockResolvedValue({
            id: userId,
            name: 'pepe',
            role: 'admin',
        });
        repository.find = jest.fn().mockResolvedValue({
            id: userId,
            name: 'pepe',
            role: 'admin',
        });
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;
        beforeEach(() => {
            req = {};
            res = {};
            res.status = jest.fn().mockReturnValue(res);
            next = jest.fn();
            res.json = jest.fn();
        });

        test('Then register should have been called', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({
                user: {
                    id: userId,
                    name: 'pepe',
                    role: 'admin',
                },
            });
        });

        test('Then login should have been called', async () => {
            (passwordComparer as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { password: 'patata' };

            await userController.login(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalledWith({ token: 'token' });
        });
    });
    describe('when we dont instantiate it', () => {
        const error: CustomError = new HTTPError(
            404,
            'Not found id',
            'message of error'
        );

        const repository = UserRepository.getInstance();
        const robotRepo = RobotRepository.getInstance();
        const userController = new UserController(repository, robotRepo);

        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();

        test('Then if something went wrong register should throw an error', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong login should throw an error', async () => {
            await userController.login(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if password is not valid login should throw an error', async () => {
            (passwordComparer as jest.Mock).mockResolvedValue(false);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { password: 'patata' };

            await userController.login(req as Request, res as Response, next);

            expect(error).toBeInstanceOf(HTTPError);
        });
        // test no funciona como yo quiero, stopper
        test('Then if there is not password login should throw an error', async () => {
            repository.find = jest.fn().mockResolvedValue({
                id: '637d1d346346f6ff04b55896',
                name: 'pepe',
                role: 'admin',
            });

            await userController.login(req as Request, res as Response, next);

            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
