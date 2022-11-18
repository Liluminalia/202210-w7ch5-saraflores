import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { thingRouter } from './router/things.router.js';
import { coffeeRouter } from './router/coffee.router.js';
import { tableRouter } from './router/tables.router.js';
import { CustomError } from './interfaces/error.js';
import { userRouter } from './router/user.router.js';

export const app = express();
app.use(cors());
app.disable('x-powered-by');
const corsOptions = {
    origin: '*',
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
    const origin = req.header('Origin') || '*';
    res.setHeader('Access-Control-Allow-Origin', origin as string);
    next();
});

app.get('/', (req, res) => {
    res.send(
        'API de Things y Tables, pon /things o /tables al final de la URL'
    ).end();
});
app.use('/things', thingRouter);
app.use('/tables', tableRouter);
app.use('/coffees', coffeeRouter);
app.use('/users', userRouter);
app.use(
    (error: CustomError, _req: Request, resp: Response, next: NextFunction) => {
        console.log(
            error.name,
            error.statusCode,
            error.statusMessage,
            error.message
        );
        let status = error.statusCode || 500;
        if (error.name === 'ValidationError') {
            status = 406;
        }
        const result = {
            status: status,
            type: error.name,
            error: error.message,
        };
        resp.status(status).json(result).end();
    }
);
