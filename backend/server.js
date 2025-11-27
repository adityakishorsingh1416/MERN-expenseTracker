import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import expensesRouter from './routes/expenses.js';


dotenv.config();
connectDB();


const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Expense Tracker API is running'));
app.use('/api/expenses', expensesRouter);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));