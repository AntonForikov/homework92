import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import userRouter from "./routes/user";
import messageRouter from "./routes/message";

const app = express();

expressWs(app);

const port = 8000;
app.use(express.json());

app.use(cors({origin: ['http://localhost:5173']}));
app.use('/users', userRouter);
app.use('/messages', messageRouter);

const run = async () => {
    await mongoose.connect(config.mongoose.db);

    app.listen(port, () => {
        console.log(`Server running on ${port} port.`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

void run();