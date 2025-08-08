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

export default function SignupPage() {
  const [role, setRole] = useState<"VENDOR" | "BUYER">("VENDOR");

  // two separate forms
  const vendorForm = useForm<VendorSignup>({
    resolver: zodResolver(vendorSignupSchema),
    defaultValues: { role: "VENDOR", sex: undefined, confirmPassword: "" },
  });
  const buyerForm = useForm<BuyerSignup>({
    resolver: zodResolver(buyerSignupSchema),
    defaultValues: { role: "BUYER", confirmPassword: "" },
  });

  // reset when role changes
  useEffect(() => {
    if (role === "VENDOR") {
      vendorForm.reset({ role, sex: undefined,  confirmPassword: "" });
    } else {
      buyerForm.reset({ role, confirmPassword: "" });
    }
  }, [role]);

  const onSubmit = async (data: VendorSignup | BuyerSignup) => {
    const { confirmPassword, ...payload } = data as any;
    await fetch(`${backend_url}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C3C00]">
      {/* Role toggle */}
      <div className="absolute top-4 left-4">
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
              {r}
            </button>
          ))}
        </div>
      </div>

      {role === "VENDOR" ? (
        <form
          onSubmit={vendorForm.handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Vendor Signup
          </h2>

          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            {...vendorForm.register("name")}
            className="w-full mb-4 p-2 border rounded"
          />
          {vendorForm.formState.errors.name && (
            <p className="text-red-600 text-sm">
              {vendorForm.formState.errors.name.message}
            </p>
          )}

          {/* Sex (with watch for placeholder) */}
          {/** watch sex so placeholder styling works */}
          {(() => {
            const sexVal = useWatch({
              control: vendorForm.control,
              name: "sex",
            });
            return (
              <select
                {...vendorForm.register("sex")}
                defaultValue=""
                className={`w-full mb-4 p-2 border rounded ${
                  sexVal ? "text-gray-800" : "text-gray-500"
                }`}
              >
                <option value="" disabled>
                  Select Sex
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            );
          })()}
          {vendorForm.formState.errors.sex && (
            <p className="text-red-600 text-sm">
              {vendorForm.formState.errors.sex.message}
            </p>
          )}

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone"
            {...vendorForm.register("phone")}
            className="w-full mb-4 p-2 border rounded"
          />
          {vendorForm.formState.errors.phone && (
            <p className="text-red-600 text-sm">
              {vendorForm.formState.errors.phone.message}
            </p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            {...vendorForm.register("email")}
            className="w-full mb-4 p-2 border rounded"
          />
          {vendorForm.formState.errors.email && (
            <p className="text-red-600 text-sm">
              {vendorForm.formState.errors.email.message}
            </p>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            {...vendorForm.register("password")}
            className="w-full mb-4 p-2 border rounded"
          />
          {vendorForm.formState.errors.password && (
            <p className="text-red-600 text-sm">
              {vendorForm.formState.errors.password.message}
            </p>
          )}

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            {...vendorForm.register("confirmPassword")}
            className="w-full mb-4 p-2 border rounded"
          />
          {vendorForm.formState.errors.confirmPassword && (
            <p className="text-red-600 text-sm">
              {vendorForm.formState.errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            disabled={vendorForm.formState.isSubmitting}
            className="w-full py-2 bg-green-800 text-white rounded"
          >
            {vendorForm.formState.isSubmitting
              ? "Submitting…"
              : "Sign Up as Vendor"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={buyerForm.handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Buyer Signup
          </h2>

          {/* Company/Person Name */}
          <input
            type="text"
            placeholder="Company or Person Name"
            {...buyerForm.register("name")}
            className="w-full mb-4 p-2 border rounded"
          />
          {buyerForm.formState.errors.name && (
            <p className="text-red-600 text-sm">
              {buyerForm.formState.errors.name.message}
            </p>
          )}

          {/* TIN */}
          <input
            type="text"
            placeholder="TIN"
            {...buyerForm.register("tin")}
            className="w-full mb-4 p-2 border rounded"
          />
          {buyerForm.formState.errors.tin && (
            <p className="text-red-600 text-sm">
              {buyerForm.formState.errors.tin.message}
            </p>
          )}

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone"
            {...buyerForm.register("phone")}
            className="w-full mb-4 p-2 border rounded"
          />
          {buyerForm.formState.errors.phone && (
            <p className="text-red-600 text-sm">
              {buyerForm.formState.errors.phone.message}
            </p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            {...buyerForm.register("email")}
            className="w-full mb-4 p-2 border rounded"
          />
          {buyerForm.formState.errors.email && (
            <p className="text-red-600 text-sm">
              {buyerForm.formState.errors.email.message}
            </p>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            {...buyerForm.register("password")}
            className="w-full mb-4 p-2 border rounded"
          />
          {buyerForm.formState.errors.password && (
            <p className="text-red-600 text-sm">
              {buyerForm.formState.errors.password.message}
            </p>
          )}

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            {...buyerForm.register("confirmPassword")}
            className="w-full mb-4 p-2 border rounded"
          />
          {buyerForm.formState.errors.confirmPassword && (
            <p className="text-red-600 text-sm">
              {buyerForm.formState.errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            disabled={buyerForm.formState.isSubmitting}
            className="w-full py-2 bg-green-800 text-white rounded"
          >
            {buyerForm.formState.isSubmitting
              ? "Submitting…"
              : "Sign Up as Buyer"}
          </button>
        </form>
      )}
    </div>
  );
}
