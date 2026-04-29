import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>💰 Expense Tracker</h2>
        <h3 style={styles.subtitle}>Create Account</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSignup}>
          <input style={styles.input} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={styles.button} type="submit">Sign Up</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  box: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px' },
  title: { textAlign: 'center', color: '#2c3e50', marginBottom: '5px' },
  subtitle: { textAlign: 'center', color: '#7f8c8d', marginBottom: '20px' },
  input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', marginBottom: '10px' },
  link: { textAlign: 'center', marginTop: '15px', fontSize: '14px' }
};

export default Signup;