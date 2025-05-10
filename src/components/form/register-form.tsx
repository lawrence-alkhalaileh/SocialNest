"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff, Mail, Facebook } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useState } from "react";

const formSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    username: z.string().min(2, "Username is required"),
    email: z.string().email("Invalid email").min(2, "Email is required"),
    password: z.string().min(2, "Password is required").max(50),
    confirmPassword: z.string().min(2, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/user", {
        username: values.username,
        email: values.email,
        name: values.fullName,
        password: values.password,
      });

      if (response.status === 201) {
        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (res?.ok) {
          router.push("/");
        } else {
          toast.error("Auto login failed. Please sign in manually.");
          router.push("/login");
        }
      } else {
        toast.error("Registration failed. Try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-lg border-0 rounded-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Create an account
                </h1>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="rounded-md h-10"
                  {...register("fullName")}
                  required
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  className="rounded-md h-10"
                  {...register("username")}
                  required
                />
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="rounded-md h-10"
                  {...register("email")}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="rounded-md h-10 pr-10"
                    {...register("password")}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="rounded-md h-10 pr-10"
                    {...register("confirmPassword")}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-md transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400 shadow-sm rounded-full">
                    Or continue with Google
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-md border border-gray-200 hover:bg-gray-50"
                  onClick={() => signIn("google")}
                >
                  <FaGoogle className="text-lg" />
                  <span className="text-sm font-medium">
                    Sign up with Google
                  </span>
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500 mt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden md:block bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="absolute inset-0 bg-opacity-80">
              <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Join our community
                </h3>
                <p className="text-gray-600 max-w-xs">
                  Create an account to unlock all features and become part of
                  our growing community.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-500 px-4">
        By creating an account, you agree to our{" "}
        <a href="#" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
