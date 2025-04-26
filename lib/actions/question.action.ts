"use server"

import { CreateQuestionParams, EditQuestionParams, GetQuestionParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import Questions from "@/database/question.model";
import action from "../handlers/action";
import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema } from "../validations";
import handleError from "../handlers/errors";
import mongoose from "mongoose";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: AskQuestionSchema, authorize: true });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { title, content, tags } = validationResult.params!;

    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [question] = await Questions.create([{ title, content, author: userId }], { session })

        if (!question) {
            throw new Error("Failed to create question");
        }

        const tagIds: mongoose.Types.ObjectId[] = [];

        const tagQuestionDocuments = []

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate({ name: { $regex: new RegExp(`^${tag}$`, 'i') }, },
                { $setOnInsert: { name: tag }, $inc: { question: 1 } },
                { session, upsert: true, new: true });

            tagIds.push(existingTag!._id);
            tagQuestionDocuments.push({ question: question._id, tag: existingTag!._id });
        }

        await TagQuestion.insertMany(tagQuestionDocuments, { session });

        await Questions.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagIds } } }, { session });

        await session.commitTransaction();

        return { success: true, data: JSON.parse(JSON.stringify(question)) };

    } catch (error) {
        await session.abortTransaction();
        console.log(error)
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }

}

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: EditQuestionSchema, authorize: true });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { title, content, tags, questionId } = validationResult.params!;

    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const question = await Questions.findById(questionId).populate("tags");

        if (!question) {
            throw new Error("Failed to update question");
        }

        if (question.author.toString() !== userId) {
            throw new Error("You are not authorized to edit this question");
        }

        if (question.title !== title || question.content !== content) {
            question.title = title;
            question.content = content;
            await question.save({ session });
        }


        // const tagIds: mongoose.Types.ObjectId[] = [];

        // const tagQuestionDocuments = []

        // for (const tag of tags) {
        //     const existingTag = await Tag.findOneAndUpdate({name: {$regex: new RegExp(`^${tag}$`, 'i')},},
        //     { $setOnInsert: {name: tag}, $inc: {question: 1}},
        //     {session, upsert: true, new: true});

        //     tagIds.push(existingTag!._id);
        //     tagQuestionDocuments.push({question: question._id, tag: existingTag!._id});
        // }

        // await TagQuestion.deleteMany({question: question._id}, {session});
        // await TagQuestion.insertMany(tagQuestionDocuments, {session});

        const tagsToAdd = tags.filter(
            (tag) => !question.tags.includes(tag.toLowerCase())
        )

        const tagsToRemove = question.tags.filter(
            (tag: ITagDoc) => !tags.includes(tag.name.toLowerCase())
        );

        const newTagDocuments = [];

        if (tagsToAdd.length > 0) {
            for (const tag of tagsToAdd) {
                const existingTag = await Tag.findOneAndUpdate(
                    { name: { $regex: new RegExp(`^${tag}$`, 'i') }, },
                    { $setOnInsert: { name: tag }, $inc: { question: 1 } },
                    { session, upsert: true, new: true });

                if(existingTag) {
                    newTagDocuments.push({
                        question: question._id,
                        tag: questionId
                    });

                    question.tags.push(existingTag._id);
                }

                
            }

            await TagQuestion.insertMany(newTagDocuments, { session });
        }

        if (tagsToRemove.length > 0) {
            const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc & { _id: mongoose.Types.ObjectId }) => tag._id); //TODO fix this
            // const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

            await Tag.updateMany(
                { _id: { $in: tagIdsToRemove } },
                { $inc: { question: -1 } },
                { session }
            )

            await TagQuestion.deleteMany(
                { question: question._id, tag: { $in: tagIdsToRemove } },
                { session }
            );

            question.tags = question.tags.filter(
                (tagId: mongoose.Types.ObjectId) => !tagIdsToRemove.includes(tagId)
            );  


        }

        if(newTagDocuments.length > 0) {
            await TagQuestion.insertMany(newTagDocuments, { session });
        }


        await question.save({ session });
        await session.commitTransaction();


        // await Questions.findByIdAndUpdate(question._id, {$push: {tags: { $each: tagIds}}}, {session});

        // await session.commitTransaction();

        return { success: true, data: JSON.parse(JSON.stringify(question)) };

    } catch (error) {
        await session.abortTransaction();
        console.log(error)
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}

export async function getQuestion(params: GetQuestionParams): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: GetQuestionSchema, authorize: true });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { questionId } = validationResult.params!;

    try {
        const question = await Questions.findById(questionId).populate("tags").populate("author", "name username image reputation");
        
        if(!question) {
            throw new Error("Question not found");
        }

        return { success: true, data: JSON.parse(JSON.stringify(question)) };

    } catch (error) {
        return handleError(error) as ErrorResponse;        
    }

}

    