import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statuses = [
  { key: 'todo', label: 'To Do' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'done', label: 'Done' }
];

const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = latest first

const statusColors = {
  todo: '#fca311',
  inprogress: '#219ebc',
  done: '#38b000',
};

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });

  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', config);
      let sorted = [...res.data].sort((a, b) => {
        return sortOrder === 'desc'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
      setTasks(sorted);
    } catch (err) {
      console.error(err);
    }
  };
  

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', form, config);
      setForm({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      alert('Error creating task');
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      console.log(`Updating task ${id} to status ${status}`);
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { status }, config);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sortOrder]);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Project Management Board</h2>

      <form onSubmit={createTask} style={styles.form}>
        <input
          type="text"
          placeholder="Task Title"
          value={form.title}
          required
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Add Task</button>
      </form>
          <div style={styles.headerRow}>
      <div>
        <button
          onClick={() => setSortOrder('desc')}
          style={sortOrder === 'desc' ? styles.activeSort : styles.sortButton}
        >
          Latest First
        </button>
        <button
          onClick={() => setSortOrder('asc')}
          style={sortOrder === 'asc' ? styles.activeSort : styles.sortButton}
        >
          Oldest First
        </button>
      </div>
      <div style={styles.taskCount}>
        Total Tasks: {tasks.length}
      </div>
    </div>


      <div style={styles.board}>
      {statuses.map(({ key, label }) => (
      <div key={key} style={{ ...styles.column, borderTop: `4px solid ${statusColors[key]}` }}>
       <h3 style={{ ...styles.columnTitle, color: statusColors[key] }}>
        {label}
      </h3>

            {tasks
              .filter((task) => task.status === key)
              .map((task) => (
                <div key={task._id} style={styles.taskCard}>
                  <h4 style={styles.taskTitle}>{task.title}</h4>
                  <p>{task.description}</p>
                  <p style={styles.assigned}>👤 {task.assignedTo?.name || 'Unassigned'}</p>
                  <div style={styles.actions}>
                    {statuses
                      .filter((s) => s.key !== task.status)
                      .map((s) => (
                        <button
                          key={s.key}
                          onClick={() => updateStatus(task._id, s.key)}
                          style={{ ...styles.button, background: statusColors[s.key] }}
                        >
                          Move to {` ${s.label}`}
                        </button>
                      ))}
                    <button
                      onClick={() => deleteTask(task._id)}
                      style={{ ...styles.button, background: '#ef233c' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '40px',
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: '30px',
    fontSize: '2.5rem',
  },
  form: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '200px',
    fontSize: '1rem',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  board: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  column: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    width: '300px',
    minHeight: '100px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    transition: '0.3s',
  },
  columnTitle: {
    marginBottom: '15px',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  taskCard: {
    backgroundColor: '#f1f1f1',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    transition: 'transform 0.2s',
  },
  taskTitle: {
    marginBottom: '8px',
    fontWeight: '600',
    fontSize: '1.1rem',
  },
  assigned: {
    fontSize: '0.85rem',
    color: '#555',
    margin: '8px 0',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  button: {
    padding: '6px 12px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};

export default Board;
