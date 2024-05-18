import express from "express";
import auth, {Auth} from "../middleware/auth";
import Message from "../models/Message";

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
        return res.send(messages);
    } catch (e) {
        next(e);
    }
});

export default messageRouter;