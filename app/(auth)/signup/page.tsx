"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupForm } from "@/lib/schemas/auth";
import { backend_url } from "@/lib/constants";
import { useEffect } from "react";

export default function SignupPage() {
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "VENDOR", sex: "", confirmPassword: "" } as any,
  });

  const role = watch("role");
  const sexValue = useWatch({ control, name: "sex" as any });

  // reset on role change
  useEffect(() => {
    reset({ role, sex: "", confirmPassword: "" } as any);
  }, [role, reset]);

  const onSubmit = async (data: SignupForm) => {
    const { confirmPassword, ...payload } = data;
    await fetch(`${backend_url}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C3C00]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-1/3"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create an Account
        </h2>

        {/* Role toggle */}
        <div className="flex mb-4">
          {( ["VENDOR","BUYER"] as const ).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => reset({ role: r })}
              className={`flex-1 py-2 ${
                role === r ?
                  "border-b-2 border-green-950 font-medium text-green-800" :
                  "text-green-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Conditional fields */}
        {role === "VENDOR" ? (
          <>
            <input {...register("name")} placeholder="Name" />
            {errors.name && <p>{errors.name.message}</p>}

            <select {...register("sex")} defaultValue="">
              <option value="" disabled>Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.sex && <p>{errors.sex.message}</p>}

            <input {...register("phone")} placeholder="Phone" />
            {errors.phone && <p>{errors.phone.message}</p>}
          </>
        ) : (
          <>
            <input {...register("name")} placeholder="Company or Person Name" />
            {errors.name && <p>{errors.name.message}</p>}

            <input {...register("tin")} placeholder="TIN" />
            {errors.tin && <p>{errors.tin.message}</p>}

            <input {...register("phone")} placeholder="Phone" />
            {errors.phone && <p>{errors.phone.message}</p>}
          </>
        )}

        <input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}

        <input {...register("password")} type="password" placeholder="Password" />
        {errors.password && <p>{errors.password.message}</p>}

        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting…" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
