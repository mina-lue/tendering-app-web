import { z } from "zod";

// Vendor schema
export const vendorSignupSchema = z.object({
  role: z.literal("VENDOR"),
  name: z.string().min(1, "Name is required"),
  sex: z.enum(["male", "female", "other"]),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 chars"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

// Buyer schema
export const buyerSignupSchema = z.object({
  role: z.literal("BUYER"),
  name: z.string().min(1, "Company or person name is required"),
  tin: z.string().min(1, "TIN is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 chars"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

// Discriminated union
export const signupSchema = z.discriminatedUnion("role", [
  vendorSignupSchema,
  buyerSignupSchema,
]);

export type SignupForm = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type Signin = z.infer<typeof signinSchema>;
