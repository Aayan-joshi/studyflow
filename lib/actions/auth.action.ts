'use server'

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { AuthCredentials } from "@/types/action";
import action from "../handlers/action";
import { SignInSchema, SignUpSchema } from "../validations";
import handleError from "../handlers/errors";
import { ErrorResponse } from "@/types/global";
import User from "@/database/user.model";
import Account from "@/database/account.model";
import { signIn } from "@/auth";
import { NotFoundError } from "../https-errors";

export async function signUpWithCredentials(
    params: AuthCredentials) {
    const validationResult = await action({params, schema: SignUpSchema})

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {name, username, email, password} = validationResult.params!;
    const session = await mongoose.startSession()

    session.startTransaction()

    try {
        const existingUser = await User.findOne({ email }).session(session)
        if (existingUser) {
            throw new Error("User with same email already exists")
        }

        const existingUsername = await User.findOne({ username }).session(session)
        if (existingUsername) {
            throw new Error("User with same username already exists")
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = new User({
            name,
            email,
            username,
        })
        await newUser.save({ session })

        const newAccount = new Account({
            userId: newUser._id,
            name,
            password: hashedPassword,
            provider: "credentials",
            providerAccountId: email,
        })
        await newAccount.save({ session })

        await session.commitTransaction()
        
        await signIn("credentials", {
            email, 
            password,
            redirect: false,
        })
        return {success:true}

       



    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession()
    }
}


export async function signInWithCredentials(
    params: Pick<AuthCredentials, 'email' | 'password'>) {
    const validationResult = await action({params, schema: SignInSchema})


    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {email, password} = validationResult.params!;

    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            throw new NotFoundError("User")
        }

        const existingAccount = await Account.findOne({ provider: "credentials", providerAccountId: email }) || "empty"
        
        if (!existingAccount) {
            throw new NotFoundError("Account")
        }

        

        const isPasswordValid = await bcrypt.compare(password, existingAccount.password)
        if (!isPasswordValid) {
            throw new Error("Invalid password")
        }
        
        await signIn("credentials", {
            email, 
            password,
            redirect: false,
        })
        return {success:true}

       



    } catch (error) {
        return handleError(error) as ErrorResponse;
}}