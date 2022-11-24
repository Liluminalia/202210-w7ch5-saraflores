import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { dataBaseConnect } from '../data.base.connect.js';
import { RobotRepository } from '../data/robot.repository.js';
import { UserRepository } from '../data/user.repository.js';
import { User } from '../entities/user.js';
import { CustomError, HTTPError } from '../interfaces/error.js';
import {
    createToken,
    passwordComparer,
    TokenPayload,
} from '../services/auth.js';
import { UserController } from './user.controller.js';
jest.mock('../data/user.repository');

describe('Given UserController', () => {
    describe('When we instantiate it', () => {
        UserRepository.prototype.get = jest.fn().mockResolvedValue('');

        UserRepository.prototype.post = jest.fn().mockResolvedValue('');

        const repository = UserRepository.getInstance();
        const robotRepo = RobotRepository.getInstance();
        const userController = new UserController(repository, robotRepo);
        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();
        const setCollection = async () => {
            const usersMock = [
                { name: 'tomas', email: 'tomatin@gmail.com', role: 'user' },
                { name: 'pedro', email: 'gone@gmail.com', role: 'admin' },
                { name: 'vera', email: 'pipipi@gmail.com', role: 'admin' },
                {
                    name: 'Pepino',
                    email: 'siempreesverano@gmail.com',
                    role: 'user',
                },
            ];

            await User.deleteMany();
            await User.insertMany(usersMock);
            const data = await User.find();
            const testIds = [data[0].id, data[1].id];
            return testIds;
        };
        let token: string;
        let ids: Array<string>;
        beforeEach(async () => {
            await dataBaseConnect();
            ids = await setCollection();
            const payload: TokenPayload = {
                id: ids[0],
                name: 'pepebot',
                role: 'admin',
            };
            token = createToken(payload);
        });
        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then register should have been called', async () => {
            req.params = {
                name: 'pepe',
                password: 'pepe123',
                email: 'pepe@gmail.com',
                role: 'capitan pescanova',
            };
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({
                id: ids[0],
                name: 'pepe',
                role: 'admin',
            });
        });

        test('Then login should have been called', async () => {
            req.body.name = { name: 'pepe' };
            await userController.login(req as Request, res as Response, next);
            const user = await repository.find(req.body.name);

            req.body.password = 'patata';
            user.password = 'patata';
            const result = await passwordComparer(
                req.body.password,
                user.password
            );
            expect(result).toBe(true);
        });
    });
    describe('when we dont instantiate it', () => {
        const error: CustomError = new HTTPError(
            404,
            'Not found id',
            'message of error'
        );

        UserRepository.prototype.get = jest.fn().mockRejectedValue('User');
        UserRepository.prototype.post = jest.fn().mockRejectedValue(['User']);
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
        //     test('Then if something went wrong patch should throw an error', async () => {
        //         await userController.patch(req as Request, res as Response, next);
        //         expect(error).toBeInstanceOf(HTTPError);
        //     });
        //     test('Then if something went wrong delete should throw an error', async () => {
        //         await userController.delete(req as Request, res as Response, next);
        //         expect(error).toBeInstanceOf(HTTPError);
        //     });
    });
});
