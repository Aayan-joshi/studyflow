interface Question {
    _id: string;
    title: string;
    description: string;
    tags: Tag[];
    author: Author;
    createdAt: Date;
    answers: number;
    views: number;
    upvotes: number;
}

interface Author {
    _id: string;
    name: string;
    image?: string;
}

interface Tag {
    _id: string;
    name: string;
}