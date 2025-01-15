import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongo';

const app = express();
const port = process.env.PORT || 5172;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.use('/', (req, res) => res.send('API Working!'))

app.listen(port, () => console.log(`Server is listening on port ${port}`));