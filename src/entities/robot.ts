import mongoose from 'mongoose';

export type ProtoRobot = {
    name?: string;
    img?: string;
    velocity?: number;
    force?: number;
    creation?: string;
    owner?: typeof mongoose.Types.ObjectId;
};

export type Robot = {
    id: typeof mongoose.Types.ObjectId;
    name: string;
    img: string;
    velocity: number;
    force: number;
    creation: string;
    owner?: typeof mongoose.Types.ObjectId;
};
