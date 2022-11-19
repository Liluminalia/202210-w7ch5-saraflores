import mongoose from 'mongoose';
import { dataBaseConnect } from '../data.base.connect.js';
import { Robot } from '../entities/robot.js';
import { RobotRepository } from './robot.repository.js';

const mockData = [
    {
        name: 'froilan',
        img: 'url',
        velocity: 5,
        force: 2,
        creation: 'date',
    },
    {
        name: 'amancio ortega',
        img: 'url',
        velocity: 2,
        force: 6,
        creation: 'date',
    },
];
describe('Given RobotRepository', () => {
    describe('When we instantiate it', () => {
        const repository = new RobotRepository();
        let testIds: Array<string>;
        beforeAll(async () => {
            await dataBaseConnect();
            await repository.getModel().deleteMany();
            await repository.getModel().insertMany(mockData);
            const data = (await repository.getModel().find()) as Array<Robot>;
            testIds = [data[0].id, data[1].id];
        });
        test('Then getAll should have been called', async () => {
            const result = await repository.getAll();
            expect(result[0].name).toEqual(mockData[0].name);
        });
        test('Then get should have been called', async () => {
            const result = await repository.get(testIds[0]);
            expect(result.name).toEqual('froilan');
        });
        test('Then if id is bad formated get should throw an error', async () => {
            expect(async () => {
                await repository.get(8);
            }).rejects.toThrowError(mongoose.Error.CastError);
        });
        test('Then post should have been called', async () => {
            const newRobot = {
                name: 'jeff bezzos',
                img: 'url',
                velocity: 4,
                force: 3,
                creation: 'date',
            };
            const result = await repository.post(newRobot);
            const newRobot2 = {
                name: 'jeff bezzos',
                img: 'url',
                velocity: 4,
                force: 3,
                creation: 'date',
                id: result.id,
            };
            expect(result.id).toEqual(newRobot2.id);
        });
        test('Then patch should have been called', async () => {
            const updatedRobot = {
                velocity: 9,
            };
            const result = await repository.patch(testIds[0], updatedRobot);
            expect(result.velocity).toEqual(9);
        });
        test('Then if id is bad formated patch should throw an error', async () => {
            expect(async () => {
                await repository.patch(2, mockData[0]);
            }).rejects.toThrowError(mongoose.Error.CastError);
        });
        test('Then delete should have been called', async () => {
            const result = await repository.delete(testIds[0]);
            expect(result).toEqual({ id: testIds[0] });
        });
        test('Then if id is bad formated delete should throw an error', async () => {
            expect(async () => {
                await repository.delete(34534535);
            }).rejects.toThrowError(mongoose.Error.CastError);
        });
        afterAll(() => {
            repository.disconnect();
        });
    });
});
