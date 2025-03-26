import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/errors";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";
import { APIErrorResponse } from "@/types/global";
import { AccountSchema } from "@/lib/validations";
import { ForbiddenError } from "@/lib/https-errors";


export async function GET() {
    try{
        await dbConnect();

        const account = await Account.find({});

        return NextResponse.json({success: true, data: account}, {status: 200});

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();

        const validatedData = AccountSchema.parse(body);

        //Check if user already exists || Email Address Check
        const existingUser = await Account.findOne({provider: validatedData.provider, providerUUID: validatedData.providerUUID});
        if(existingUser) throw new ForbiddenError("An Account with the same Provider already exists");


       
        const newAccount = await Account.create(validatedData);

        return NextResponse.json({success: true, data: newAccount}, {status: 201});

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}