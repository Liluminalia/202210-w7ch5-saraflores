import mongoose, { Schema, model } from 'mongoose';
import { ProtoRobot, Robot } from '../entities/robot.js';
import { id } from './data.js';
import { Repo } from './repo.js';

export class RobotRepository implements Repo<Robot> {
    #schema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        img: String,
        velocity: Number,
        force: Number,
        creation: String,
    });
    #Model = model('Robot', this.#schema, 'robots');
    constructor() {
        //
    }

    async getAll(): Promise<Array<Robot>> {
        return this.#Model.find();
    }
    async get(id: id): Promise<Robot> {
        const result = (await this.#Model.findById(id)) as Robot;
        if (!result) throw new Error('Not found id');
        return result as unknown as Promise<Robot>;
    }
    async post(data: ProtoRobot): Promise<Robot> {
        const result = await this.#Model.create(data);
        return result as Robot;
    }
    async patch(id: id, data: Partial<Robot>): Promise<Robot> {
        const result = (await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        })) as Robot;
        if (!result) throw new Error('Not found id');
        return result as unknown as Promise<Robot>;
    }
    async delete(id: id): Promise<{ id: id }> {
        const result = (await this.#Model.findByIdAndDelete(id)) as Robot;
        if (result === null) throw new Error('Not found id');
        return { id: id } as unknown as Promise<Robot>;
    }
    async find(search: any): Promise<Robot> {
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('not found id');
        return result as unknown as Robot;
    }
    disconnect() {
        mongoose.disconnect();
    }
    getModel() {
        return this.#Model;
    }
}
