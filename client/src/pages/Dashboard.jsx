import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../services/auth.service.js";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/task.service";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { useAuth } from "../AuthContext.jsx";

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, load } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setTick] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState("all");

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.tasks || []);
      } catch (err) {
        console.error("Failed to load tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => task && task.title)
      .filter((task) => {
        const matchesFilter = filter === "all" || task.status === filter;

        const matchesSearch = task.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
      });
  }, [tasks, searchQuery, filter]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const resetForm = () => {
    setTaskData({ title: "", description: "", status: "pending" });
    setError(null);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskData.title?.trim()) {
      setError("Input is required!");
      return;
    }

    try {
      const res = await createTask({
        ...taskData,
        description: taskData.description?.trim() || "",
        status: "pending",
      });

      if (res?.task) {
        setTasks((prev) => [...prev, res.task]);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task");
    }
  };
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
      };

      const res = await updateTask(editingTaskId, payload);

      setTasks((prev) =>
        prev.map((t) => (t._id === editingTaskId ? res.task : t))
      );
      setEditModalOpen(false);
      setEditingTaskId(null);
      resetForm();
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  const handleDelete = (id) => {
    setTaskToDelete(id);
    setShowConfirm(true);
  };
  const confirmDelete = async () => {
    const id = taskToDelete;
    if (!id) return;

    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((task) => task._id !== id));

    try {
      await deleteTask(id);
    } catch {
      setTasks(previousTasks);
      alert("Failed to delete task");
    } finally {
      setShowConfirm(false);
      setTaskToDelete(null);
    }
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTask(task._id, { status: newStatus });
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, status: task.status } : t
        )
      );
      alert("Failed to update status");
    }
  };

  const openEditModal = (task) => {
    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setEditingTaskId(task._id);
    setEditModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
                TaskManager
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium hidden sm:block">
                {load ? "Loading..." : `Hello, ${user?.name}`}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-800">{tasks.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-orange-500">
              {tasks.filter((t) => t.status === "pending").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-green-500 ">
              {tasks.filter((t) => t.status === "completed").length}
            </p>
          </div>
        </div>

        <div className="flex flex-col  sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <div>
            Filters
            <select
              value={filter}
              onChange={handleFilterChange}
              className="ml-2 p-2 border border-gray-200 rounded-lg"
            >
              <option value="all" defaultChecked>
                All
              </option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add New Task
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading tasks...
          </div>
        ) : filteredTasks.length > 0 || filter.length !== "all" ? (
          <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => {
              const currentTime = new Date();
              const isOverdue =
                task.status !== "completed" &&
                new Date(task.dueDate) < currentTime;
              return (
                <div
                  key={task._id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col h-full "
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold tracking-wide rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {task.status.toUpperCase()}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusToggle(task)}
                        title={
                          task.status === "completed"
                            ? "Mark as Pending"
                            : "Mark as Completed"
                        }
                        className={`transition ${
                          task.status === "completed"
                            ? "text-orange-400  hover:text-orange-600"
                            : "text-green-500 hover:text-green-700"
                        }`}
                      >
                        {task.status === "completed" ? (
                          <svg
                            className="w-5 h-5  "
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(task)}
                        className="text-gray-400 hover:text-blue-500 transition"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 break-words">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 break-words">
                    {task.description || "No description"}
                  </p>
                  <div className="text-xs w-full  flex flex-row justify-between text-gray-400 mt-auto pt-4 border-t border-gray-50">
                    <span className="block">
                      {" "}
                      Created {formatTimeAgo(task.createdAt)}
                    </span>
                    {!isOverdue ? (
                      <span className="block">
                        {" "}
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold tracking-wide rounded-full bg-red-100 text-red-700 border border-red-200">
                        OVERDUE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No tasks found.</p>
            <p className="text-gray-400 text-sm">
              Create a new task to get started!
            </p>
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
        taskData={taskData}
        setTaskData={setTaskData}
        error={error}
        mode="add"
      />

      <TaskModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingTaskId(null);
          resetForm();
        }}
        onSubmit={handleUpdateTask}
        taskData={taskData}
        setTaskData={setTaskData}
        mode="edit"
      />
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete task?"
        message="This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
