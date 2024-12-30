import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Please enter Password!"),
    code: z.optional(z.string().refine((val) => /^\d{6}$/.test(val), {
        message: "Code must be 6 digits long and contain only numbers"
    })),
});

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).*$/, {
            message: "Password must contain at least one capital letter, one special character, and one number"
        }),
    firstName: z.string().min(1, "Please enter Name!"),
    lastName: z.string(),
});

export const ForgetPasswordSchema = z.object({
    email: z.string().email(),
    password: z
        .optional(
        z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).*$/, {
            message: "Password must contain at least one capital letter, one special character, and one number"
        })),
    code: z.optional(z.string().refine((val) => /^\d{6}$/.test(val), {
        message: "Code must be 6 digits long and contain only numbers"
    })),
})



