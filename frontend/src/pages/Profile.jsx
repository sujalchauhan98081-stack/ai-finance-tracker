import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user,updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!passwordData.newPassword) newErrors.newPassword = "New password is required";
    else if (passwordData.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (passwordData.newPassword !== passwordData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setSubmitting(true);
    try {
      const response = await api.put("/users/profile", {
        name: formData.name,
        email: formData.email,
      });

      // Update formData with the response from server
      setFormData({
        name: response.data.data.name,
        email: response.data.data.email,
      });

      // Update AuthContext so navbar updates too
      updateUser(response.data.data);

      

      toast.success("Profile updated successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setPasswordSubmitting(true);
    try {
      await api.put("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Clear all password fields and errors after successful update
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear any previous errors
      setPasswordErrors({});

      toast.success("Password changed successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to change password";
      toast.error(message);
    } finally {
      setPasswordSubmitting(false);
    }
  };
  return (
    <div className="w-full mx-auto space-y-6 max-w-2xl">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Profile Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account information and security
        </p>
      </div>

      {/* Profile Update Form */}
      <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Account Information
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.name ? "border-red-400" : "border-gray-200 dark:border-gray-700"
              }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.email ? "border-red-400" : "border-gray-200 dark:border-gray-700"
              }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 transition-colors"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handleChangePassword} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Change Password
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className={`w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${passwordErrors.currentPassword ? "border-red-400" : "border-gray-200 dark:border-gray-700"
              }`}
          />
          {passwordErrors.currentPassword && (
            <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className={`w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${passwordErrors.newPassword ? "border-red-400" : "border-gray-200 dark:border-gray-700"
              }`}
          />
          {passwordErrors.newPassword && (
            <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className={`w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${passwordErrors.confirmPassword ? "border-red-400" : "border-gray-200 dark:border-gray-700"
              }`}
          />
          {passwordErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={passwordSubmitting}
          className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 transition-colors"
        >
          {passwordSubmitting ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default Profile;