import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dataBaseConnect } from '../data.base.connect';
import { Robot } from '../entities/robot';
import { User } from '../entities/user';
import { createToken, TokenPayload } from '../services/auth';

const setCollection = async () => {
    const usersMock = [
        { name: 'tomas', email: 'tomatin@gmail.com', role: 'user' },
        { name: 'pedro', email: 'gone@gmail.com', role: 'admin' },
        { name: 'vera', email: 'pipipi@gmail.com', role: 'admin' },
        { name: 'Pepino', email: 'siempreesverano@gmail.com', role: 'user' },
    ];

    await User.deleteMany();
    await User.insertMany(usersMock);
    const data = await User.find();
    const testIds = [data[0].id, data[1].id];
    return testIds;
};
let ids: Array<string>;

const setCollectionRobot = async () => {
    const robotsMock = [
        {
            name: 'tomatin',
            img: '',
            velocity: 4,
            force: 2,
            date: '2022-3-12',
            owner: ids[0],
        },
    ];

    await Robot.deleteMany();
    await Robot.insertMany(robotsMock);
    const data2 = await Robot.find();
    const testRobotIds = [data2[0].id];
    return testRobotIds;
};

describe('given an "app" with "/robots" route', () => {
    describe('when we connect with mongoDB', () => {
        let token: string;
        let robotIDS: Array<string>;
        beforeEach(async () => {
            await dataBaseConnect();
            ids = await setCollection();
            robotIDS = await setCollectionRobot();
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

        test('then the get to urls /robots should send a 200 status', async () => {
            const response = await request(app).get('/robots');
            expect(response.status).toBe(200);
        });
        test('then the get to urls /robots should send a 200 status, (other version)', async () => {
            await request(app).get('/robots').expect(200);
        });

        test('then the get to urls /robots/:id, if id is bad formed, should send status 404', async () => {
            const response = await request(app).get(
                '/robots/6378d483b738f3e5d87e8685'
            );
            expect(response.status).toBe(404);
        });
        test('then the get to urls /robots/:id, if id is invalid, should send status 503', async () => {
            const response = await request(app).get('/robots/34');
            expect(response.status).toBe(503);
        });
        test('then the post to urls /robots without authorization should send status 403', async () => {
            const response = await request(app)
                .post('/robots/create')
                .send({ name: 'pepebot' });

            expect(response.status).toBe(403);
        });
        test('then the post to urls /robots with authorization should send status 201', async () => {
            const response = await request(app)
                .post('/robots/create')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'armando' });

            expect(response.status).toBe(201);
        });

        test('then the patch to urls /robots/update/:id without authorization should send status 403', async () => {
            const response = await request(app)
                .patch('/robots/update/6378d483b738f3e5d87e8685')
                .send({ name: 'pepebot' });

            expect(response.status).toBe(403);
        });
        test('then the patch to urls /robots/update/:id with authorization should send status 202', async () => {
            const response = await request(app)
                .patch(`/robots/update/${robotIDS[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'pepebot' });
            expect(response.status).toBe(202);
        });
        test('then the delete to urls /robots/delete/:id with authorization should send status 200', async () => {
            const response = await request(app)
                .delete(`/robots/delete/${robotIDS[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'pepebot' });
            expect(response.status).toBe(200);
        });
        test('then the delete to urls /robots/delete/:id without authorization should send status 403', async () => {
            const response = await request(app)
                .delete(`/robots/delete/${robotIDS[0]}`)
                .send({ name: 'pepebot' });
            expect(response.status).toBe(403);
        });
    });
});
describe('given an "app" with "/" route', () => {
    describe('when we connect with mongoDB', () => {
        test('then the get to urls / should send a 200 status', async () => {
            await dataBaseConnect();

            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            await mongoose.disconnect();
        });
    });
});
