import { useState } from "react";
import { registerUser } from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../components/Notification";

const Register = () => {
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // clear errors while typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
    if (name === "email") {
      setEmailError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // password mismatch check
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const { confirmPassword, ...dataToSubmit } = formData;

    try {
      setLoading(true);
      await registerUser(dataToSubmit);

      setNotifMessage("Registration successful");
      setShowNotif(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const msg =
        "User already registered , Please Login ";

      // email already exists
      if (
        msg.toLowerCase().includes("exist") ||
        msg.toLowerCase().includes("email")
      ) {
        setEmailError("Email already exists");
        return;
      }

      setNotifMessage(msg);
      setShowNotif(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                ${emailError ? "border-red-500" : "border-gray-300"}`}
              onChange={handleChange}
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                ${passwordError ? "border-red-500" : "border-gray-300"}`}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                ${passwordError ? "border-red-500" : "border-gray-300"}`}
              onChange={handleChange}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>

      <Notification
        isVisible={showNotif}
        message={notifMessage}
        onClose={() => setShowNotif(false)}
      />
    </div>
  );
};

export default Register;
