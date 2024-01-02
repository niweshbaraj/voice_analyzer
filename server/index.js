import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import transcriptionsRoutes from './routes/transcriptions.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
})

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));
app.use(cookieParser());

app.use("/api/transcriptions", transcriptionsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log("Server listening on port 3000");
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
     });
});