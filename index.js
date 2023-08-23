import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import connectDb from './src/configs/db.js';
import router from './src/routes/index.js';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Connect database
connectDb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'uploads')));

// Routes init
app.use('/api/v1', router);

// Socket io
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: process.env.REACT_APP_BASE_URL,
        origin: '*',
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
        io.emit('getUsers', users);
    });

    socket.on('sendNotification', ({ senderId, _id, receiverId, text, linkTask, isRead }) => {
        const assignToUsers = users?.filter((item) => receiverId?.find((it) => it === item?.userId));
        assignToUsers?.map((user) => {
            return io.to(user?.socketId).emit('getNotification', {
                senderId,
                _id,
                text,
                receiverId: user.userId,
                linkTask,
                isRead,
            });
        });
    });

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected!`);
        removeUser(socket.id);
        io.emit('getUsers', users);
    });
});

export const sendNotification = (notiId, notiText, notiReceiverId, notiLinkTask) => {
    const assignToUsers = users?.filter((item) => notiReceiverId?.find((it) => it === item?.userId));
    assignToUsers?.map((user) => {
        return io.to(user?.socketId).emit('getNotification', {
            senderId: '',
            _id: notiId,
            text: notiText,
            receiverId: user.userId,
            linkTask: notiLinkTask,
            isRead: false,
        });
    });
};

server.listen(port, () => {
    console.log('Server is running at ' + port);
});
