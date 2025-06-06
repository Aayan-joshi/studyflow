import { z } from "zod";

export const SignInSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please provide a valid email address." }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long. " })
        .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(30, { message: "Username cannot exceed 30 characters." })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Username can only contain letters, numbers, and underscores.",
        }),

    name: z
        .string()
        .min(1, { message: "Name is required." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .regex(/^[a-zA-Z\s]+$/, {
            message: "Name can only contain letters and spaces.",
        }),

    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Please provide a valid email address." }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(100, { message: "Password cannot exceed 100 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Password must contain at least one special character.",
        }),
});

export const AskQuestionSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Title is required." })
        .max(100, { message: "Title cannot exceed 100 characters." }),

    content: z
        .string()
        .min(1, { message: "Body is required." }),

    tags: z
        .array(z
            .string()
        .min(1, { message: "At least one tag is required." })
        .max(15, { message: "Cannot add more than 30 characters." })
    )
    .min(1, { message: "At least one tag is required." })
    .max(5, { message: "Cannot add more than 5 tags."})
});

// export const AskQuestionSchema = z.object({
//     title: z.string().nonempty("Title is required"),
//     content: z.string().nonempty("Content is required"),
//     tags: z.array(z.string()).max(5, "You can add up to 5 tags")
// });


export const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    username: z.string().min(3, { message: "Username must be atleast 3 characters long" }),
    email: z.string().email("Please provide a valid email address"),
    bio: z.string().optional(),
    image: z.string().url("Please provide a valid URL"),
    location: z.string().optional(),
    portfolio: z.string().url({message: "Please provide a valid URL."}).optional(),
    reputation: z.number().optional(),
});

export const AccountSchema = z.object({
    user: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ObjectId format" }), // Validate MongoDB ObjectId
    name: z.string().min(1, { message: "Name is required" }),
    image: z.string().url("Please provide a valid URL").optional(),
    password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
    }).optional(),
    provider: z.string().min(1, { message: "Provider is required" }),
    providerAccountId: z.string().min(1, { message: "Provider UUID is required" }),
});

export const SignInWithOauthSchema = z.object({
    provider: z.enum(['google', 'github']),
    providerAccountId: z.string().min(1, { message: "Provider UUID is required" }),
    user: z.object({
        name: z.string().min(1, { message: "Name is required" }),
        username: z.string().min(1, { message: "User Name is required" }),
        email: z.string().email("Please provide a valid email address"),
        image: z.string().url("Please provide a valid URL").optional(),
    }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
    questionId: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ObjectId format" }), // Validate MongoDB ObjectId
});

export const GetQuestionSchema = z.object({
    questionId: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ObjectId format" }), // Validate MongoDB ObjectId
});

export const PaginatedSearchParamsSchema = z.object({
    page: z.number().int().positive().default(1).optional(),
    pageSize: z.number().int().positive().default(10).optional(),
    query: z.string().optional(),
    filter: z.string().optional(),
    sort: z.string().optional(),
})

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
    tagId: z.string().min(1, { message: "Tag ID is required" }).regex(/^[a-f\d]{24}$/i, { message: "Invalid ObjectId format" }), // Validate MongoDB ObjectId
});
