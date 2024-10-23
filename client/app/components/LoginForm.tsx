"use client";

import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { signinSchema } from "../common/validationSchema";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/style.css";
import Loader from "../common/Loader";

const LoginForm = () => {
  const router = useRouter();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    isAdmin: false,
  });
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedMessage, setConfirmedMessage] = useState(false);

  const handleCancel = () => {
    setConfirmedMessage(false);
  };

  const handleRememberMe = () => {
    setFormData({ ...formData, rememberMe: !formData.rememberMe });
  };

  useEffect(() => {
    const emailConfirmedParam = new URLSearchParams(window.location.search).get(
      "emailConfirmed"
    );
    if (emailConfirmedParam) {
      toast.success(
        "Your email has been confirmed successfully! Please log in."
      );
      setTimeout(() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 500);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const handleResend = async () => {
    try {
      const parsedData = signinSchema.parse(formData);
      const email = parsedData.email;

      const response = await axios.post(
        "http://localhost:3001/email-confirmation/resend-confirmation-link",
        { email: email },

        {
          withCredentials: true,
        }
      );

      toast.success("Confirmation link resent!");
    } catch (error) {
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message || "An error occurred");
      }
    }
    setConfirmedMessage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Show loading indicator

    try {
      const parsedData = signinSchema.parse(formData);

      const response = await axios.post(
        "http://localhost:3001/auth/login",
        parsedData,
        {
          withCredentials: true,
        }
      );

      if (formData.rememberMe) {
        alert("Remember me is checked");
      }
      toast.success("Logged in successfully!");

      setTimeout(() => {
        if (response.status === 201) {
          router.push("/pages/user");
        }
      }, 1000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(err)) {
        if (
          err.response?.data.message === "Please confirm your email to Login"
        ) {
          setConfirmedMessage(true);
        } else {
          toast.error(
            err.response?.data.message || "An unexpected error occurred."
          );
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      exit={{ opacity: 0 }}
      className="container border-none max-w-fit h-auto flex justify-center items-center p-8 border-2 bg-white rounded-lg shadow-lg m-10"
    >
       <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute w-full h-full flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmedMessage && (
          <div
            className="absolute w-full h-full flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(0, 172, 205, 0.25)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h3 className="mb-5 text-lg font-semibold text-gray-700">
                Confirm your email first to login please.
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={handleResend}
                  className="px-4 py-2 bg-[#37a5bb] text-white rounded hover:bg-[#24869a] transition-colors"
                >
                  Resend
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div>
        <div>
          <div className="max-w-fit mb-8">
            <Link href="/">
              <Image
                src="/moneymaster.png"
                width={150}
                height={150}
                alt="Money Master Logo"
              />
            </Link>
          </div>
          <h1 className="text-2xl font-black text-[#22577A] mb-6">Sign In</h1>
          <p className="max-w-[450px] mb-10 text-[#6C7278]">
            Fill your information below or signin using your social account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-md font-medium text-gray-900"
            >
              Email <span className="text-red">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`shadow-sm bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10 transition-all duration-300 focus:ring-2 focus:ring-[#37a5bb] ${
                errors.email ? "border-2 border-red" : "border border-gray"
              }`}
              placeholder="Enter email"
              required
            />
            <div className="min-h-[24px] mt-1">
              {errors.email && (
                <p className="text-red text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-md font-medium"
            >
              Password <span className="text-red">*</span>
            </label>
            <div className="relative">
              <input
                type={type}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`shadow-sm bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10 transition-all duration-300 focus:ring-2 focus:ring-[#37a5bb] ${
                  errors.password ? "border-2 border-red" : "border border-gray"
                }`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray focus:outline-none"
                onClick={handleToggle}
              >
                <Icon
                  className={icon === eye ? "text-[#00ABCD]" : ""}
                  icon={icon}
                  size={20}
                />
              </button>
            </div>

            <div className="min-h-[24px] mt-1">
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-around mb-6">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="custom-checkbox h-4 w-4 text-[#37a5bb] focus:ring-[#37a5bb] border-gray-300 rounded"
                checked={formData.rememberMe}
                onChange={handleRememberMe}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="/pages/forgotpassword"
                className="font-medium text-[#37a5bb] hover:text-[#37a5bb] hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <motion.button
            whileTap="tap"
            whileHover="hover"
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center text-white bg-[#00ABCD] hover:bg-[#37a5bb] focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold text-md px-5 py-2.5 text-center rounded-full transition-all duration-300 mb-6"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
                aria-labelledby="loadingTitle"
              >
                <title id="loadingTitle">Loading...</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Sign In"
            )}
          </motion.button>

          <div className="w-full flex justify-around items-center mt-6 mb-6">
            <div className="w-1/3 h-0.5 bg-[#D9D9D9]"></div>
            <div className="">
              <p className="text-center w-fit text-[#b7b7b7] text-md">
                or Sign In with
              </p>
            </div>
            <div className="w-1/3 h-0.5 bg-[#D9D9D9]"></div>
          </div>

          <div>
            <GoogleLoginButton />
          </div>

          <label className="text-center">
            <p className="mt-6">
              Don’t have an account?{" "}
              <span className="text-[#00ABCD] font-black hover:underline">
                <Link href={"/pages/signup"}>Sign Up</Link>
              </span>
            </p>
          </label>
        </form>
      </div>
      <div className="welcome-img hidden lg:block ml-10">
        <Image
          width={500}
          height={500}
          src="/images/login.png"
          alt="Login illustration"
          className="object-cover rounded-[20px] shadow-md"
        />
      </div>
 
    </motion.div>
  );
};

export default LoginForm;
