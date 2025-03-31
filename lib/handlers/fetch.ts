import { ActionResponse } from "@/types/global";
import logger from "../logger";
import handleError from "./errors";
import { RequestError } from "../https-errors";

function isError(error: unknown): error is Error {
    return error instanceof Error;
}

interface FetchOptions extends RequestInit {
    timeout?: number;
}

export async function fetchHandler<T>(url: string, options: FetchOptions ={}): Promise<ActionResponse<T>> {
    const {timeout = 5000, headers: customHeaders = {}, ...restOptions} = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
    const config: RequestInit = {
        ...restOptions,
        headers,
        signal: controller.signal,
    }

    try {
        const response = await fetch(url, config);
        clearTimeout(id);

        if(!response.ok) {
            throw new RequestError(response.status, `HTTP error: ${response.status}`);
        }

        return await response.json() as ActionResponse<T>;


    } catch (error) {
        const newError = isError(error) ? error : new Error("Unknown Error")

        if(newError.name === "AbortError") {
            logger.warn(`Request to ${url} timed out after ${timeout}ms`);
        } else { 
            logger.error(`Error fetching data from ${url}`, newError);
        }

        return handleError(newError) as ActionResponse<T>;
    }
}