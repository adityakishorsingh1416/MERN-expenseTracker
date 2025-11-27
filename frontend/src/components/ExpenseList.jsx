import React from 'react';


export default function ExpenseList({ expenses, onDelete }) {
if (!expenses.length) return <p>No expenses yet.</p>;


return (
<ul className="list">
{expenses.map(exp => (
<li key={exp._id} className="item">
<div>
<strong>{exp.title}</strong>
<div>{exp.category} • {new Date(exp.date).toLocaleString()}</div>
</div>
<div>
<span className="amount">₹{exp.amount}</span>
<button onClick={() => onDelete(exp._id)}>Delete</button>
</div>
</li>
))}
</ul>
);
}