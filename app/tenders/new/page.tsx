"use client";

import { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { backend_url } from "@/lib/constants";
import { AiOutlineUpload } from "react-icons/ai";

// Zod schema for tender form (urlToDoc handled manually)
const tenderSchema = z.object({
  details: z.string().min(10, "Details must be at least 10 characters"),
  open_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  close_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  document_buy_option: z.boolean(),
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]),
});

type TenderFormData = z.infer<typeof tenderSchema>;

export default function NewTenderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const methods = useForm<TenderFormData>({
    resolver: zodResolver(tenderSchema),
    defaultValues: { document_buy_option: false, status: "OPEN" },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [urlToDoc, setUrlToDoc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const docOpt = watch("document_buy_option");

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

  const onSubmit = async (data: TenderFormData) => {
    if (!session?.user) {
      alert("You must be logged in to create a tender.");
      return;
    }

    if (data.document_buy_option && !urlToDoc) {
      alert("Please upload a document when Document Buy Option is checked.");
      return;
    }

    const payload: any = {
      organization_id: Number(session.user.id),
      details: data.details,
      open_at: data.open_at,
      close_at: data.close_at,
      document_buy_option: data.document_buy_option,
      status: data.status,
      ...(data.document_buy_option ? { urlToDoc } : {}),
    };

    try {
      const res = await fetch(`${backend_url}/api/tenders/new`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${session.backendTokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create tender");
      router.push("/tenders");
    } catch (error) {
      console.error(error);
      alert("Error creating tender");
    }
  };

  return (
    <FormProvider {...methods}>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0C3C00" }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
        >
          <h1 className="text-2xl font-bold">New Tender</h1>

          {/* Details */}
          <div>
            <label className="block text-sm font-medium">Details</label>
            <textarea
              {...register("details")}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.details && (
              <p className="text-red-500 text-sm">
                {errors.details.message}
              </p>
            )}
          </div>

          {/* Open At */}
          <div>
            <label className="block text-sm font-medium">Open At</label>
            <input
              type="datetime-local"
              {...register("open_at")}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.open_at && (
              <p className="text-red-500 text-sm">
                {errors.open_at.message}
              </p>
            )}
          </div>

          {/* Close At */}
          <div>
            <label className="block text-sm font-medium">Close At</label>
            <input
              type="datetime-local"
              {...register("close_at")}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.close_at && (
              <p className="text-red-500 text-sm">
                {errors.close_at.message}
              </p>
            )}
          </div>

          {/* Document Buy Option & Upload */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" {...register("document_buy_option")} />
            <label className="text-sm">Document Buy Option</label>
          </div>
          {docOpt && (
            <div className="space-y-2">
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
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              {...register("status")}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="DRAFT">Draft</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">
                {errors.status.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full py-2 px-4 bg-green-800 text-white rounded hover:bg-green-900 disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : uploading
              ? "Uploading..."
              : "Create Tender"}
          </button>
        </form>
      </div>
    </FormProvider>
  );
}
