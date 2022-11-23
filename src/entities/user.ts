import mongoose, { Schema } from 'mongoose';

export type ProtoUser = {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    robots?: Array<typeof mongoose.Types.ObjectId>;
};

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    robots?: Array<typeof mongoose.Types.ObjectId>;
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
    robots: [
        {
            type: mongoose.Types.ObjectId,
            ref: `robots`,
        },
    ],
});
userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.password;
    },
});
