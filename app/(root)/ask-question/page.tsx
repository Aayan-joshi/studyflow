import React from 'react'
import QuestionForm from "@/components/forms/QuestionForm";
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const AskQuestion = async () => {
    const session = await auth()
    if(!session) return redirect('/sign-in')


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
export default AskQuestion
