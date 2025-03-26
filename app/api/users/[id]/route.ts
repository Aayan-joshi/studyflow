import handleError from "@/lib/handlers/errors";
import { NotFoundError } from "@/lib/https-errors";
import dbConnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) throw new NotFoundError("User")


    try {
        await dbConnect();

        const user = await User.findById(id)
        if (!user) throw new NotFoundError("User")

        return NextResponse.json({ success: true, data: user }, { status: 200 });



    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

export async function PUT(req: Request, { params}: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) throw new NotFoundError("User")

    try {
        await dbConnect();

        const body = await req.json();
        const validatedData = UserSchema.partial().parse(body);

        const updatedUser = await User.findByIdAndUpdate(id, validatedData, { new: true })
        if (!updatedUser) throw new NotFoundError("User")

        return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) throw new NotFoundError("User")

    try {
        await dbConnect();

        const user = await User.findByIdAndDelete(id)
        if (!user) throw new NotFoundError("User")

        return NextResponse.json({ success: true, data: user }, { status: 200 });

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}