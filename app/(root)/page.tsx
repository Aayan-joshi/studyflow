import ROUTES from "@/constants/routes";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/Filters/HomeFilter";

const questions = [
    {
        _id: "1",
        title: "How to learn React?",
        description: "I want to learn React, but I don't know where to start. Can someone help me?",
        tags: [
            {
                _id: "1",
                name: "React"
            },
            {
                _id: "2",
                name: "JavaScript"
            }
        ],
        author: {
            _id: "1",
            name: "John Doe"
        },
        upvotes: 10,
        answers: 5,
        views: 100,
        createdAt: new Date(),
    },
    {
        _id: "2",
        title: "How to learn Next.js?",
        description: "I want to learn Next.js, but I don't know where to start. Can someone help me?",
        tags: [
            {
                _id: "1",
                name: "javascript"
            },
        ],
        author: {
            _id: "1",
            name: "John Doe"
        },
        upvotes: 10,
        answers: 5,
        views: 100,
        createdAt: new Date(),
    },
    {
        _id: "3",
        title: "frick",
        description: "I want to learn Next.js, but I don't know where to start. Can someone help me?",
        tags: [
            {
                _id: "1",
                name: "Next.js"
            },
            {
                _id: "2",
                name: "React"
            }
        ],
        author: {
            _id: "1",
            name: "John Doe"
        },
        upvotes: 10,
        answers: 5,
        views: 100,
        createdAt: new Date(),
    }
]

interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>
}

const Home = async ({searchParams}: SearchParams) => {
    const { query = "", filter = "" } = await searchParams;

    const filteredQuestions = questions.filter((question) =>
        question.title.toLowerCase().includes(query?.toLowerCase()) &&
        (filter ? question.tags.some(tag => tag.name.toLowerCase() === filter.toLowerCase()) : true)
    )

    return (

        <>
            <section className={`w-full flex flex-col-reverse sm:flex-row justify-between gap-4 items-center`}>
                <h1 className={`h1-bold text-dark100_light900`}>All Questions</h1>
                <Button className={`primary-gradient min-h-[46px] px-4 py-3 !text-light-900`} asChild>
                    <Link href={ROUTES.QUESTION}>Ask a Question</Link>
                </Button>
            </section>

            <HomeFilter/>

            <section className={`mt-11`}>
                <LocalSearch
                    imgSrc={{src: `/icons/search.svg`, alt: `search`}}
                    placeholder={`Search questions...`}
                    otherClasses={`flex-1`}
                    route={`/`}
                />
            </section>

            Home Filter

            <div className={`mt-10 flex w-full flex-col gap-6`}>
                {
                    filteredQuestions.map((question) => {
                        return (
                           <div key={question._id}>{question.title}</div>
                        )
                    })
                }
            </div>
        </>
    );
}

export default Home;
