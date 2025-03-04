import { z } from "zod";

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export const registerUserValidationSchema = z
  .object({
    firstName: z.string().trim().min(1, { message: "First Name is required" }),
    lastName: z.string().trim().min(1, { message: "Last Name is required" }),
    username: z
      .string()
      .trim()
      .min(1, { message: "Username is required" })
      .min(4, { message: "Username must be at least 4 characters long" }),
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .trim()
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .trim()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: "Confirm Password is required" })
      .min(8, {
        message: "Confirm Password must be at least 8 characters long",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginUserValidationSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: "Username or Email is required" })
    .superRefine((value, ctx) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]+$/.test(value);

      if (!isEmail && !isUsername) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid Username or Email",
        });
      }
    }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const editUserProfileValidationSchema = z.object({
  profilePicture: z
    .union([
      z.string(),
      z.preprocess(
        (file) => (file instanceof File ? file : null),
        z
          .instanceof(File)
          .refine((file) => file.size <= 6 * 1024 * 1024, {
            message: "File size must not exceed 6MB",
          })
          .refine((file) => allowedMimeTypes.includes(file.type), {
            message: "Only JPEG, PNG, and GIF formats are allowed",
          })
      ),
    ])
    .optional(),
  firstName: z.string().trim().min(1, { message: "First Name is required" }),
  lastName: z.string().trim().min(1, { message: "Last Name is required" }),
  username: z.string().trim().min(1, { message: "Username is required" }),
  description: z
    .string()
    .trim()
    .max(150, { message: "Description should be max 150 c3haracters" })
    .refine((value) => !value || value.length >= 5, {
      message: "Description should be at least 5 characters",
    })
    .optional(),
});
