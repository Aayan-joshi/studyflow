"use server"

import { CreateQuestionParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import Questions from "@/database/question.model";
import action from "../handlers/action";
import { AskQuestionSchema } from "../validations";
import handleError from "../handlers/errors";
import mongoose  from "mongoose";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: AskQuestionSchema, authorize: true });

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {title, content, tags} = validationResult.params!;

    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [question] = await Questions.create([{title, content, author: userId}], {session})

        if(!question) {
            throw new Error("Failed to create question");
        }

        const tagIds: mongoose.Types.ObjectId[] = [];

        const tagQuestionDocuments = []

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate({name: {$regex: new RegExp(`^${tag}$`, 'i')},},
            { $setOnInsert: {name: tag}, $inc: {question: 1}},
            {session, upsert: true, new: true});

            tagIds.push(existingTag!._id);
            tagQuestionDocuments.push({question: question._id, tag: existingTag!._id});
        }

        await TagQuestion.insertMany(tagQuestionDocuments, {session});

        await Questions.findByIdAndUpdate(question._id, {$push: {tags: { $each: tagIds}}}, {session});

        await session.commitTransaction();

        return {success: true, data:  JSON.parse(JSON.stringify(question))};

    } catch (error) {
        await session.abortTransaction();
        console.log(error)
        return handleError(error) as ErrorResponse; 
    } finally {
        session.endSession();
    }

}