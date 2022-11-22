import { model } from 'mongoose';
import { User, userSchema } from '../entities/user.js';
import { passwordEncrypt } from '../services/auth.js';
import { BasicRepo, id } from './repo.js';

export class UserRepository implements BasicRepo<User> {
    #Model = model('User', userSchema, 'users');
    async get(id: id): Promise<User> {
        const result = (await this.#Model.findById(id)) as User;
        if (!result) throw new Error('not found id');
        return result;
    }
    async post(data: Partial<User>): Promise<User> {
        if (typeof data.password !== 'string') {
            throw new Error('');
        }
        data.password = await passwordEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result as unknown as User;
    }
    async find(search: any): Promise<User> {
        const result = (await this.#Model.findOne(search)) as User;
        if (!result) throw new Error('not found id');
        return result;
    }
}
