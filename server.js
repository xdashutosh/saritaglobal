import express from 'express'
import routes from './routes/server.routes.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { dbConnection } from './controllers/database/db.controller.js';
import cors from 'cors';
dotenv.config()
const app = express();
app.use(cookieParser());
app.use(express.json());
const corsOptions = {
  origin: 'https://saritaglobalfrontend.vercel.app',
  credentials:true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

app.listen(5000, () => {
    console.log("Server listening");
    dbConnection(process.env.MONGO_DB_URI);
})

routes(app)