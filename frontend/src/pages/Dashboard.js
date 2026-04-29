import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('https://expense-tracker-backend-ffoj.onrender.com/api/expenses', {
        headers: { Authorization: token }
      });
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://expense-tracker-backend-ffoj.onrender.com/api/expenses', 
        { title, amount, category, date },
        { headers: { Authorization: token } }
      );
      setTitle(''); setAmount(''); setDate('');
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://expense-tracker-backend-ffoj.onrender.com/api/expenses/${id}`, {
        headers: { Authorization: token }
      });
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>💰 Expense Tracker</h2>
        <div>
          <span style={styles.welcome}>Welcome, {user?.name}!</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.totalCard}>
        <h3>Total Expenses: ₹{total}</h3>
      </div>

      <div style={styles.formCard}>
        <h3>Add New Expense</h3>
        <form onSubmit={handleAdd} style={styles.form}>
          <input style={styles.input} type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input style={styles.input} type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} required />
          <select style={styles.input} value={category} onChange={e => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Other</option>
          </select>
          <input style={styles.input} type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <button style={styles.addBtn} type="submit">+ Add Expense</button>
        </form>
      </div>

      <div style={styles.listCard}>
        <h3>My Expenses</h3>
        {expenses.length === 0 ? (
          <p style={styles.noData}>No expenses yet. Add one above!</p>
        ) : (
          expenses.map(exp => (
            <div key={exp._id} style={styles.expenseItem}>
              <div>
                <strong>{exp.title}</strong>
                <span style={styles.category}> [{exp.category}]</span>
                <br />
                <small>{new Date(exp.date).toLocaleDateString()}</small>
              </div>
              <div style={styles.rightSide}>
                <span style={styles.amount}>₹{exp.amount}</span>
                <button style={styles.deleteBtn} onClick={() => handleDelete(exp._id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#2c3e50', color: 'white', padding: '15px 20px', borderRadius: '10px' },
  welcome: { marginRight: '15px', fontSize: '14px' },
  logoutBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
  totalCard: { backgroundColor: '#3498db', color: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' },
  formCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
  addBtn: { padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
  listCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  expenseItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' },
  category: { color: '#7f8c8d', fontSize: '12px' },
  rightSide: { display: 'flex', alignItems: 'center', gap: '10px' },
  amount: { color: '#e74c3c', fontWeight: 'bold', fontSize: '18px' },
  deleteBtn: { backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' },
  noData: { textAlign: 'center', color: '#7f8c8d' }
};

export default Dashboard;