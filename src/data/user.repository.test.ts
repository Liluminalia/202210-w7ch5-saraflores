import mongoose from 'mongoose';
import { dataBaseConnect } from '../data.base.connect.js';
import { UserRepository } from './user.repository.js';

describe('Given UserRepository', () => {
    const mockData = [
        {
            name: 'Pepe',
            email: 'pepe@gmail.com',
            password: 'pepe1234',
            role: 'Admin',
        },
        {
            name: 'Ernesto',
            email: 'ernest@gmail.com',
            password: '789ErnesT',
            role: 'Empleado',
        },
    ];
    const repository = new UserRepository();
    let testIds: Array<string>;
    beforeAll(async () => {
        await dataBaseConnect();
        await repository.getUserModel().deleteMany();
        await repository.getUserModel().insertMany(mockData);
        const data = await repository.getUserModel().find();
        testIds = [data[0].id, data[1].id];
    });
    afterAll(async () => {
        mongoose.disconnect();
    });

    test('Then get should return an user', async () => {
        const result = await repository.get(testIds[0]);
        expect(result.name).toEqual(mockData[0].name);
    });

    test('when get it receives an invalid id it should return an error', async () => {
        expect(async () => {
            await repository.get(testIds[4]);
        }).rejects.toThrowError();
    });
    test('Then ...', async () => {
        const newUser = {
            name: 'tarantino',
            password: 'asd123',
            email: 'killbill@gmail.com',
            role: 'admin',
        };
        const result = await repository.post(newUser);
        expect(result.name).toBe('tarantino');
    });
    test('when post it receives an invalid id it should return an error', async () => {
        expect(async () => {
            await repository.post({ password: testIds[3] });
        }).rejects.toThrowError();
    });
});
