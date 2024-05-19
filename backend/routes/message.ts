import express from "express";
import auth, {Auth} from "../middleware/auth";
import Message from "../models/Message";
import {ActiveConnections, IncomingMessage} from "../types";
import expressWs from "express-ws";
import User from "../models/User";

const app = express();
expressWs(app);

const messageRouter = express.Router();

messageRouter.post('/', auth, async (req: Auth, res, next) => {
    try {
        const {text} = req.body;
        if (text === '') return res.status(400).send({error: "You can't create an empty message"});
        if (text[0] === ' ') return res.status(400).send({error: "You can't create message that begins from whitespace"});

        const message = new Message({
            text,
            user: req.user
        });
        await message.save();

        return res.send(message);
    } catch (e) {
        next(e);
    }
});

messageRouter.get('/', auth, async (_, res, next) => {
    try {
        const messages = await Message.find().populate('user', '-token');
        return res.send(messages.slice(-30));
    } catch (e) {
        next(e);
    }
});

const activeConnections: ActiveConnections = {};
let usernames: string[] = [];
messageRouter.ws('/ws',  (ws) => {
    const id = crypto.randomUUID();
    console.log(`client connected! id - ${id}`);
    activeConnections[id] = ws;
    let username: string;

    ws.send(JSON.stringify({type: 'WELCOME', payload: 'Hello you are connected to chat service'}));

    ws.on('message', async (message) => {
        const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;
        if (parsedMessage.type === 'NEW_USER') {
            const user = await User.findOne({token: parsedMessage.token});
            if (!user) return ws.close();

            usernames.push(parsedMessage.payload);
            username = parsedMessage.payload;
            Object.values(activeConnections).forEach((connection) => {
                const outgoingMessage = {type: 'SET_USERNAME', payload: usernames};
                connection.send(JSON.stringify(outgoingMessage));
            })
        }

        if (parsedMessage.type === 'NEW_MESSAGE') {
            Object.values(activeConnections).forEach((connection) => {
                const outgoingMessage = {type: 'NEW_MESSAGE', payload: {username, message: parsedMessage.payload}};
                connection.send(JSON.stringify(outgoingMessage));
            });
        }
    });

    ws.on('close', () => {
        usernames = usernames.filter((user) => user !== username);
        Object.values(activeConnections).forEach((connection) => {
            const outgoingMessage = {type: 'SET_USERNAME', payload: usernames};
            connection.send(JSON.stringify(outgoingMessage));
        });

        console.log(`client disconnected. id - ${id}`);
        delete activeConnections[id];
    });
});

export default messageRouter;