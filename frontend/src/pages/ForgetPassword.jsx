import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [conpassword, setConPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // for step1
  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + "/api/auth/sendotp",
        { email },
        { withCredentials: true }
      );
      console.log(result.data);
      setStep(2);
      toast.success(result.data.message);
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      setLoading(false);
    }
  };

  // step 2

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + "/api/auth/verifyotp",
        { email, otp },
        { withCredentials: true }
      );
      console.log(result);
      setStep(3);
      setLoading(false);
      toast.success(result.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      setLoading(false);
    }
  };

  // step 3
  const resetPassword = async () => {
    setLoading(true);
    try {
      if (newpassword !== conpassword)
        return toast.error("Password doesn't match!");
      const result = await axios.post(
        BASE_URL + "/api/auth/resetpassword",
        { email, password: newpassword },
        { withCredentials: true }
      );
      console.log(result);

      setLoading(false);
      navigate("/login");
      toast.success(result.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      {/* {step 1} */}
      {step === 1 && (
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Forget Your Password
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                Enter your email address
              </label>
              <input
                required
                id="email"
                type="text"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-black hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer"
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"}
            </button>
          </form>
          <div
            onClick={() => navigate("/login")}
            className="text-sm text-center mt-4 cursor-pointer"
          >
            Back to Login
          </div>
        </div>
      )}
      {/* {step 2} */}
      {step === 2 && (
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Enter OTP
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                Please enter the 4-digit code sent to your email
              </label>
              <input
                required
                id="otp"
                type="text"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]"
                placeholder="* * * *"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>
            <button
              disabled={loading}
              onClick={verifyOtp}
              className="w-full bg-black hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer"
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Verify OTP"}
            </button>
          </form>
          <div
            onClick={() => navigate("/login")}
            className="text-sm text-center mt-4 cursor-pointer"
          >
            Back to Login
          </div>
        </div>
      )}
      {/* {step 3} */}
      {step === 3 && (
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6 ">
            Enter a new password below to regain acess to your account
          </p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                New Password
              </label>
              <input
                required
                id="password"
                type="text"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]"
                placeholder="**************"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newpassword}
              />
            </div>
            <div>
              <label
                htmlFor="conpassword"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                Confirm Password
              </label>
              <input
                required
                id="conpassword"
                type="text"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]"
                placeholder="**************"
                onChange={(e) => setConPassword(e.target.value)}
                value={conpassword}
              />
            </div>
            <button
              onClick={resetPassword}
              className="w-full bg-black hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer"
            >
              {loading ? (
                <ClipLoader size={30} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
          <div
            onClick={() => navigate("/login")}
            className="text-sm text-center mt-4 cursor-pointer"
          >
            Back to Login
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
