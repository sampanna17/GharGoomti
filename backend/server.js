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
dotenv.config();

//connecting db
db

const app = express();

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

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Serve static files from the 'public' folder
app.use("/public", express.static("public"));


