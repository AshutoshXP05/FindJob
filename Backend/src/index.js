import express from 'express';
import "dotenv/config";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/index.js';
import authRoutes from './routes/auth.route.js';
import companyRoutes from './routes/company.route.js';
import jobRoutes from './routes/job.route.js';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


// api
app.use('/api/v1/user', authRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoutes);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        error: err.error || [],
    })
})



connectDB()
.then( () => {
    app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
} )
.catch( (error) => {
    console.error("Database connection failed:", error);
} )



