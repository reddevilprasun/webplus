import * as z from "zod";

export const LoginSchema = z.object({
    number: z.string().refine((val) => /^\d{10}$/.test(val), {
        message: "Mobile number must be 10 digits long and contain only numbers",
    }),
    password: z.string().min(1, "Please enter Password!"),
    code: z.optional(z.string().refine((val) => /^\d{6}$/.test(val), {
        message: "Code must be 6 digits long and contain only numbers"
    })),
});

export const RegisterSchema = z.object({
    number: z.string()
        .refine((val) => /^\d{10}$/.test(val), {
            message: "Mobile number must be 10 digits long and contain only numbers",
        }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).*$/, {
            message: "Password must contain at least one capital letter, one special character, and one number"
        }),
    firstName: z.string().min(1, "Please enter Name!"),
    lastName: z.string(),
    userType: z.string(),
    code: z.optional(z.string().refine((val) => /^\d{6}$/.test(val), {
        message: "Code must be 6 digits long and contain only numbers"
    })),
});

export const ForgetPasswordSchema = z.object({
    number: z.string()
        .refine((val) => /^\d{10}$/.test(val), {
            message: "Mobile number must be 10 digits long and contain only numbers",
        }),
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



