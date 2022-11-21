import { Router } from 'express';
import { RobotController } from '../controller/robot.controller.js';
import { RobotRepository } from '../data/robot.repository.js';
import { logged } from '../middleware/interceptor.js';

export const robotRouter = Router();
const controller = new RobotController(new RobotRepository());
robotRouter.get('/', logged, controller.getAll.bind(controller));
robotRouter.get('/:id', logged, controller.get.bind(controller));
robotRouter.post('/create', logged, controller.post.bind(controller));
robotRouter.patch('/update/:id', logged, controller.patch.bind(controller));
robotRouter.delete('/delete/:id', logged, controller.delete.bind(controller));
