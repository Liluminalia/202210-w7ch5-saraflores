import { dataBaseConnect } from './data.base.connect.js';
import mongoose from 'mongoose';
// const spyconnect = jest.spyOn(mongoose.Connection) ---> revisar no me ha dado tiempo a copiarlo bien
describe('given dataBaseConnect', () => {
    describe('when we call it', () => {
        test('then it should get connected to the data base', async () => {
            const result = await dataBaseConnect();
            // expect(spyconnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            mongoose.disconnect();
        });
    });
    describe('when we call it', () => {
        test('then it should get connected to the data base', async () => {
            process.env.NODE_ENV = 'saraData';
            const result = await dataBaseConnect();
            expect(typeof result).toBe(typeof mongoose);
            mongoose.disconnect();
        });
    });
});
