const ROUTES = {
    HOME: '/',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    QUESTION: '/question',
    PROFILE: (id: string) => `/profile/${id}`,
    TAGS: (_id: string) => `/tags/${_id}`,
};

export default ROUTES;