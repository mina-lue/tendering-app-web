
'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, Signin } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SigninPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Signin>({ resolver: zodResolver(signinSchema) });

  const router = useRouter();

  const onSubmit = async (data: Signin) => {
    try {
      setAuthError(null);
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        console.error("Authentication error:", response.error);
        setAuthError("Incorrect email or password.");
      } else if (response?.ok) {
        router.push('/tenders');
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C3C00]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Welcome Back
        </h2>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full mb-4 p-2
                        border border-gray-300 rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-green-700
                    "
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full mb-4 p-2
                        border border-gray-300 rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-green-700
                    "
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-green-800 text-white rounded hover:bg-green-900 transition"
        >
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>

        {authError && (
          <p className="text-red-600 text-sm mt-4 text-center">{authError}</p>
        )}
      </form>
    </div>
  );
}
