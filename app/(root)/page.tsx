import ROUTES from "@/constants/routes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/Filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTION } from "@/constants/states";


// const questions: Question[] = [
//     {
//         _id: "1",
//         title: "How to learn React?",
//         description: "I want to learn React, but I don't know where to start. Can someone help me?",
//         tags: [
//             {
//                 _id: "1",
//                 name: "React"
//             },
//             {
//                 _id: "2",
//                 name: "JavaScript"
//             }
//         ],
//         author: {
//             _id: "1",
//             name: "John Doe",
//             image: "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
//         },
//         upvotes: 10,
//         answers: 5,
//         views: 100,
//         createdAt: new Date("2021-09-01"),
//     },
//     {
//         _id: "2",
//         title: "How to learn Next.js?",
//         description: "I want to learn Next.js, but I don't know where to start. Can someone help me?",
//         tags: [
//             {
//                 _id: "1",
//                 name: "javascript"
//             },
//         ],
//         author: {
//             _id: "1",
//             name: "John Doe",
//             image: "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
//         },
//         upvotes: 10,
//         answers: 5,
//         views: 100,
//         createdAt: new Date("2021-09-01"),
//     },
//     {
//         _id: "3",
//         title: "frick",
//         description: "I want to learn Next.js, but I don't know where to start. Can someone help me?",
//         tags: [
//             {
//                 _id: "1",
//                 name: "Next.js"
//             },
//             {
//                 _id: "2",
//                 name: "React"
//             }
//         ],
//         author: {
//             _id: "1",
//             name: "John Doe",
//             image: "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
//         },
//         upvotes: 10,
//         answers: 5,
//         views: 100,
//         createdAt: new Date("2021-09-01"),
//     }
// ]

// const test = async () => {
//     try {
//         return await api.users.getAll()
//     } catch (error) {
//         return handleError(error, "api")
//     }
// }

interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>
}

const Home = async ({ searchParams }: SearchParams) => {

    const { page, pageSize, query, filter } = await searchParams

    const { success, data, error } = await getQuestions({ page: Number(page) || 1, pageSize: Number(pageSize) || 10, query: query || "", filter: filter || "" })

    const { questions } = data || {}

    return (

        <>
            <section className={`w-full flex flex-col-reverse sm:flex-row justify-between gap-4 items-center`}>
                <h1 className={`h1-bold text-dark100_light900`}>All Questions</h1>
                <Button className={`primary-gradient min-h-[46px] px-4 py-3 !text-light-900`} asChild>
                    <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
                </Button>
            </section>

            <section className={`mt-11`}>
                <LocalSearch
                    imgSrc={{ src: `/icons/search.svg`, alt: `search` }}
                    placeholder={`Search questions...`}
                    otherClasses={`flex-1`}
                    route={`/`}
                />
            </section>

            <HomeFilter />



            {!success && (
                <DataRenderer
                    success={success}
                    error={error}
                    data={questions}
                    empty={EMPTY_QUESTION}
                    render={(questions) => (
                        questions.map((question) => {
                            return (
                                <div className={`mt-10 flex w-full flex-col gap-6`} key={question._id}>
                                    <QuestionCard key={question._id} question={question} />
                                </div>
                            )
                        })
                    )}

                />
            )}
            <DataRenderer
                success={success}
                error={error}
                data={questions}
                empty={EMPTY_QUESTION}
                render={(questions) => (
                    <div className="mt-10 flex w-full flex-col gap-6">
                        {questions.map((question) => (
                            <QuestionCard key={question._id} question={question} />
                        ))}
                    </div>
                )}
            />

        </>
    );
}

export default Home;
