import React, { useEffect, useState } from "react";
import axios from "axios";

// API base URL
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
      setError("Please provide title & amount");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/expenses`, {
        ...form,
        amount: Number(form.amount),
      });

      setExpenses([res.data, ...expenses]);
      setForm({ title: "", amount: "", category: "General" });
    } catch (err) {
      console.error(err);
      setError("Failed to add expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/expenses/${id}`);
      setExpenses(expenses.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense");
    }
  };

  const total = expenses.reduce((a, b) => a + Number(b.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">💸 Expense Tracker</h1>
          <p className="text-white/80 mt-1 text-sm">
            Track where your money goes — beautifully.
          </p>
        </div>

        {/* TOTAL CARD */}
        <div className="backdrop-blur-xl bg-white/20 p-5 rounded-2xl shadow-lg text-white mb-6 text-center">
          <p className="text-sm tracking-wider opacity-80">Total Spent</p>
          <h2 className="text-4xl font-semibold mt-1">₹{total}</h2>
        </div>

        {/* ADD FORM */}
        <form
          onSubmit={handleAdd}
          className="backdrop-blur-xl bg-white/30 p-5 rounded-2xl shadow-lg mb-6 text-white"
        >
          <h2 className="text-lg font-semibold mb-4">➕ Add New Expense</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              name="title"
              placeholder="Title (e.g., Groceries)"
              value={form.title}
              onChange={handleChange}
              className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-white/60"
            />

            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full sm:w-28 p-3 rounded-lg bg-white/20 text-white placeholder-white/60"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
            <input
              name="category"
              placeholder="Category (Food, Travel...)"
              value={form.category}
              onChange={handleChange}
              className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-white/60"
            />

            <button className="bg-white text-indigo-600 px-5 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition">
              Add Expense
            </button>
          </div>

          {error && <p className="text-red-200 mt-2 text-sm">{error}</p>}
        </form>

        {/* EXPENSE LIST */}
        <div className="backdrop-blur-xl bg-white/20 p-5 rounded-2xl shadow-lg text-white">
          <h2 className="text-lg font-semibold mb-4">📋 Recent Expenses</h2>

          {loading ? (
            <div className="text-center py-6">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-6 text-white/70">No expenses added yet 🤷‍♂️</div>
          ) : (
            <ul className="space-y-4">
              {expenses.map((exp) => (
                <li
                  key={exp._id}
                  className="flex items-center justify-between bg-white/10 p-4 rounded-xl shadow-md"
                >
                  <div>
                    <p className="font-semibold text-white text-lg">{exp.title}</p>
                    <p className="text-sm text-white/70">
                      {exp.category} • {new Date(exp.date).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">₹{exp.amount}</p>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-red-300 hover:text-red-400 text-sm mt-1"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center text-white/70 text-xs mt-6">
          Built with MERN • Advanced UI • Responsive 🌈
        </p>
      </div>
    </div>
  );
}
