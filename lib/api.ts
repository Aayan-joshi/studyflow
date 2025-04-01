import { IUser } from "@/database/user.model";
import { fetchHandler } from "./handlers/fetch";
import { IAccount } from "@/database/account.model";
import {SignInWithOauthParams } from "@/types/action";
import ROUTES from "@/constants/routes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
    users: {
        getAll: () => fetchHandler(`${API_BASE_URL}/users`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
        getByEmail: (email: string) => fetchHandler(`${API_BASE_URL}/users/email/${email}`, {
            method: "POST",
            body: JSON.stringify({ email }),
        }),
        create: (data: Partial<IUser>) => fetchHandler(`${API_BASE_URL}/users`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
        update: (id: string, data: Partial<IUser>) => fetchHandler(`${API_BASE_URL}/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
        delete: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`, {
            method: "DELETE",
        }),
    },
    accounts: {
        getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
        getByProviderUUID: (providerUUID: string) => fetchHandler(`${API_BASE_URL}/accounts`, {
            method: "POST",
            body: JSON.stringify({ providerUUID }),
        }),
        create: (data: Partial<IAccount>) => fetchHandler(`${API_BASE_URL}/accounts`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
        update: (id: string, data: Partial<IAccount>) => fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
        delete: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
            method: "DELETE",
        }),
    },
    auth: {
        oAuthSignIn: ({user, provider, providerUUID}: SignInWithOauthParams) => fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
            method: "POST",
            body: JSON.stringify({ user, provider, providerUUID }),
        }),
    }
    
}