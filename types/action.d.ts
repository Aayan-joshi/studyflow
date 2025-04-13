export interface SignInWithOauthParams {
    provider: string;
    providerAccountId: string;
    user: {
        name: string;
        username: string;
        email: string;
        image?: string;
    };
}

export interface AuthCredentials {
    name: string;
    email: string;
    password: string;
    username: string;
}

export interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
}
