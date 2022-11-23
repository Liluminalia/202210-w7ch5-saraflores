import mongoose, { model } from 'mongoose';
import { ProtoRobot, Robot, robotSchema } from '../entities/robot.js';
import { id, Repo } from './repo.js';

export class RobotRepository implements Repo<Robot> {
    #Model = model('Robot', robotSchema, 'robots');

    async getAll(): Promise<Array<Robot>> {
        return this.#Model.find();
    }
    async get(id: id): Promise<Robot> {
        const result = (await this.#Model.findById(id)) as Robot;
        if (!result) {
            throw new Error('Not found id');
        }
        return result;
    }
    async post(data: ProtoRobot): Promise<Robot> {
        data.date = this.#generateDate(data.date as string);
        const result = await this.#Model.create(data);
        return result as Robot;
    }
    async patch(id: id, data: Partial<Robot>): Promise<Robot> {
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) {
            throw new Error('Not found id');
        }
        return result as Robot;
    }
    async delete(id: id): Promise<{ id: id }> {
        const result = (await this.#Model.findByIdAndDelete(id)) as Robot;
        if (result === null) {
            throw new Error('Not found id');
        }
        return { id: id };
    }
    async find(search: {
        [key: string]: string | number | Date;
    }): Promise<Robot> {
        const result = await this.#Model.findOne(search);
        if (!result) {
            throw new Error('not found id');
        }
        return result as unknown as Robot;
    }
    disconnect() {
        mongoose.disconnect();
    }
    #generateDate(date: string | undefined) {
        if (!date) return new Date();
        const validDate =
            new Date(date) === new Date('') ? new Date() : new Date(date);
        return validDate;
    }
    getModel() {
        return this.#Model;
    }
}
