import { Schema } from 'mongoose';
import { Robot } from './robot';

export type ProtoUser = {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    robots?: Array<Robot>; // mal tipado, revisar
};

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    robots?: Array<Robot>; // mal tipado, revisar
};
export const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: String,
    password: String,
    role: String,
});
userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.password;
    },
});
