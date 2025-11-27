import Expense from '../models/Expense.js';


export const getExpenses = async (req, res) => {
try {
const expenses = await Expense.find().sort({ date: -1 });
res.json(expenses);
} catch (err) {
res.status(500).json({ error: 'Failed to fetch expenses' });
}
};


export const addExpense = async (req, res) => {
try {
const { title, amount, category, date } = req.body;
const expense = new Expense({ title, amount, category, date });
await expense.save();
res.status(201).json(expense);
} catch (err) {
res.status(500).json({ error: 'Failed to add expense' });
}
};


export const deleteExpense = async (req, res) => {
try {
const { id } = req.params;
await Expense.findByIdAndDelete(id);
res.status(204).end();
} catch (err) {
res.status(500).json({ error: 'Failed to delete expense' });
}
};