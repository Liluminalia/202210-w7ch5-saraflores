import debugCreator from 'debug';
import mongoose, { Types } from 'mongoose';
import { ProtoRobotI, RobotI, Robot } from '../entities/robot.js';
import { id, Repo } from './repo.js';

const debug = debugCreator('W8:repository:robot');
export class RobotRepository implements Repo<RobotI> {
    static instance: RobotRepository;

    public static getInstance(): RobotRepository {
        if (!RobotRepository.instance) {
            RobotRepository.instance = new RobotRepository();
        }
        return RobotRepository.instance;
    }
    #Model = Robot;
    private constructor() {
        debug('instance');
    }
    async getAll(): Promise<Array<RobotI>> {
        return this.#Model.find();
    }
    async get(id: id): Promise<RobotI> {
        const result = await this.#Model
            .findById(id)
            .populate<{ _id: Types.ObjectId }>('owner', {
                robots: 0,
            });
        if (!result) {
            throw new Error('Not found id');
        }
        return result;
    }
    async post(data: ProtoRobotI): Promise<RobotI> {
        data.date = this.#generateDate(data.date as string);
        const result = await this.#Model.create(data);
        return result as RobotI;
    }
    async patch(id: id, data: Partial<RobotI>): Promise<RobotI> {
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) {
            throw new Error('Not found id');
        }
        return result as RobotI;
    }
    async delete(id: id): Promise<{ id: id }> {
        const result = (await this.#Model.findByIdAndDelete(id)) as RobotI;
        if (result === null) {
            throw new Error('Not found id');
        }
        return { id: id };
    }
    async find(search: {
        [key: string]: string | number | Date;
    }): Promise<RobotI> {
        const result = await this.#Model
            .findOne(search)
            .populate('owner', { robots: 0 });
        if (!result) {
            throw new Error('not found id');
        }
        return result as unknown as RobotI;
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
