const Notification = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-5 right-5 z-50 w-72 bg-white shadow-lg rounded-lg overflow-hidden border">
      <div className="p-4">
        <p className="text-sm font-semibold text-green-600">
          {message}
        </p>
      </div>

      <div className="h-1 bg-gray-200">
        <div className="h-full bg-green-500 animate-progress"></div>
      </div>
    </div>
  );
};

export default Notification;
