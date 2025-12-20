import { Task } from "../models/task.model.js";
import taskParser from "../service/aiTaskParser.js";

const createTask = async (req, res) => {
  try {
    const { title,status  } = req.body;
    if (!title )
      throw new Error("Title and description are required");
    const ai=await taskParser(title);
    // console.log(ai);

    
    console.log(req.body);
    const newTask = await Task.create({
      title:ai.title,
      description:ai.description || "No description provided",
      status: status || "pending",
      dueDate: ai.dueDate
        ? new Date(ai.dueDate)
        : new Date(Date.now() + 24 * 60 * 60 * 1000),
      assignedTo: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
};

const displayTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ assignedTo: userId });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user._id },
      {
        title,
        description,
        status,
        dueDate,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      assignedTo: req.user._id,
    });

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
};

export { createTask, displayTask, updateTask, deleteTask };
