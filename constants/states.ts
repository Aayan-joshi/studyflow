import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
    title: "No Data Found",
    message: "Looks like the database is taking a break. Bring it back to life by adding some data!",
    button: {
        text: "Add Data",
        href: ROUTES.HOME,
    }
}

export const DEFAULT_ERROR = {
    title: "Oops! Something went wrong.",
    message: "Even the best of us make mistakes. Please try again later.",
    button: {
        text: "Try Again",
        href: ROUTES.HOME,
    }
}

export const EMPTY_QUESTION = {
    title: "Ahh! No Questions Yet.",
    message: "The question bank is empty. Add some questions to get started.",
    button: {
        text: "Ask a Question",
        href: ROUTES.ASK_QUESTION,
    }
}

export const EMPTY_TAGS = {
    title: "No Tags Found",
    message: "The tag cloud is empty. Add some keywords to make it rain.",
    button: {
        text: "Create Tag",
        href: ROUTES.TAGS,
    },
};

export const EMPTY_COLLECTIONS = {
    title: "Collections Are Empty",
    message:
        "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
    button: {
        text: "Save to Collection",
        href: ROUTES.COLLECTION,
    },
};
