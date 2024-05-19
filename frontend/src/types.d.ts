export interface UserFromDb {
    _id: string;
    username: string;
    token: string;
    role: string;
}

export interface RegisterMutation {
    username: string;
    password: string;
}

export interface LoginMutation {
    email: string;
    password: string;
}

export interface GlobalError {
    error: string;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    },
    message: string;
    name: string;
    _message: string;
}

export interface RegisterResponse {
    user: UserFromDb;
    message: string
}

export interface MessageFromDB {
    _id: string;
    text: string;
    user: {
        _id: string;
        username: string;
        role: string;
    }
}

export interface MessageFromWS {
    username: string;
    message: string;
}