const express = require('express');
const {
  createTask,
  getUserTasks,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

// POST /api/tasks
router.post('/', createTask);

// GET /api/tasks
router.get('/', getUserTasks);

// PUT /api/tasks/:id
router.put('/:id', updateTaskStatus);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
