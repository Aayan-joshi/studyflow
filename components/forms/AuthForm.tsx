"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {DefaultValues, FieldValues, SubmitHandler, useForm, Path} from "react-hook-form"
import {z, ZodType} from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { ActionResponse } from "@/types/global"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import ROUTES from "@/constants/routes"

const LinkClass = "text-primary-500 font-semibold cursor-pointer";

interface AuthFormProps<T extends FieldValues> {
    schema: ZodType<T>,
    defaultValues: T,
    onSubmit: (data: T) => Promise<ActionResponse>,
    formType: "SIGN_IN" | "SIGN_UP",
}

const AuthForm = <T extends FieldValues> (
    {schema, defaultValues, onSubmit, formType}: AuthFormProps<T>
) => {

    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>
    });

    // 2. Define a submit handler.
    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = (await onSubmit(data)) as ActionResponse;

        if(result?.success) {
            toast({
                title: "Success",
                description: formType === "SIGN_IN" 
                ? "Signed in successfully" 
                : "Signed up successfully",
                
            })
            router.push(ROUTES.HOME)
        } else {
            toast({
                title: `Error: ${result?.status}`,
                description: result?.error?.message,
                variant: "destructive"
            })
        }
    }

    const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-10">
                {Object.keys(defaultValues).map((field) => (
                    <FormField
                        key={field}
                        control={form.control}
                        name={field as Path<T>}
                        render={({ field }) => (
                            <FormItem className={`flex w-full flex-col gap-2.5`}>
                                <FormLabel className={`capitalize paragraph-medium text-dark400_light700`}>{field.name === 'email' ? 'Email Address' : field.name}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        required {...field}
                                        type={field.name === 'password' ? 'password': 'text'}
                                        className={`paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border`}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className={`primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900`}
                >
                    {form.formState.isSubmitting ?
                        buttonText === "Sign In" ? "Signing In..." : "Signing Up..."
                        : buttonText
                    }
                </Button>

                {
                    formType === "SIGN_IN" ? (
                        <FormDescription className={`text-dark300_light700 text-center`}>
                            Don&#39;t have an account? <Link href="/sign-up" passHref><span className={LinkClass}>Sign Up</span></Link>
                        </FormDescription>
                    ) : (
                        <FormDescription className={`text-dark300_light700 text-center`}>
                            Already have an account? <Link href="/sign-in" passHref><span className={LinkClass}>Sign In</span></Link>
                        </FormDescription>
                    )
                }
            </form>
        </Form>
    )
}

export default AuthForm;