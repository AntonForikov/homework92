import {WebSocket} from 'ws';
import {ObjectId} from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: string;
}

export interface UserFromDB extends UserFields {
    _id: ObjectId
}

export interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;
export interface ActiveConnections {
    [id: string]: WebSocket
}

export interface IncomingMessage {
    type: string;
    token: string;
    payload: Coordinate;
}
