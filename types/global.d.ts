import { NextResponse } from "next/server";

interface Question {
    _id: string;
    title: string;
    description: string;
    tags: Tag[];
    author: Author;
    createdAt: Date;
    answers: number;
    views: number;
    upvotes: number;
}

interface Author {
    _id: string;
    name: string;
    image?: string;
}

interface Tag {
    _id: string;
    name: string;
}

type ActionResponse<T= null> ={
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, string[]>;
    }
    status?: number;
}

type SuccessResponse<T> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APISuccessResponse<T> = NextResponse<SuccessResponse<T>>;

interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string | string[]>>;
}