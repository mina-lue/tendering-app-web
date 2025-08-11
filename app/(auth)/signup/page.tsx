"use client";
import { useState, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buyerSignupSchema,
  vendorSignupSchema,
  VendorSignup,
  BuyerSignup,
} from "@/lib/schemas/auth";
import { backend_url } from "@/lib/constants";
import { AiOutlineUpload } from "react-icons/ai";
import { useRouter } from "next/navigation";

type FormData = VendorSignup | BuyerSignup;

export default function SignupPage() {
  const [role, setRole] = useState<"VENDOR" | "BUYER" | "ADMIN">("VENDOR");
  const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [urlToDoc, setUrlToDoc] = useState<string>('');
    const [uploading, setUploading] = useState(false);


    const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUrlToDoc(data.secure_url);
    } catch (err) {
      console.error(err);
      alert("Error uploading document");
    } finally {
      setUploading(false);
    }
  };

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

    const updatePayload = {...payload, urlToDoc};

    const res = await fetch(`${backend_url}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });

    if(res.status !== 201){
      throw new Error('Error creating user.')
    }
    router.push('/signin')
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
            <div className="space-y-2 mb-3 text-green-950 ">
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                          <button
                            type="button"
                            onClick={handleFileClick}
                            className="flex items-center space-x-2 border rounded p-2 hover:bg-gray-100"
                          >
                            <AiOutlineUpload size={20} />
                            <span>
                              {uploading
                                ? "Uploading..."
                                : urlToDoc
                                ? "Change Document"
                                : "Upload Document"}
                            </span>
                          </button>
                          {fileName && (
                             <p className="text-sm text-gray-800">Selected file: <strong>{fileName}</strong></p>
                          )}
                        </div>
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