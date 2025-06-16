import { ActionResponse, ErrorResponse, PaginatedSearchParams } from "@/types/global"
import { GetTagQuestionsSchema, PaginatedSearchParamsSchema } from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/errors";
import { FilterQuery } from "mongoose";
import { Tag } from "@/database";
import { Question as Questions } from "@/database";
import { GetTagQuestionsParams } from "@/types/action";
import { Question } from "@/types/global";

export const getTags = async (
    params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: typeof Tag[]; isNext: boolean }> | ErrorResponse> => {
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,

    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { page = 1, pageSize = 10, query, filter } = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;

    const filterQuery: FilterQuery<typeof Tag> = {};

    if (query) {
        filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
    }

    let sortCriteria = {};

    switch (filter) {
        case "popular":
            sortCriteria = { upvotes: -1 };
            break;
        case "recent":
            sortCriteria = { createdAt: -1 };
            break;
        case "oldest":
            sortCriteria = { createdAt: 1 };
            break;
        case "alphabetical":
            sortCriteria = { name: 1 };
            break;
        default:
            sortCriteria = { questions: -1 };
    }

    try {
        const totalTags = await Tag.countDocuments(filterQuery);
        const tags = await Tag.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const isNext = totalTags > skip + tags.length;

        return {
            success: true,
            data: {
                tags: JSON.parse(JSON.stringify(tags)),
                isNext,
            },
        }

    } catch (error) {
        return handleError(error) as ErrorResponse;
    }





}
export const getTagQuestions = async (
    params: GetTagQuestionsParams
): Promise<ActionResponse<{ tag: typeof Tag[]; questions: Question[]; isNext: boolean }> | ErrorResponse> => {
    const validationResult = await action({
        params,
        schema: GetTagQuestionsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { tagId, page = 1, pageSize = 10, query} = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;



    try {
        const tag = await Tag.findById(tagId);
        if (!tag) throw new Error("Tag not found");


        const filterQuery: FilterQuery<typeof Questions> = {
            tags: { $in: [tagId]}
        };

        if (query) {
            filterQuery.title = { $regex: query, $options: "i" }
        }


        const totalQuestions= await Questions.countDocuments(filterQuery);
        const questions = await Questions.find(filterQuery)
        .select('_id title views upvotes downvotes answers createdAt author')
        .populate([
            
            
            
            {path: 'author', select: 'name image'},
            {path: 'tags', select: 'name'}
        ])
            .skip(skip)
            .limit(limit);

        const isNext = totalQuestions > skip + questions.length;

        return {
            success: true,
            data: {
                tag: JSON.parse(JSON.stringify(tag)),
                questions: JSON.parse(JSON.stringify(questions)),
                isNext,
            },
        }

    } catch (error) {
        return handleError(error) as ErrorResponse;
    }





}