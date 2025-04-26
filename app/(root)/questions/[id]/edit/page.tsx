import React from 'react'
import QuestionForm from "@/components/forms/QuestionForm";
import { auth } from '@/auth';
import { notFound, redirect } from 'next/navigation';
import { RouteParams } from '@/types/global';

const EditQuestion = async ({ params }: RouteParams) => {
    const { id } = await params;
    if (!id) return notFound()

    const session = await auth()
    if (!session) return redirect('/sign-in')

    // const {data:question, success} = await 

    return (
        <div>
            <div className={`h1-bold text-dark100_light900`}>
                Ask a question
            </div>
            <div className={`mt-9`}>
                <QuestionForm />
            </div>

        </div>
    )
}
export default EditQuestion
