import { NextFunction, Request, Response } from 'express';
import { RobotRepository } from '../data/robot.repository.js';
import { RobotController } from './robot.controller.js';
jest.mock('../data/robot.repository');
describe('Given RobotController', () => {
    describe('When we instantiate getAll()', () => {
        RobotRepository.prototype.getAll = jest
            .fn()
            .mockResolvedValue(['mock']);
        RobotRepository.prototype.get = jest.fn().mockResolvedValue(['mock']);
        RobotRepository.prototype.post = jest.fn().mockResolvedValue(['mock']);
        RobotRepository.prototype.patch = jest.fn().mockResolvedValue(['mock']);
        RobotRepository.prototype.delete = jest
            .fn()
            .mockResolvedValue(['mock']);
        const repository = new RobotRepository();
        const robotController = new RobotController(repository);

        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();
        test('Then getAll should have been called', async () => {
            await robotController.getAll(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: ['mock'] });
        });
        test('Then if we give the wrong request getAll should throw an error', async () => {
            await robotController.getAll(req as Request, res as Response, next);
            expect(res.json).toThrow();
        });
        test('Then get should have been called', async () => {
            await robotController.get(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: ['mock'] });
        });
        test('Then post should have been called', async () => {
            await robotController.post(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: ['mock'] });
        });
        test('Then patch should have been called', async () => {
            await robotController.patch(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: ['mock'] });
        });
        test('Then delete should have been called', async () => {
            await robotController.delete(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: ['mock'] });
        });
    });
});
