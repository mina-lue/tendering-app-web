"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { backend_url } from "@/lib/constants";

// Zod schema for tender form
const tenderSchema = z.object({
  details: z.string().min(10, "Details must be at least 10 characters"),
  open_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  close_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  document_buy_option: z.boolean(),
  status: z.enum(["OPEN", "DOWN", "YET"]),
});

type TenderFormData = z.infer<typeof tenderSchema>;

export default function NewTenderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TenderFormData>({
    resolver: zodResolver(tenderSchema),
  });

  const onSubmit = async (data: TenderFormData) => {
    if (!session?.user) {
      alert("You must be logged in to create a tender.");
      return;
    }

    const payload = {
      organization_id: Number((session.user.id)),
      details: data.details,
      open_at: data.open_at,
      close_at: data.close_at,
      document_buy_option: data.document_buy_option,
      status: data.status,
    };

    try {
      const res = await fetch(`${backend_url}/api/tenders/new`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${session?.backendTokens.accessToken}`,
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0C3C00' }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold">New Tender</h1>

        <div>
          <label className="block text-sm font-medium">Details</label>
          <textarea
            {...register("details")}
            className="mt-1 block w-full border rounded p-2"
          />
          {errors.details && <p className="text-red-500 text-sm">{errors.details.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Open At</label>
          <input
            type="datetime-local"
            {...register("open_at")}
            className="mt-1 block w-full border rounded p-2"
          />
          {errors.open_at && <p className="text-red-500 text-sm">{errors.open_at.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Close At</label>
          <input
            type="datetime-local"
            {...register("close_at")}
            className="mt-1 block w-full border rounded p-2"
          />
          {errors.close_at && <p className="text-red-500 text-sm">{errors.close_at.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register("document_buy_option")} />
          <label className="text-sm">Document Buy Option</label>
        </div>
        {errors.document_buy_option && <p className="text-red-500 text-sm">{errors.document_buy_option.message}</p>}

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="mt-1 block w-full border rounded p-2"
          >
            <option value="OPEN">Open</option>
            <option value="DOWN">Down</option>
            <option value="YET">YET</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-green-800 text-white rounded hover:bg-green-900 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Create Tender"}
        </button>
      </form>
    </div>
  );
}
