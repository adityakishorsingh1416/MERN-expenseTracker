import React, { useEffect, useState } from "react";
import axios from "axios";

// Default API base (use VITE_API_URL in your frontend .env to override)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", amount: "", category: "General" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.amount) {
      setError("Please provide title and amount");
      return;
    }

    const payload = { title: form.title.trim(), amount: Number(form.amount), category: form.category };

    try {
      const res = await axios.post(`${API_BASE}/expenses`, payload);
      setExpenses((p) => [res.data, ...p]);
      setForm({ title: "", amount: "", category: "General" });
    } catch (err) {
      console.error(err);
      setError("Failed to add expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/expenses/${id}`);
      setExpenses((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense");
    }
  };

  const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Expense Tracker</h1>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-bold">₹{total}</div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <form onSubmit={handleAdd} className="col-span-1 md:col-span-2 bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="font-medium mb-3">Add Expense</h2>

            <div className="flex gap-2 mb-3">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title (e.g. Groceries)"
                className="flex-1 p-2 border rounded-lg"
              />

              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Amount"
                type="number"
                className="w-28 p-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-2 items-center mb-3">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="flex-1 p-2 border rounded-lg"
              />

              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add</button>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
          </form>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h3 className="font-medium mb-3">Summary</h3>
            <div className="text-sm text-gray-600 mb-2">Expenses: {expenses.length}</div>
            <div className="text-sm text-gray-600">Latest: {expenses[0] ? new Date(expenses[0].date).toLocaleString() : '—'}</div>
          </div>
        </section>

        <section className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-medium mb-4">Expenses</h2>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : !expenses.length ? (
            <div className="text-center text-gray-500 py-8">No expenses yet. Add your first expense.</div>
          ) : (
            <ul className="space-y-3">
              {expenses.map((exp) => (
                <li key={exp._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{exp.title}</div>
                    <div className="text-xs text-gray-500">{exp.category} • {new Date(exp.date).toLocaleString()}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="font-semibold">₹{exp.amount}</div>
                    <button onClick={() => handleDelete(exp._id)} className="text-sm text-red-600">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="text-center text-gray-500 mt-6">Built with MERN • Improve UI / Add charts next 🚀</footer>
      </div>
    </div>
  );
}
