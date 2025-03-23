import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';

const app = express();

app.use( cors());
app.use(express.json());

sequelize.authenticate()
    .then(() => {
        console.log("Connection established successfully");
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log("Database synchronized successfully");
    })
    .catch((err) => {
        console.error("Database connection/sync error:", err);
    });

export default app;