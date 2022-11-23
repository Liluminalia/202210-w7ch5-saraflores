import { Router } from 'express';
import { RobotController } from '../controller/robot.controller.js';
import { RobotRepository } from '../data/robot.repository.js';
import { UserRepository } from '../data/user.repository.js';
import { Authentication, logged } from '../middleware/interceptor.js';

export const robotRouter = Router();
const controller = new RobotController(
    RobotRepository.getInstance(),
    new UserRepository()
);
robotRouter.get('/', controller.getAll.bind(controller));
robotRouter.get('/:id', controller.get.bind(controller));
robotRouter.post('/create', logged, controller.post.bind(controller));
robotRouter.patch(
    '/update/:id',
    logged,
    Authentication,
    controller.patch.bind(controller)
);
robotRouter.delete(
    '/delete/:id',
    logged,
    Authentication,
    controller.delete.bind(controller)
);
