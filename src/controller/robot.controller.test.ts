import { NextFunction, Request, Response } from 'express';
import { RobotRepository } from '../data/robot.repository.js';
import { ProtoRobot, Robot } from '../entities/robot.js';
import { CustomError, HTTPError } from '../interfaces/error.js';
import { RobotController } from './robot.controller.js';
jest.mock('../data/robot.repository');

describe('Given RobotController', () => {
    describe('When we instantiate it', () => {
        const error: CustomError = new HTTPError(
            404,
            'Not found id',
            'message of error'
        );
        const mockData: Array<ProtoRobot> = [
            {
                name: 'robot1',
                img: 'url img',
                velocity: 7,
                force: 8,
                creation: 'date string',
            },
            {
                name: 'robot2',
                img: 'new url imag',
                velocity: 4,
                force: 5,
                creation: 'new date string',
            },
        ];
        const repository = new RobotRepository();
        const robotController = new RobotController(repository);
        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();
        test('Then getAll should have been called', async () => {
            RobotRepository.prototype.getAll = jest
                .fn()
                .mockResolvedValue(mockData);
            await robotController.getAll(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData });
        });
        test('Then if something went wrong getAll should throw an error', async () => {
            RobotRepository.prototype.getAll = jest
                .fn()
                .mockRejectedValue(['Robot']);
            await robotController.getAll(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then get should have been called', async () => {
            RobotRepository.prototype.get = jest
                .fn()
                .mockResolvedValue(mockData[0]);
            req.params = { id: '0' };
            await robotController.get(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData[0] });
        });
        test('Then if something went wrong get should throw an error', async () => {
            RobotRepository.prototype.get = jest
                .fn()
                .mockRejectedValue('Robot');
            await robotController.get(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then post should have been called', async () => {
            RobotRepository.prototype.post = jest
                .fn()
                .mockResolvedValue('newRobot');
            await robotController.post(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: 'newRobot' });
        });
        test('Then if something went wrong post should throw an error', async () => {
            RobotRepository.prototype.post = jest
                .fn()
                .mockRejectedValue(['Robot']);
            await robotController.post(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then patch should have been called', async () => {
            RobotRepository.prototype.patch = jest
                .fn()
                .mockResolvedValue(mockData[0]);
            await robotController.patch(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData[0] });
        });
        test('Then if something went wrong patch should throw an error', async () => {
            RobotRepository.prototype.patch = jest
                .fn()
                .mockResolvedValue(['Robot']);
            await robotController.patch(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then delete should have been called', async () => {
            RobotRepository.prototype.delete = jest
                .fn()
                .mockResolvedValue(mockData);
            await robotController.delete(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData });
        });
        test('Then if something went wrong delete should throw an error', async () => {
            RobotRepository.prototype.delete = jest
                .fn()
                .mockResolvedValue(['Robot']);
            await robotController.delete(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
