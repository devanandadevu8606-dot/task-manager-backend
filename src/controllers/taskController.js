const Task = require('../models/Task');

/**
 * CREATE TASK
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Please provide a task title');
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy: req.user.id   // ✅ FIXED (safe standard)
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL TASKS (USER ONLY)
 */
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET TASK BY ID
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error(`Task not found with id of ${req.params.id}`);
    }

    if (task.createdBy.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this task');
    }

    res.status(200).json({
      success: true,
      data: task
    });

  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404);
      return next(new Error(`Task not found with id of ${req.params.id}`));
    }
    next(error);
  }
};

/**
 * UPDATE TASK
 */
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error(`Task not found with id of ${req.params.id}`);
    }

    if (task.createdBy.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });

  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404);
      return next(new Error(`Task not found with id of ${req.params.id}`));
    }
    next(error);
  }
};

/**
 * DELETE TASK
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error(`Task not found with id of ${req.params.id}`);
    }

    if (task.createdBy.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });

  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404);
      return next(new Error(`Task not found with id of ${req.params.id}`));
    }
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};