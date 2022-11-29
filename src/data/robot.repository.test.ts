import { dataBaseConnect } from '../data.base.connect.js';
import { RobotRepository } from './robot.repository.js';
const mockData = [
    {
        name: 'froilan',
        img: 'url',
        velocity: 5,
        force: 2,
        date: '2022/5/6',
    },
    {
        name: 'amancio ortega',
        img: 'url',
        velocity: 2,
        force: 6,
        date: '2020/6/24',
    },
];
describe('Given RobotRepository', () => {
    describe('When we instantiate it', () => {
        const repository = RobotRepository.getInstance();
        let testIds: Array<string>;
        beforeAll(async () => {
            await dataBaseConnect();
            await repository.getModel().deleteMany();
            await repository.getModel().insertMany(mockData);
            const data = await repository.getModel().find();
            testIds = [data[0].id, data[1].id];
            console.log(testIds);
        });
        test('Then getAll should have been called', async () => {
            const result = await repository.getAll();
            expect(result[0].name).toEqual(mockData[0].name);
        });
        test('Then get should have been called', async () => {
            const result = await repository.get(testIds[0]);
            expect(result.name).toEqual('froilan');
        });
        test('Then if id is bad formate get should throw an error', async () => {
            expect(async () => {
                await repository.get(testIds[3]);
            }).rejects.toThrow();
        });
        test('Then post should have been called', async () => {
            const newRobot = {
                name: 'jeff bezzos',
                img: 'url',
                velocity: 4,
                force: 3,
                date: '2020/4/13',
            };
            const result = await repository.post(newRobot);
            const newRobot2 = {
                name: 'jeff bezzos',
                img: 'url',
                velocity: 4,
                force: 3,
                date: '2022/7/21',
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
        test('Then if id is bad formate patch should throw an error', async () => {
            expect(async () => {
                await repository.patch(testIds[3], {});
            }).rejects.toThrowError();
        });
        test('Then delete should have been called', async () => {
            const result = await repository.delete(testIds[0]);
            expect(result).toEqual({ id: testIds[0] });
        });
        test('Then if id is not an id delete should throw an error', async () => {
            expect(async () => {
                await repository.delete(23);
            }).rejects.toThrow();
        });
        test('Then if id is bad formate delete should throw an error', async () => {
            expect(async () => {
                await repository.delete('6378d483b738f8e5d87e8285');
            }).rejects.toThrow();
        });
        test('Then if id is bad formate delete should throw an error', async () => {
            expect(async () => {
                await repository.delete(testIds[0]);
            }).rejects.toThrow();
        });
        afterAll(() => {
            repository.disconnect();
        });
    });
});
