import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authroute from './routes/authRoute.js';
import db from './config/db.js'

dotenv.config();

//connecting db
db

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authroute);


const PORT = 8000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



