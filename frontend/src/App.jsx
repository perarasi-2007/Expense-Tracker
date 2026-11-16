
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [filter, setFilter] = useState('All');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];

  // Calculate total using all expenses
  const total = allExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount), 0
  );

  // Get all expenses from Java backend
  async function loadAllExpenses() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Could not load expenses.');
      }

      const data = await response.json();
      setAllExpenses(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Get expenses based on selected category
  async function loadVisibleExpenses() {
    try {
      const url = filter === 'All'
        ? API_URL
        : `${API_URL}?category=${encodeURIComponent(filter)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Could not load expenses.');
      }

      const data = await response.json();
      setExpenses(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  // Load expenses when the website opens
  useEffect(() => {
    loadAllExpenses();
  }, []);

  // Reload displayed expenses when category changes
  useEffect(() => {
    loadVisibleExpenses();
  }, [filter]);

  // Refresh data after adding, editing or deleting
  async function refreshExpenses() {
    await loadAllExpenses();
    await loadVisibleExpenses();
  }

  function resetForm() {
    setTitle('');
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setEditId(null);
  }

  // Add or update an expense
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0 || !date) {
      alert('Please enter valid expense details.');
      return;
    }

    const expenseData = {
      title: title.trim(),
      amount: Number(amount),
      category,
      date
    };

    try {
      const url = editId !== null
        ? `${API_URL}/${editId}`
        : API_URL;

      const response = await fetch(url, {
        method: editId !== null ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
      });

      if (!response.ok) {
        throw new Error('Unable to save expense. Please check your details.');
      }

      await refreshExpenses();
      resetForm();
      setError('');
      alert(editId !== null
        ? 'Expense updated successfully!'
        : 'Expense added successfully!');
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  }

  // Fill the form with existing expense details
  function handleEdit(expense) {
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(expense.date);
    setEditId(expense.id);
  }

  // Delete an expense from the database
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Unable to delete expense.');
      }

      await refreshExpenses();

      if (editId === id) {
        resetForm();
      }

      setError('');
      alert('Expense deleted successfully!');
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">₹ Expense Tracker</div>
        <span className="header-label">PERSONAL FINANCE</span>
      </header>

      <main className="container">
        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR FINANCES, SIMPLIFIED</p>
            <h1>Expense Dashboard</h1>
            <p className="subtitle">
              Track your spending and manage your money.
            </p>
          </div>

          <div className="total-card">
            <p>Total Expenses</p>
            <h2>₹{total.toFixed(2)}</h2>
            <span>Across all categories</span>
          </div>
        </section>

        {error && (
          <p role="alert" style={{ color: 'red' }}>{error}</p>
        )}

        <section className="content-grid">
          <div className="panel">
            <h2>{editId !== null ? 'Edit Expense' : 'Add New Expense'}</h2>
            <p className="panel-subtitle">
              Enter your expense details below.
            </p>

            <form onSubmit={handleSubmit}>
              <label>Expense Title</label>
              <input
                type="text"
                placeholder="e.g. Grocery shopping"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />

              <label>Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />

              <label>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {categories.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />

              <button className="submit-btn" type="submit">
                {editId !== null ? 'Update Expense' : '+ Add Expense'}
              </button>

              {editId !== null && (
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="panel expenses-panel">
            <div className="list-heading">
              <div>
                <h2>Recent Expenses</h2>
                <p className="panel-subtitle">Your spending history</p>
              </div>

              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {expenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">₹</div>
                <h3>No expenses yet</h3>
                <p>Add your first expense to see it here.</p>
              </div>
            ) : (
              <div className="expense-list">
                {expenses.map(expense => (
                  <div className="expense-row" key={expense.id}>
                    <div className="expense-info">
                      <strong>{expense.title}</strong>
                      <span>{expense.category} · {expense.date}</span>
                    </div>

                    <div className="expense-actions">
                      <strong>
                        ₹{Number(expense.amount).toFixed(2)}
                      </strong>
                      <button onClick={() => handleEdit(expense)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(expense.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
