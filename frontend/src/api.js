import axios from 'axios';


const API = axios.create({
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
});


export const fetchExpenses = () => API.get('/expenses');
export const createExpense = (expense) => API.post('/expenses', expense);
export const removeExpense = (id) => API.delete(`/expenses/${id}`);