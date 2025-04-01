export interface SignInWithOauthParams {
    provider: string;
    providerUUID: string;
    user: {
        name: string;
        username: string;
        email: string;
        image?: string;
    };
}