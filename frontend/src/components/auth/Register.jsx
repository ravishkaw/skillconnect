import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthAPI } from "../../hooks";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  role: yup
    .string()
    .oneOf(["client", "freelancer"], "Role is required")
    .required("Role is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuthAPI();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const watchRole = watch("role");

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    if (result.success) {
      navigate("/jobs");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              {...register("name")}
              error={errors.name?.message}
            />

            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              {...register("email")}
              error={errors.email?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="client"
                    type="radio"
                    value="client"
                    {...register("role")}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label
                    htmlFor="client"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Client - I want to hire freelancers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="freelancer"
                    type="radio"
                    value="freelancer"
                    {...register("role")}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label
                    htmlFor="freelancer"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Freelancer - I want to work on projects
                  </label>
                </div>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password"
                {...register("password")}
                error={errors.password?.message}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
