import { Router } from 'express';
import { UserController } from '../controller/user.controller.js';
import { RobotRepository } from '../data/robot.repository.js';
import { UserRepository } from '../data/user.repository.js';

export const userRouter = Router();
const controller = new UserController(
    new UserRepository(),
    new RobotRepository()
);
userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
