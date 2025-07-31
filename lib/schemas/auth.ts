import { z } from "zod";

export const baseSignupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be 8+ characters" }),
});

export const vendorSignupSchema = baseSignupSchema.extend({
  role: z.literal("vendor"),
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().min(5, { message: "Phone is required" }),
  sex: z.enum(["male", "female", "other"]),
});

export const buyerSignupSchema = baseSignupSchema.extend({
  role: z.literal("buyer"),
  companyName: z.string().min(1, { message: "Company/Person name required" }),
  tin: z.string().min(5, { message: "TIN is required" }),
  phone: z.string().min(5, { message: "Phone is required" }),
});

export type VendorSignup = z.infer<typeof vendorSignupSchema>;
export type BuyerSignup = z.infer<typeof buyerSignupSchema>;

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type Signin = z.infer<typeof signinSchema>;
