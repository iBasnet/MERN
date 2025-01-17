import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import authRouter from './route/authRoutes.js';

const app = express();
const port = process.env.PORT || 5172;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API ENDPOINTS
// app.use('/', (req, res) => res.send('API Working!'))
app.use('/api/auth', authRouter);

app.listen(port, () => console.log(`Server is listening on port ${port}`));