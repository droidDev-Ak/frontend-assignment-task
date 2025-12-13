import { apiRequest } from "./api";

const createTask = (taskData) => apiRequest("tasks", "POST", taskData);

const getTasks = () => apiRequest("tasks", "GET");

const deleteTask = (taskId) => apiRequest(`tasks/${taskId}`, "DELETE");

const updateTask = (taskId, updatedData) =>
  apiRequest(`tasks/${taskId}`, "PATCH", updatedData);

export { createTask, getTasks, deleteTask, updateTask };
