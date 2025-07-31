"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, Signin } from "@/lib/schemas/auth";

export default function SigninPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Signin>({ resolver: zodResolver(signinSchema) });

  const onSubmit = async (data: Signin) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // handle JWT or session cookie, redirect, etc.
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
          className="w-full mb-2 p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full mb-4 p-2 border rounded"
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
      </form>
    </div>
  );
}
