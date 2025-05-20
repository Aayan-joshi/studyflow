import { ActionResponse, ErrorResponse, PaginatedSearchParams } from "@/types/global"
import { PaginatedSearchParamsSchema } from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/errors";
import { FilterQuery } from "mongoose";
import { Tag } from "@/database";

export const getTags = async (
    params: PaginatedSearchParams
): Promise<ActionResponse<{tags: typeof Tag[]; isNext: boolean}> | ErrorResponse> => {
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {page = 1, pageSize = 10, query, filter} = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;

    const filterQuery: FilterQuery<typeof Tag> = {};
    
    if (query) {
        filterQuery.$or = [{name: { $regex: query, $options: "i" }}];
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
            sortCriteria = { questions: -1};
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