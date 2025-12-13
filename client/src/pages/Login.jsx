import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import Notification from "../components/Notification";

const Login = () => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [error, setError] = useState("");  

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);

      if (!res) {
        setError("Wrong password or email");  
        return;
      }

      setShowNotif(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Wrong password or email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none
                ${error ? "border-red-500" : "border-gray-300"}`}
              onChange={handleChange}
              required
            />


            {error && (
              <p className="text-red-500 text-sm mt-1">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>

      <Notification
        isVisible={showNotif}
        message="Login successful"
        onClose={() => setShowNotif(false)}
      />
    </div>
  );
};

export default Login;
