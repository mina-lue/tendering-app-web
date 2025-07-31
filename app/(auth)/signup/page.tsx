"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buyerSignupSchema,
  vendorSignupSchema,
  VendorSignup,
  BuyerSignup,
} from "@/lib/schemas/auth";

type FormData = VendorSignup | BuyerSignup;

export default function SignupPage() {
  const [role, setRole] = useState<"vendor" | "buyer">("vendor");

  const schema = role === "vendor" ? vendorSignupSchema : buyerSignupSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // handle response (toast, redirect, etc.)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C3C00]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create an Account
        </h2>

        {/* Role toggle */}
        <div className="flex mb-4">
          {(["vendor", "buyer"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 ${
                role === r
                  ? "border-b-2 border-green-950 font-medium text-green-800 cursor-pointer"
                  : "text-green-900 cursor-pointer"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Common */}
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

        {/* Role-specific */}
        {role === "vendor" ? (
          <>
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="w-full mb-4 p-2
                        border border-gray-300 rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-green-700
                    "
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}

            <input
              type="text"
              placeholder="Phone"
              {...register("phone")}
              className="w-full mb-4 p-2
                        border border-gray-300 rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-green-700
                    "
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone.message}</p>
            )}

            <select
              {...register("sex")}
              className="w-full mb-4 p-2
                        border border-gray-300 rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-green-700
                    "
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.sex && (
              <p className="text-red-600 text-sm">{errors.sex.message}</p>
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Company or Person Name"
              {...register("companyName")}
              className="w-full mb-4 p-2
                        border border-gray-300 rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-green-700
                    "
            />
            {errors.companyName && (
              <p className="text-red-600 text-sm">
                {errors.companyName.message}
              </p>
            )}

            <input
              type="text"
              placeholder="TIN"
              {...register("tin")}
              className="w-full mb-4 p-2
                        border border-gray-300 rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-green-700
                    "
            />
            {errors.tin && (
              <p className="text-red-600 text-sm">{errors.tin.message}</p>
            )}

            <input
              type="text"
              placeholder="Phone"
              {...register("phone")}
              className="w-full mb-4 p-2
                        border border-gray-300 rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-green-700
                    "
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone.message}</p>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-green-800 text-white rounded hover:bg-green-900 transition"
        >
          {isSubmitting ? "Submitting…" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
