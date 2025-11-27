import React, { useEffect, useState } from 'react';
import { fetchExpenses, createExpense, removeExpense } from './api';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';


export default function App() {
const [expenses, setExpenses] = useState([]);
const [loading, setLoading] = useState(true);


const loadExpenses = async () => {
try {
const res = await fetchExpenses();
setExpenses(res.data);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
};


useEffect(() => { loadExpenses(); }, []);


const handleAdd = async (data) => {
try {
const res = await createExpense(data);
setExpenses(prev => [res.data, ...prev]);
} catch (err) { console.error(err); }
};


const handleDelete = async (id) => {
try {
await removeExpense(id);
setExpenses(prev => prev.filter(e => e._id !== id));
} catch (err) { console.error(err); }
};


return (
<div className="container">
<h1>Expense Tracker</h1>
<AddExpenseForm onAdd={handleAdd} />
{loading ? <p>Loading...</p> : <ExpenseList expenses={expenses} onDelete={handleDelete} />}
</div>
);
}