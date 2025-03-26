import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/errors";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import { APIErrorResponse } from "@/types/global";
import { UserSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/https-errors";


export async function GET() {
    try{
        await dbConnect();

        const user = await User.find({});

        return NextResponse.json({success: true, data: user}, {status: 200});

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();

        const validatedData = UserSchema.safeParse(body);

        if(!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors)
        }

        const {email, username} = validatedData.data;


        //Check if user already exists || Email Address Check
        const existingUser = await User.findOne({email});
        if(existingUser) throw new Error("User already exists");


        //Check if username already exists || UserName Check
        const existingUserName = await User.findOne({username});
        if(existingUserName) throw new Error("Username already exists");

        const newUser = await User.create(validatedData.data);

        return NextResponse.json({success: true, data: newUser}, {status: 201});

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}