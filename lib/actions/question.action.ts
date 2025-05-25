"use server"

import { CreateQuestionParams, EditQuestionParams, GetQuestionParams } from "@/types/action";
import { ActionResponse, ErrorResponse, PaginatedSearchParams, Question } from "@/types/global";
import Questions, { IQuestionDoc } from "@/database/question.model";
import action from "../handlers/action";
import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema, PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/errors";
import mongoose, { FilterQuery } from "mongoose";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse<Question> | ErrorResponse> {
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

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<IQuestionDoc> | ErrorResponse> {
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


        // Tag Manipulation
        // Check if tags are the same, if not, update them
        const tagsToAdd = tags.filter(
            (tag) => !question.tags.some((t: ITagDoc)=>t.name.toLowerCase().includes(tag.toLowerCase()))
        )

        const tagsToRemove = question.tags.filter(
            (tag: ITagDoc) => !tags.some((t)=>t.toLowerCase().includes(tag.name.toLowerCase()))
        );

        const newTagDocuments = [];

        if (tagsToAdd.length > 0) {
            for (const tag of tagsToAdd) {
                const existingTag = await Tag.findOneAndUpdate(
                    { name: { $regex: `^${tag}$`, $options: 'i' } },
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
                (tag: mongoose.Types.ObjectId) => !tagIdsToRemove.some((id: mongoose.Types.ObjectId) => id.equals(tag._id))
            );  


        }

        if (newTagDocuments.length > 0) {
            await TagQuestion.insertMany(newTagDocuments, { session });
        }


        await question.save({ session });
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

export async function getQuestion(params: GetQuestionParams): Promise<ActionResponse<Question> | ErrorResponse> {

    const validationResult = await action({ params, schema: GetQuestionSchema, authorize: true });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { questionId } = validationResult.params!;

    try {
        const question = await Questions.findById(questionId).populate("tags");
        
        if(!question) {
            throw new Error("Question not found");
        }

        return { success: true, data: JSON.parse(JSON.stringify(question)) };

    } catch (error) {
        return handleError(error) as ErrorResponse;        
    }

}

export async function getQuestions(params: PaginatedSearchParams): Promise<ActionResponse<{questions: Question[]; isNext: boolean}> | ErrorResponse> {
    const validatedResult = await action({ params, schema: PaginatedSearchParamsSchema, authorize: true });

    if (validatedResult instanceof Error) {
        return handleError(validatedResult) as ErrorResponse;
    }

    const { page = 1, pageSize = 10, query, filter } = validatedResult.params!;
    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;

    const filterQuery: FilterQuery<typeof Questions> = {};

    if(filter === "recommended") {
        return { success: true, data: { questions: [], isNext: false } };
    }

    if(query) {
        filterQuery.$or = [
            { title: { $regex: new RegExp(query, 'i') } },
            { content: { $regex: new RegExp(query, 'i') } },
        ];
    }

    let sortCriteria = {}

    switch (filter) {
        case "latest":
            sortCriteria = { createdAt: -1 };
            break;
        case "most-votes":
            sortCriteria = { upvotes: -1 };
            break;
        case "unanswered":
            filterQuery.answers = 0;
            sortCriteria = { createdAt: -1};
            break;
        default:
            sortCriteria = { createdAt: -1 };
    }

    try {

        const totalQuestions = await Questions.countDocuments(filterQuery);

        const questions = await Questions.find(filterQuery)
            .populate("tags", "name")
            .populate("author", "name image") 
            .lean()
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const isNext = totalQuestions > skip + questions.length;

        return { success: true, data: { questions: JSON.parse(JSON.stringify(questions)), isNext } };


    } catch (error) {
        return handleError(error) as ErrorResponse;
        
    }

}