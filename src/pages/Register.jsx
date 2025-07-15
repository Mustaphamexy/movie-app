import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { logo } from "../components/Details";

const RegisterPage = () => {
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    const result = await registerUser(data);
    if (result.success) {
      navigate("/login"); // Redirect to login after successful registration
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center ">
              <img
                src={logo}
                alt="MovieApp Logo"
                className=" h-14 cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>
            <h1 className="text-3xl font-bold text-lightText mb-2">
              Create an account
            </h1>
            <p className="text-mutedText">Get started with our platform</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger/10 text-danger rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-lightText mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-2 bg-surface border border-mutedText/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightText"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-lightText mb-1"
              >
                Email Address
              </label>
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
                className="w-full px-4 py-2 bg-surface border border-mutedText/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightText"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-lightText mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full px-4 py-2 bg-surface border border-mutedText/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightText"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-lightText mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full px-4 py-2 bg-surface border border-mutedText/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightText"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-danger">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
                className="h-4 w-4 text-primary focus:ring-primary border-mutedText/30 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-mutedText"
              >
                I agree to the{" "}
                <a href="#" className="text-primary hover:text-primary/80">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-danger">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-background font-medium rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-background"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-mutedText">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
