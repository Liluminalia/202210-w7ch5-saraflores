import { NextFunction, Request, Response } from 'express';
import { RobotRepository } from '../data/robot.repository.js';
import { UserRepository } from '../data/user.repository.js';
import { ProtoRobotI } from '../entities/robot.js';
import { CustomError, HTTPError } from '../interfaces/error.js';
import { RobotController } from './robot.controller.js';

describe('Given RobotController', () => {
    describe('When we instantiate it', () => {
        const mockData: Array<ProtoRobotI> = [
            {
                name: 'robot1',
                img: 'url img',
                velocity: 7,
                force: 8,
                date: '2022-4-23',
            },
            {
                name: 'robot2',
                img: 'new url imag',
                velocity: 4,
                force: 5,
                date: '2022-5-23',
            },
        ];

        RobotRepository.prototype.post = jest
            .fn()
            .mockResolvedValue('newRobot');

        RobotRepository.prototype.delete = jest
            .fn()
            .mockResolvedValue(mockData);
        const repository = RobotRepository.getInstance();
        repository.getAll = jest.fn().mockResolvedValue(mockData);
        repository.get = jest.fn().mockResolvedValue(mockData[0]);
        repository.patch = jest.fn().mockResolvedValue(mockData[0]);
        const userRepository = UserRepository.getInstance();
        const robotController = new RobotController(repository, userRepository);
        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();
        test('Then getAll should have been called', async () => {
            await robotController.getAll(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData });
        });

        test('Then get should have been called', async () => {
            req.params = { id: '0' };
            await robotController.get(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData });
        });

        test('Then post should have been called', async () => {
            await robotController.post(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData });
        });

        test('Then patch should have been called', async () => {
            await robotController.patch(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData });
        });
        test('Then delete should have been called', async () => {
            await robotController.delete(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData });
        });
    });
    describe('when we dont instantiate it', () => {
        const error: CustomError = new HTTPError(
            404,
            'Not found id',
            'message of error'
        );
        RobotRepository.prototype.getAll = jest
            .fn()
            .mockRejectedValue(['Robot']);
        RobotRepository.prototype.get = jest.fn().mockRejectedValue('Robot');
        RobotRepository.prototype.post = jest.fn().mockRejectedValue(['Robot']);
        RobotRepository.prototype.patch = jest
            .fn()
            .mockRejectedValue(['Robot']);
        RobotRepository.prototype.delete = jest.fn().mockRejectedValue(3);
        const repository = RobotRepository.getInstance();
        const userRepository = new UserRepository();

        const robotController = new RobotController(repository, userRepository);
        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();
        test('Then if something went wrong getAll should throw an error', async () => {
            await robotController.getAll(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong get should throw an error', async () => {
            await robotController.get(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong post should throw an error', async () => {
            await robotController.post(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong patch should throw an error', async () => {
            await robotController.patch(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong delete should throw an error', async () => {
            await robotController.delete(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
