import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import session from 'express-session'; 
import authroute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js'; 
import db from './config/db.js'
import propertyroute from './routes/PropertyRoute.js';
import appointmentroute from './routes/appointmentRoute.js';
import adminroute from './routes/adminRoute.js'
import sellerroute from './routes/sellerRoute.js'
import chatroute from './routes/chatRoute.js'
import messageroute from './routes/messageRoute.js'
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 

dotenv.config();

//connecting db
db

const app = express();

const httpServer = createServer(app);

// Socket.IO server
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST","PUT"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    socket.on('joinRoom', (chatId) => {
      socket.join(chatId); 
    });
  
    socket.on('sendMessage', (data) => {
      io.to(data.chatId).emit('newMessage', data);  
    });
    
  });
  
app.use(
    session({
        secret: "JWT_SECRET",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 30 * 60 * 1000 }, // 30 min expiry
    })
);

app.use(
    cors({
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(bodyParser.json());

app.use('/api/auth', authroute);
app.use('/api/user', userRoute);
app.use('/api', propertyroute);
app.use('/api/appointment', appointmentroute);
app.use('/api/admin', adminroute);
app.use('/api/seller', sellerroute);
app.use('/api/chats', chatroute);
app.use('/api/messages', messageroute);

const PORT = 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Serve static files from the 'public' folder
app.use("/public", express.static("public"));




