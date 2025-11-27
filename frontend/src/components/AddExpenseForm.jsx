import React, { useState } from 'react';


export default function AddExpenseForm({ onAdd }) {
const [title, setTitle] = useState('');
const [amount, setAmount] = useState('');
const [category, setCategory] = useState('General');


const submit = (e) => {
e.preventDefault();
if (!title || !amount) return;
onAdd({ title, amount: Number(amount), category });
setTitle(''); setAmount(''); setCategory('General');
};


return (
<form onSubmit={submit} className="form">
<input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
<input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
<input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
<button type="submit">Add</button>
</form>
);
}