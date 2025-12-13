const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  taskData,
  setTaskData,
  mode = "add",
  error,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {mode === "edit" ? "Edit Task" : "Create Task"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "edit"
                ? "Update task details "
                : "Add a new task to your workflow"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center 
             w-8 h-8 
             text-gray-400 
             hover:text-gray-600 
             hover:bg-red-500/50 
             rounded-full 
             transition-all duration-200
             "
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              placeholder="e.g. Finish dashboard UI"
              className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              placeholder="Optional details about the task…"
              rows={3}
              className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {error && <p className="text-xs text-red-500 mt-1"> Description and Title are required  </p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 ">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-sm font-medium text-white transition
                ${
                  mode === "edit"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {mode === "edit" ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
