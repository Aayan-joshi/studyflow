import handleError from "@/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/lib/https-errors";
import dbConnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Account")


    try {
        await dbConnect();

        const account = await Account.findById(id)
        if (!account) throw new NotFoundError("Account")

        return NextResponse.json({ success: true, data: account }, { status: 200 });



    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

export async function PUT(req: Request, { params}: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Account")

    try {
        await dbConnect();

        const body = await req.json();
        const validatedData = UserSchema.partial().safeParse(body);
        if (!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors)

        const updatedAccount = await Account.findByIdAndUpdate(id, validatedData.data, { new: true })
        if (!updatedAccount) throw new NotFoundError("Account")

        return NextResponse.json({ success: true, data: updatedAccount }, { status: 200 });

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Account")

    try {
        await dbConnect();

        const account = await Account.findByIdAndDelete(id)
        if (!account) throw new NotFoundError("Account")

        return NextResponse.json({ success: true, data: account }, { status: 200 });

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}