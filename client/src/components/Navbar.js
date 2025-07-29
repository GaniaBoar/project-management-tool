import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.link}>Kanban Board</Link>
      </div>
      <div style={styles.right}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <button onClick={logout} style={styles.logout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    boxsizing: 'border-box',
    backgroundColor: '#2a9d8f',
    color: '#fff',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    marginRight: '20px',
    fontWeight: '500',
    fontSize: '1rem',
  },
  logout: {
    backgroundColor: '#e76f51',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default Navbar;
