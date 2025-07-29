import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '400px',
    margin: '60px auto',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#fff',
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#1e3a8a',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outlineColor: '#1e3a8a',
  },
  button: {
    padding: '12px',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px',
  }
};

export default Login;
