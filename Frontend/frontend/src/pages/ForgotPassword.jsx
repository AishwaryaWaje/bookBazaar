import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

/**
 * @description ForgotPassword component handles the multi-step process of resetting a user's password.
 * This includes requesting an OTP, verifying the OTP, and setting a new password.
 * @returns {JSX.Element} The ForgotPassword page component.
 */
const ForgotPassword = () => {
  /** @type {string} */
  const [email, setEmail] = useState("");
  /** @type {string} */
  const [otp, setOtp] = useState("");
  /** @type {string} */
  const [newPassword, setNewPassword] = useState("");
  /** @type {string} */
  const [confirmPassword, setConfirmPassword] = useState("");
  /** @type {number} */
  const [step, setStep] = useState(1);
  /** @type {string} */
  const [message, setMessage] = useState("");
  /** @type {string} */
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * @description Handles the request to send an OTP to the user's email for password reset.
   * Transitions to step 2 (OTP verification) on success.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   * @returns {Promise<void>}
   */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${API}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  /**
   * @description Handles the verification of the OTP provided by the user.
   * Transitions to step 3 (new password input) on successful verification.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   * @returns {Promise<void>}
   */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${API}/api/auth/verify-otp`, { email, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP.");
    }
  };

  /**
   * @description Handles the final step of resetting the user's password.
   * Requires new password and confirmation to match. Redirects to login on success.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   * @returns {Promise<void>}
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await axios.post(`${API}/api/auth/reset-password`, { email, newPassword });
      setMessage(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
        {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 cursor-pointer">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="email"
              placeholder="Email (for verification)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-md"
              required
              disabled
            />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 cursor-pointer">
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="email"
              placeholder="Email (for verification)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-md"
              required
              disabled
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 cursor-pointer">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
