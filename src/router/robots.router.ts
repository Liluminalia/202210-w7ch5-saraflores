import { Router } from 'express';
import { RobotController } from '../controller/robot.controller.js';
import { RobotRepository } from '../data/robot.repository.js';

export const robotRouter = Router();
const controller = new RobotController(new RobotRepository());
robotRouter.get('/', controller.getAll.bind(controller));
robotRouter.get('/:id', controller.get.bind(controller));
robotRouter.post('/create', controller.post.bind(controller));
robotRouter.patch('/update/:id', controller.patch.bind(controller));
robotRouter.delete('/delete/:id', controller.delete.bind(controller));
