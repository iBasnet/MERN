import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 5172;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API ENDPOINTS
app.get('/', (req, res) => res.send('API Working!'))
app.use('/api/auth', authRouter);

app.listen(port, () => {
    try {
        connectDB();
        console.log(`Server is listening on port ${port}`);
    }
    catch (error) {
        console.log('Error while starting server: ', error.message);
    }
});