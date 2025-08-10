"use client";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buyerSignupSchema,
  vendorSignupSchema,
  VendorSignup,
  BuyerSignup,
} from "@/lib/schemas/auth";
import { backend_url } from "@/lib/constants";

type FormData = VendorSignup | BuyerSignup;

export default function SignupPage() {
  const [role, setRole] = useState<"VENDOR" | "BUYER">("VENDOR");

  const schema = role === "VENDOR" ? vendorSignupSchema : buyerSignupSchema;
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role, sex: "", confirmPassword: "" } as any,
  });

  // reset form (incl. confirmPassword) on role change
  useEffect(() => {
    reset({ role, sex: "", confirmPassword: "" } as any);
  }, [role, reset]);

  // to style <select> placeholder
  const sexValue = useWatch({ control, name: "sex" as any });

  const onSubmit = async (data: FormData) => {
    // strip out confirmPassword before sending
    const { confirmPassword, ...payload } = data as any;
    await fetch(`${backend_url}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-1/3"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create an Account
        </h2>

        {/* Role toggle */}
        <div className="flex mb-4">
          {(["VENDOR", "BUYER"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 ${
                role === r
                  ? "border-b-2 border-green-950 font-medium text-green-800"
                  : "text-green-900"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Role-specific fields */}
        {role === "VENDOR" ? (
          <>
            {/* Name */}
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}

            {/* Sex */}
            <select
              {...register("sex")}
              className={`
                w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700
                ${sexValue ? "text-gray-800" : "text-gray-500"}
              `}
              defaultValue=""
            >
              <option value="" disabled>
                Select Sex
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            { /*errors.sex && (
              <p className="text-red-600 text-sm">{errors.sex.message}</p>
            ) */ }

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone"
              {...register("phone")}
              className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone.message}</p>
            )}
          </>
        ) : (
          <>
            {/* Company/Person Name */}
            <input
              type="text"
              placeholder="Company or Person Name"
              {...register("name")}
              className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.name && (
              <p className="text-red-600 text-sm">
                {errors.name.message}
              </p>
            )}

            {/* TIN */}
            <input
              type="text"
              placeholder="TIN"
              {...register("tin")}
              className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {/* errors.tin && (
              <p className="text-red-600 text-sm">{errors.tin.message}</p>
            ) */}

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone"
              {...register("phone")}
              className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone.message}</p>
            )}
          </>
        )}

        {/* Common Email */}
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-700"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-700"
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-700"
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-green-800 text-white rounded hover:bg-green-900 transition mt-2"
        >
          {isSubmitting ? "Submitting…" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}