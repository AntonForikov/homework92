import {WebSocket} from 'ws';

export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: string;
}

export interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;
export interface ActiveConnections {
    [id: string]: WebSocket
}

export interface IncomingCoordinate {
    type: string;
    payload: Coordinate;
}

type Coordinate = {
    x: number;
    y: number;
    color: string;
}
