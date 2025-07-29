const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Creating task with:', {
      title: req.body.title,
      description: req.body.description,
      userId: req.user._id,
    });

    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      status: 'To-do',
      createdBy: req.user._id, // Make sure your Task model has this field
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};



// Get tasks for a user
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { status: req.body.status },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
};
