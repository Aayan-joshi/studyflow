import Account from "@/database/account.model";
import handleError from "@/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/lib/https-errors";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { providerUUID } = await request.json();

    try {
        const validatedData = AccountSchema.partial().safeParse({ providerUUID })

        if (!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors)

        const account = await Account.findOne({ providerUUID });
        if (!account) throw new NotFoundError("Account");

        return NextResponse.json({ success: true, data: account }, { status: 200 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}