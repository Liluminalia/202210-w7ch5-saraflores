import { dataBaseConnect } from './data.base.connect.js';
import mongoose from 'mongoose';
describe('given dataBaseConnect', () => {
    describe('when we call it', () => {
        test('then it should get connected to the data base', async () => {
            const result = await dataBaseConnect();
            expect(typeof result).toBe(typeof mongoose);
            mongoose.disconnect();
        });
    });
});
