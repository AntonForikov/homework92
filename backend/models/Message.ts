import {model, Schema} from 'mongoose';
import User from "./User";

const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async (id: Schema.Types.ObjectId) => User.findById(id),
            message: 'User does not exist!'
        }
    }
}, {versionKey: false});

const Message = model('Message', messageSchema);

export default Message;