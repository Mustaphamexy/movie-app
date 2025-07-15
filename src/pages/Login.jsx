import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { logo } from "../components/Details";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiUser, 
  FiShield,
  FiArrowRight,
  FiAlertCircle
} from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    const result = await login(data);
    if (result.success) {
      navigate("/dashboard"); // Redirect to dashboard after login
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header with icon */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center mb-4">
              <img src={logo} alt="MovieApp Logo" className=" h-14 cursor-pointer" onClick={() => navigate("/")} />
            </div>
            <h1 className="text-3xl font-bold text-lightText mb-2">Welcome Back</h1>
            <p className="text-mutedText flex items-center justify-center gap-1">
              <FiUser className="w-4 h-4" />
              Sign in to your account
            </p>
          </div>

          {/* Error message with icon */}
          {error && (
            <div className="mb-4 p-3 bg-danger/10 text-danger rounded-lg text-sm flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field with icon */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-lightText mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="w-5 h-5 text-mutedText" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-mutedText/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightText transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-danger flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field with icon and toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-lightText mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="w-5 h-5 text-mutedText" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full pl-10 pr-12 py-2 bg-surface border border-mutedText/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightText transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-mutedText hover:text-lightText transition-colors duration-200"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-danger flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-mutedText/30 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-mutedText">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            {/* Enhanced submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-background font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin w-4 h-4" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-mutedText">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;