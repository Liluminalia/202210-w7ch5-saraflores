import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { robotRouter } from './router/robots.router.js';
import { errorManager } from './middleware/errors.js';
import { setCors } from './middleware/cors.js';
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
app.use(setCors);

app.get('/', (req, res) => {
    res.send('API de Robots, pon /robots al final de la URL').end();
});
app.use('/robots', robotRouter);
app.use('/users', userRouter);
app.use(errorManager);
